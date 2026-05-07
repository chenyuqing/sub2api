#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$ROOT_DIR/deploy"
LAUNCHD_LABEL="com.sub2api.app"
LAUNCHD_USER_PLIST="$HOME/Library/LaunchAgents/${LAUNCHD_LABEL}.plist"
LAUNCHD_SYSTEM_PLIST="/Library/LaunchDaemons/${LAUNCHD_LABEL}.plist"
SYSTEMD_SERVICE="sub2api.service"

usage() {
  cat <<EOF
Usage: $(basename "$0") <start|stop|restart|status>

Auto-detects the active deployment backend in this order:
  1. macOS launchd
  2. Linux systemd
  3. Docker Compose (deploy/docker-compose.local.yml or deploy/docker-compose.yml)
EOF
}

log() {
  printf '%s\n' "$*"
}

err() {
  printf '%s\n' "$*" >&2
}

has() {
  command -v "$1" >/dev/null 2>&1
}

run_privileged() {
  if [ "$(id -u)" -eq 0 ]; then
    "$@"
    return 0
  fi
  if has sudo; then
    sudo "$@"
    return 0
  fi
  "$@"
}

detect_backend() {
  if has launchctl && { [ -f "$LAUNCHD_USER_PLIST" ] || [ -f "$LAUNCHD_SYSTEM_PLIST" ]; }; then
    echo "launchd"
    return 0
  fi

  if has systemctl && (systemctl list-unit-files --type=service 2>/dev/null | awk '{print $1}' | grep -qx "$SYSTEMD_SERVICE" || [ -f "/etc/systemd/system/$SYSTEMD_SERVICE" ]); then
    echo "systemd"
    return 0
  fi

  if has docker; then
    if [ -f "$DEPLOY_DIR/docker-compose.local.yml" ] || [ -f "$DEPLOY_DIR/docker-compose.yml" ]; then
      echo "compose"
      return 0
    fi
  fi

  echo "none"
}

compose_file() {
  if [ -f "$DEPLOY_DIR/docker-compose.local.yml" ]; then
    printf '%s\n' "$DEPLOY_DIR/docker-compose.local.yml"
    return 0
  fi
  if [ -f "$DEPLOY_DIR/docker-compose.yml" ]; then
    printf '%s\n' "$DEPLOY_DIR/docker-compose.yml"
    return 0
  fi
  return 1
}

compose() {
  local file
  file="$(compose_file)" || {
    err "No docker compose file found in $DEPLOY_DIR"
    exit 1
  }
  (cd "$DEPLOY_DIR" && docker compose -f "$file" "$@")
}

launchd_scope() {
  if [ -f "$LAUNCHD_USER_PLIST" ]; then
    printf '%s\n' "gui/$(id -u)"
    return 0
  fi
  printf '%s\n' "system"
}

launchd_plist() {
  if [ -f "$LAUNCHD_USER_PLIST" ]; then
    printf '%s\n' "$LAUNCHD_USER_PLIST"
    return 0
  fi
  if [ -f "$LAUNCHD_SYSTEM_PLIST" ]; then
    printf '%s\n' "$LAUNCHD_SYSTEM_PLIST"
    return 0
  fi
  return 1
}

launchd_start() {
  local scope plist target
  scope="$(launchd_scope)"
  plist="$(launchd_plist)" || {
    err "No launchd plist found at $LAUNCHD_USER_PLIST or $LAUNCHD_SYSTEM_PLIST"
    exit 1
  }
  target="${scope}/${LAUNCHD_LABEL}"

  if launchctl print "$target" >/dev/null 2>&1; then
    if [ "$scope" = "system" ]; then
      run_privileged launchctl kickstart -k "$target"
    else
      launchctl kickstart -k "$target"
    fi
  else
    if [ "$scope" = "system" ]; then
      run_privileged launchctl bootstrap "$scope" "$plist" >/dev/null 2>&1 || true
      run_privileged launchctl kickstart -k "$target"
    else
      launchctl bootstrap "$scope" "$plist" >/dev/null 2>&1 || true
      launchctl kickstart -k "$target"
    fi
  fi
}

launchd_stop() {
  local scope plist target
  scope="$(launchd_scope)"
  plist="$(launchd_plist)" || {
    err "No launchd plist found at $LAUNCHD_USER_PLIST or $LAUNCHD_SYSTEM_PLIST"
    exit 1
  }
  target="${scope}/${LAUNCHD_LABEL}"
  if [ "$scope" = "system" ]; then
    run_privileged launchctl bootout "$scope" "$plist" >/dev/null 2>&1 || run_privileged launchctl bootout "$target" >/dev/null 2>&1 || true
  else
    launchctl bootout "$scope" "$plist" >/dev/null 2>&1 || launchctl bootout "$target" >/dev/null 2>&1 || true
  fi
}

launchd_status() {
  local scope target
  scope="$(launchd_scope)"
  target="${scope}/${LAUNCHD_LABEL}"
  if launchctl print "$target" >/dev/null 2>&1; then
    log "launchd: running ($target)"
    return 0
  fi
  log "launchd: stopped ($target)"
  return 3
}

systemd_start() {
  run_privileged systemctl start "$SYSTEMD_SERVICE"
}

systemd_stop() {
  run_privileged systemctl stop "$SYSTEMD_SERVICE"
}

systemd_status() {
  if run_privileged systemctl is-active --quiet "$SYSTEMD_SERVICE"; then
    log "systemd: running ($SYSTEMD_SERVICE)"
    run_privileged systemctl status --no-pager --lines=3 "$SYSTEMD_SERVICE" || true
    return 0
  fi
  log "systemd: stopped ($SYSTEMD_SERVICE)"
  return 3
}

systemd_restart() {
  run_privileged systemctl restart "$SYSTEMD_SERVICE"
}

compose_start() {
  compose up -d
}

compose_stop() {
  compose down
}

compose_status() {
  compose ps
}

compose_restart() {
  compose restart
}

main() {
  local action backend
  action="${1:-}"
  if [ -z "$action" ] || [ "$action" = "-h" ] || [ "$action" = "--help" ]; then
    usage
    exit 0
  fi

  backend="$(detect_backend)"
  if [ "$backend" = "none" ]; then
    err "Unable to detect a running deployment backend."
    err "Expected launchd plist, systemd service, or docker compose files under deploy/."
    exit 1
  fi

  case "$action" in
    start)
      log "Using backend: $backend"
      case "$backend" in
        launchd) launchd_start ;;
        systemd) systemd_start ;;
        compose) compose_start ;;
      esac
      ;;
    stop)
      log "Using backend: $backend"
      case "$backend" in
        launchd) launchd_stop ;;
        systemd) systemd_stop ;;
        compose) compose_stop ;;
      esac
      ;;
    restart)
      log "Using backend: $backend"
      case "$backend" in
        launchd)
          launchd_stop
          launchd_start
          ;;
        systemd) systemd_restart ;;
        compose) compose_restart ;;
      esac
      ;;
    status)
      case "$backend" in
        launchd) launchd_status ;;
        systemd) systemd_status ;;
        compose) compose_status ;;
      esac
      ;;
    *)
      usage
      exit 1
      ;;
  esac
}

main "$@"
