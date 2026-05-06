# 查看architecture.html，做一个在本地部署的计划书
_Exported on 05/06/2026 at 13:44:57 GMT+8 from Claude via WayLog_


**User**

查看architecture.html，做一个在本地部署的计划书

---


**Claude**

Let me explore the actual project structure to understand what's already in place.

---


**Claude**

Let me explore a few more deployment files before designing the plan.

---


**Claude**

Now I have a thorough understanding of the project. Let me write the deployment plan.

---


**Claude**

计划书已写好，核心要点：

- **推荐方案**：Docker Compose 拉取预构建镜像（`docker-compose.local.yml`），不需要本地 Go/Node 编译环境，数据存本地目录方便备份迁移。
- **三条命令起步**：下载 compose 文件 → 配置 `.env` → `docker compose up -d`
- **已考虑 macOS 适配**：调整了 PG/Redis 内存参数，日志输出到 stdout，用 `sed -i ''` 兼容 BSD sed。
- **包含完整运维指南**：启动/停止/更新/备份/故障排查。

---


**Claude**

已保存到 `docs/deployment-plan.md`。

计划书涵盖 12 个章节：

- **方案选择**：推荐 Docker Compose + 预构建镜像，macOS 不走 systemd 二进制安装
- **前置条件**：Docker Desktop/OrbStack、openssl、4GB+ 内存
- **分步部署**：下载文件 → 生成密钥 → 配置 .env → `docker compose up -d`
- **日常运维**：启动/停止/更新/备份/迁移/清理完整命令
- **关键配置**：JWT_SECRET、TOTP_KEY 必须固定否则重启后登录态失效
- **开发模式切换**：从预构建镜像切换到源码构建的两种路径
- **故障排查**：容器启动、DB 连接、登录态丢失等 6 个常见问题
- **验证清单**：11 项逐条确认

需要我开始执行部署吗？

---
