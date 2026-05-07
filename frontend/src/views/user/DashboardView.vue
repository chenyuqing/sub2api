<template>
  <AppLayout>
    <div class="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 py-6 lg:px-6">
      <div v-if="loading" class="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>

      <template v-else>
        <div class="grid gap-4 xl:grid-cols-12">
          <section class="dashboard-stat-card xl:col-span-3">
            <p class="dashboard-stat-label">{{ t('dashboard.balance') }}</p>
            <p class="dashboard-stat-value text-accent-500">${{ formatCurrency(balance) }}</p>
            <p class="dashboard-stat-hint">{{ dashboardCopy.balanceHint }}</p>
          </section>

          <section class="dashboard-stat-card xl:col-span-3">
            <p class="dashboard-stat-label">{{ t('dashboard.todayTokens') }}</p>
            <p class="dashboard-stat-value text-primary-500">{{ formatTokens(dashboardStats.today_tokens) }}</p>
            <p class="dashboard-stat-hint">{{ dashboardCopy.todayTokensHint }}</p>
          </section>

          <section class="dashboard-stat-card xl:col-span-3">
            <p class="dashboard-stat-label">{{ t('dashboard.todayCost') }}</p>
            <p class="dashboard-stat-value text-pink-500">${{ formatCurrency(dashboardStats.total_actual_cost) }}</p>
            <p class="dashboard-stat-hint">{{ dashboardCopy.totalCostHint }}</p>
          </section>

          <section class="dashboard-stat-card xl:col-span-3">
            <p class="dashboard-stat-label">{{ t('dashboard.apiKeys') }}</p>
            <p class="dashboard-stat-value text-ink-950 dark:text-white">{{ dashboardStats.active_api_keys }}</p>
            <p class="dashboard-stat-hint">{{ dashboardCopy.activeKeysHint }}</p>
          </section>

          <section class="dashboard-banner xl:col-span-12">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div class="space-y-1">
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-primary-600 dark:text-primary-300">
                  {{ dashboardCopy.balanceWarningKicker }}
                </p>
                <h2 class="text-lg font-semibold tracking-[-0.03em] text-ink-950 dark:text-white">
                  {{ dashboardCopy.balanceWarningTitle.replace('{balance}', formatCurrency(balance)) }}
                </h2>
                <p class="text-sm text-ink-600 dark:text-dark-300">
                  {{ dashboardCopy.balanceWarningDescription.replace('{threshold}', formatCurrency(balanceThreshold)) }}
                </p>
              </div>
              <router-link to="/redeem" class="btn btn-primary btn-md w-full lg:w-auto">
                {{ dashboardCopy.goToRedeem }}
              </router-link>
            </div>
          </section>

          <section class="dashboard-panel xl:col-span-7">
            <div class="dashboard-panel-header">
              <div>
                <p class="dashboard-section-kicker">{{ dashboardCopy.quickstartKicker }}</p>
                <h2 class="dashboard-section-title">{{ dashboardCopy.quickstartTitle }}</h2>
              </div>
              <button class="btn btn-secondary btn-sm" :disabled="!quickstartCommand" @click="copyQuickstart">
                {{ t('common.copy') }}
              </button>
            </div>
            <div class="p-4 pt-0">
              <pre class="dashboard-code-block"><code>{{ quickstartCommand || t('common.loading') }}</code></pre>
            </div>
          </section>

          <section class="dashboard-panel xl:col-span-5">
            <div class="dashboard-panel-header">
              <div>
                <p class="dashboard-section-kicker">{{ dashboardCopy.serviceKicker }}</p>
                <h2 class="dashboard-section-title">{{ dashboardCopy.serviceStatus }}</h2>
              </div>
            </div>
            <div class="space-y-3 p-4 pt-0">
              <div v-for="item in serviceItems" :key="item.label" class="dashboard-service-row">
                <div class="flex items-center gap-3">
                  <span :class="['dashboard-dot', item.tone]"></span>
                  <span class="text-sm text-ink-700 dark:text-dark-100">{{ item.label }}</span>
                </div>
                <span class="text-sm font-medium text-ink-950 dark:text-white">{{ item.status }}</span>
              </div>
            </div>
          </section>

          <section class="dashboard-panel xl:col-span-7">
            <div class="dashboard-panel-header">
              <div>
                <p class="dashboard-section-kicker">{{ dashboardCopy.recentUsageKicker }}</p>
                <h2 class="dashboard-section-title">{{ dashboardCopy.recentUsage }}</h2>
              </div>
              <router-link to="/usage" class="btn btn-secondary btn-sm">{{ dashboardCopy.viewAllUsage }}</router-link>
            </div>
            <div class="p-4 pt-0">
              <div v-if="recentUsageLoading" class="flex justify-center py-10">
                <LoadingSpinner size="md" />
              </div>
              <div v-else-if="recentUsage.length === 0" class="rounded-2xl border border-dashed border-ink-200 bg-white/60 p-8 text-center text-sm text-ink-500 dark:border-dark-700 dark:bg-dark-900/40 dark:text-dark-400">
                {{ dashboardCopy.noUsageRecords }}
              </div>
              <div v-else class="overflow-hidden rounded-2xl border border-ink-200/80 bg-white/75 dark:border-dark-700 dark:bg-dark-900/50">
                <table class="min-w-full text-left text-sm">
                  <thead class="bg-white/70 text-xs uppercase tracking-[0.18em] text-ink-500 dark:bg-dark-900/80 dark:text-dark-400">
                    <tr>
                      <th class="px-4 py-3 font-medium">{{ dashboardCopy.tableTime }}</th>
                      <th class="px-4 py-3 font-medium">{{ dashboardCopy.tableModel }}</th>
                      <th class="px-4 py-3 font-medium text-right">{{ dashboardCopy.tableTokens }}</th>
                      <th class="px-4 py-3 font-medium text-right">{{ dashboardCopy.tableCost }}</th>
                      <th class="px-4 py-3 font-medium text-right">{{ dashboardCopy.tableStatus }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="log in recentUsage"
                      :key="log.id"
                      class="border-t border-ink-100/80 text-ink-800 transition-colors hover:bg-ink-50/70 dark:border-dark-700 dark:text-dark-100 dark:hover:bg-dark-800/40"
                    >
                      <td class="px-4 py-3 text-xs text-ink-500 dark:text-dark-400">{{ formatDateTime(log.created_at) }}</td>
                      <td class="px-4 py-3 font-medium">{{ log.model }}</td>
                      <td class="px-4 py-3 text-right">{{ formatNumber(log.input_tokens + log.output_tokens) }}</td>
                      <td class="px-4 py-3 text-right text-primary-600 dark:text-primary-300">${{ formatCurrency(log.actual_cost) }}</td>
                      <td class="px-4 py-3 text-right">
                        <span class="dashboard-status-tag">{{ t('common.active') }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section class="dashboard-panel xl:col-span-5">
            <div class="dashboard-panel-header">
              <div>
                <p class="dashboard-section-kicker">{{ dashboardCopy.performanceKicker }}</p>
                <h2 class="dashboard-section-title">{{ dashboardCopy.performance }}</h2>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 p-4 pt-0">
              <div class="dashboard-mini-metric">
                <p class="dashboard-mini-label">RPM</p>
                <p class="dashboard-mini-value">{{ formatNumber(dashboardStats.rpm) }}</p>
              </div>
              <div class="dashboard-mini-metric">
                <p class="dashboard-mini-label">TPM</p>
                <p class="dashboard-mini-value">{{ formatNumber(dashboardStats.tpm) }}</p>
              </div>
              <div class="dashboard-mini-metric">
                <p class="dashboard-mini-label">{{ dashboardCopy.averageTime }}</p>
                <p class="dashboard-mini-value">{{ formatDuration(dashboardStats.average_duration_ms) }}</p>
              </div>
              <div class="dashboard-mini-metric">
                <p class="dashboard-mini-label">{{ dashboardCopy.concurrent }}</p>
                <p class="dashboard-mini-value">{{ user?.concurrency ?? 1 }}</p>
              </div>
            </div>
          </section>

          <section class="dashboard-panel xl:col-span-4">
            <div class="dashboard-panel-header">
              <div>
                <p class="dashboard-section-kicker">{{ dashboardCopy.inviteBonusKicker }}</p>
                <h2 class="dashboard-section-title">{{ dashboardCopy.inviteBonusTitle }}</h2>
              </div>
              <router-link to="/affiliate" class="btn btn-secondary btn-sm">{{ t('common.view') }}</router-link>
            </div>
            <div class="space-y-4 p-4 pt-0">
              <div class="dashboard-hero-stat">
                <p class="dashboard-mini-label">{{ dashboardCopy.inviteCode }}</p>
                <p class="dashboard-hero-value font-mono text-2xl break-all leading-tight">
                  {{ affiliateDetail?.aff_code || '-' }}
                </p>
              </div>
              <div class="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <div class="dashboard-mini-metric min-w-0">
                  <p class="dashboard-mini-label">{{ dashboardCopy.totalRewards }}</p>
                  <p class="dashboard-mini-value">¥{{ formatCurrency(affiliateDetail?.aff_history_quota ?? 0) }}</p>
                </div>
                <div class="dashboard-mini-metric min-w-0">
                  <p class="dashboard-mini-label">{{ dashboardCopy.availableQuota }}</p>
                  <p class="dashboard-mini-value text-emerald-500">¥{{ formatCurrency(affiliateDetail?.aff_quota ?? 0) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2 rounded-2xl border border-ink-200 bg-white/70 px-3 py-2 dark:border-dark-700 dark:bg-dark-900/50">
                <code class="min-w-0 flex-1 truncate text-xs text-ink-600 dark:text-dark-300">{{ inviteLink }}</code>
                <button class="btn btn-secondary btn-sm" :disabled="!inviteLink" @click="copyInviteLink">{{ t('common.copy') }}</button>
              </div>
            </div>
          </section>

          <section class="dashboard-panel xl:col-span-4">
            <div class="dashboard-panel-header">
              <div>
                <p class="dashboard-section-kicker">{{ dashboardCopy.modelDistributionKicker }}</p>
                <h2 class="dashboard-section-title">{{ dashboardCopy.modelDistribution }}</h2>
              </div>
            </div>
            <div class="space-y-3 p-4 pt-0">
              <div v-if="modelDistribution.length === 0" class="rounded-2xl border border-dashed border-ink-200 bg-white/60 p-6 text-center text-sm text-ink-500 dark:border-dark-700 dark:bg-dark-900/40 dark:text-dark-400">
                {{ dashboardCopy.noDataAvailable }}
              </div>
              <div v-else v-for="item in modelDistribution" :key="item.model" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="truncate text-ink-700 dark:text-dark-100" :title="item.model">{{ item.model }}</span>
                  <span class="font-medium text-ink-950 dark:text-white">{{ item.percent }}%</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-dark-800">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-primary-500 via-pink-500 to-accent-500"
                    :style="{ width: `${item.percent}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </section>

          <section class="dashboard-panel xl:col-span-4">
            <div class="dashboard-panel-header">
              <div>
                <p class="dashboard-section-kicker">{{ dashboardCopy.teamKicker }}</p>
                <h2 class="dashboard-section-title">{{ dashboardCopy.teamTitle }}</h2>
              </div>
            </div>
            <div class="space-y-3 p-4 pt-0">
              <dl class="space-y-3">
                <div class="dashboard-definition-row">
                  <dt>{{ dashboardCopy.workspace }}</dt>
                  <dd>{{ dashboardCopy.personalWorkspace }}</dd>
                </div>
                <div class="dashboard-definition-row">
                  <dt>{{ dashboardCopy.seat }}</dt>
                  <dd>1 / 1</dd>
                </div>
                <div class="dashboard-definition-row">
                  <dt>{{ dashboardCopy.role }}</dt>
                  <dd>{{ user?.role || 'user' }}</dd>
                </div>
              </dl>
              <p class="rounded-2xl border border-ink-200 bg-white/70 p-3 text-sm text-ink-600 dark:border-dark-700 dark:bg-dark-900/50 dark:text-dark-300">
                {{ dashboardCopy.teamNote }}
              </p>
            </div>
          </section>

          <section class="dashboard-panel xl:col-span-6">
            <div class="dashboard-panel-header">
              <div>
                <p class="dashboard-section-kicker">{{ dashboardCopy.alertsKicker }}</p>
                <h2 class="dashboard-section-title">{{ dashboardCopy.alertsTitle }}</h2>
              </div>
            </div>
            <div class="space-y-4 p-4 pt-0">
              <label class="space-y-2">
                <span class="text-sm font-medium text-ink-700 dark:text-dark-100">{{ dashboardCopy.notifyEmail }}</span>
                <input
                  type="email"
                  class="input"
                  :value="user?.email || ''"
                  disabled
                >
              </label>
              <label class="space-y-2">
                <span class="text-sm font-medium text-ink-700 dark:text-dark-100">{{ dashboardCopy.balanceThreshold }}</span>
                <input
                  type="number"
                  class="input"
                  :value="balanceThreshold"
                  disabled
                >
              </label>
              <div class="space-y-3 rounded-2xl border border-ink-200 bg-white/70 p-4 dark:border-dark-700 dark:bg-dark-900/50">
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm text-ink-700 dark:text-dark-100">{{ dashboardCopy.balanceLowReminder }}</span>
                  <span :class="user?.balance_notify_enabled ? 'dashboard-switch-on' : 'dashboard-switch-off'">
                    {{ user?.balance_notify_enabled ? t('common.enabled') : t('common.disabled') }}
                  </span>
                </div>
                <div class="flex items-center justify-between gap-4">
                  <span class="text-sm text-ink-700 dark:text-dark-100">{{ dashboardCopy.serviceAlert }}</span>
                  <span class="dashboard-switch-on">{{ t('common.enabled') }}</span>
                </div>
                <p class="text-xs leading-6 text-ink-500 dark:text-dark-400">
                  {{ dashboardCopy.alertsNote }}
                </p>
              </div>
            </div>
          </section>

          <section class="dashboard-panel xl:col-span-6">
            <div class="dashboard-panel-header">
              <div>
                <p class="dashboard-section-kicker">{{ dashboardCopy.quickActionsKicker }}</p>
                <h2 class="dashboard-section-title">{{ dashboardCopy.quickActions }}</h2>
              </div>
            </div>
            <div class="space-y-3 p-4 pt-0">
              <button class="dashboard-action-row" @click="router.push('/keys')">
                <div class="dashboard-action-icon dashboard-action-icon-primary">
                  <Icon name="key" size="md" class="text-primary-700 dark:text-primary-200" />
                </div>
                <div class="min-w-0 flex-1 text-left">
                  <p class="text-sm font-medium text-ink-950 dark:text-white">{{ dashboardCopy.createApiKey }}</p>
                  <p class="text-xs text-ink-500 dark:text-dark-400">{{ dashboardCopy.generateNewKey }}</p>
                </div>
                <Icon name="chevronRight" size="md" class="text-ink-400 dark:text-dark-500" />
              </button>

              <button class="dashboard-action-row" @click="router.push('/usage')">
                <div class="dashboard-action-icon dashboard-action-icon-dark">
                  <Icon name="chart" size="md" class="text-ink-700 dark:text-dark-200" />
                </div>
                <div class="min-w-0 flex-1 text-left">
                  <p class="text-sm font-medium text-ink-950 dark:text-white">{{ dashboardCopy.viewUsage }}</p>
                  <p class="text-xs text-ink-500 dark:text-dark-400">{{ dashboardCopy.checkDetailedLogs }}</p>
                </div>
                <Icon name="chevronRight" size="md" class="text-ink-400 dark:text-dark-500" />
              </button>

              <button class="dashboard-action-row" @click="router.push('/redeem')">
                <div class="dashboard-action-icon dashboard-action-icon-accent">
                  <Icon name="gift" size="md" class="text-pink-700 dark:text-pink-200" />
                </div>
                <div class="min-w-0 flex-1 text-left">
                  <p class="text-sm font-medium text-ink-950 dark:text-white">{{ dashboardCopy.redeemCode }}</p>
                  <p class="text-xs text-ink-500 dark:text-dark-400">{{ dashboardCopy.addBalanceWithCode }}</p>
                </div>
                <Icon name="chevronRight" size="md" class="text-ink-400 dark:text-dark-500" />
              </button>
            </div>
          </section>
        </div>
      </template>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { usageAPI, type UserDashboardStats as UserStatsType } from '@/api/usage'
import userAPI from '@/api/user'
import AppLayout from '@/components/layout/AppLayout.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Icon from '@/components/icons/Icon.vue'
import { useClipboard } from '@/composables/useClipboard'
import { formatDateTime } from '@/utils/format'
import type { UsageLog, ModelStat, UserAffiliateDetail } from '@/types'

const router = useRouter()
const { t, locale } = useI18n()
const authStore = useAuthStore()
const appStore = useAppStore()
const { copyToClipboard } = useClipboard()

const user = computed(() => authStore.user)
const balance = computed(() => user.value?.balance ?? 0)
const balanceThreshold = computed(() => user.value?.balance_notify_threshold ?? 10)
const apiBaseUrl = computed(() => {
  const raw = appStore.cachedPublicSettings?.api_base_url || appStore.apiBaseUrl || window.location.origin
  return raw.replace(/\/$/, '')
})
const quickstartCommand = computed(() => {
  if (!apiBaseUrl.value) return ''
  return `export OPENAI_BASE_URL=${apiBaseUrl.value}/v1\nexport OPENAI_API_KEY=bc-live-your-key`
})

const stats = ref<UserStatsType | null>(null)
const modelStats = ref<ModelStat[]>([])
const recentUsage = ref<UsageLog[]>([])
const affiliateDetail = ref<UserAffiliateDetail | null>(null)

const loading = ref(false)
const recentUsageLoading = ref(false)

const emptyStats: UserStatsType = {
  total_api_keys: 0,
  active_api_keys: 0,
  total_requests: 0,
  total_input_tokens: 0,
  total_output_tokens: 0,
  total_cache_creation_tokens: 0,
  total_cache_read_tokens: 0,
  total_tokens: 0,
  total_cost: 0,
  total_actual_cost: 0,
  today_requests: 0,
  today_input_tokens: 0,
  today_output_tokens: 0,
  today_cache_creation_tokens: 0,
  today_cache_read_tokens: 0,
  today_tokens: 0,
  today_cost: 0,
  today_actual_cost: 0,
  average_duration_ms: 0,
  rpm: 0,
  tpm: 0
}

const dashboardStats = computed(() => stats.value ?? emptyStats)

const dashboardCopy = computed(() => {
  const zh = locale.value === 'zh'
  return zh
    ? {
        balanceHint: '当前用户余额',
        todayTokensHint: '今日真实 Token 消耗',
        totalCostHint: '实际 GPT/Codex 扣费',
        activeKeysHint: '按用户独立隔离',
        balanceWarningTitle: '余额 {balance}，建议先补额',
        balanceWarningDescription: '低余额阈值为 {threshold}。长任务可能因为余额不足中断。',
        balanceWarningKicker: '余额提醒',
        goToRedeem: '去兑换码',
        quickstartKicker: '快速开始',
        quickstartTitle: '复制配置到你的开发工具',
        serviceKicker: '服务状态',
        serviceStatus: '服务状态',
        servicePayment: '支付功能',
        serviceBalanceNotify: '余额提醒',
        serviceChannelMonitor: '渠道监控',
        recentUsageKicker: '最近使用',
        recentUsage: '最近使用',
        viewAllUsage: '查看全部',
        noUsageRecords: '暂无使用记录',
        tableTime: '时间',
        tableModel: '模型',
        tableTokens: 'Token',
        tableCost: '费用',
        tableStatus: '状态',
        performanceKicker: '性能指标',
        performance: '性能指标',
        averageTime: '平均时间',
        concurrent: '并发',
        inviteBonusKicker: '邀请奖励',
        inviteBonusTitle: '邀请奖励',
        totalRewards: '累计奖励',
        inviteCode: '邀请码',
        availableQuota: '可用额度',
        modelDistributionKicker: '模型分布',
        teamTitle: '团队工作区',
        teamKicker: '团队',
        workspace: '工作区',
        personalWorkspace: '个人工作区',
        seat: '席位',
        role: '角色',
        teamNote: '团队成员、多 Key 分组和成员限额会在后端接口接入后同步。',
        alertsKicker: '告警',
        alertsTitle: '告警订阅',
        notifyEmail: '通知邮箱',
        balanceThreshold: '余额提醒阈值',
        balanceLowReminder: '余额低于阈值时提醒',
        serviceAlert: '服务异常或账号池异常时提醒',
        alertsNote: '告警偏好会先保存在当前浏览器，邮件发送待后端通知模板接入。',
        quickActionsKicker: '快捷操作',
        quickActions: '快捷操作',
        createApiKey: '创建 API 密钥',
        generateNewKey: '生成新的 API 密钥',
        viewUsage: '查看使用记录',
        checkDetailedLogs: '查看详细的使用日志',
        redeemCode: '兑换码',
        addBalanceWithCode: '使用兑换码充值',
        modelDistribution: '模型分布',
        noDataAvailable: '暂无数据'
      }
    : {
        balanceHint: 'Current user balance',
        todayTokensHint: 'Real token usage today',
        totalCostHint: 'Actual GPT/Codex charges',
        activeKeysHint: 'Isolated per user',
        balanceWarningTitle: 'Balance ${balance}, please recharge soon',
        balanceWarningDescription: 'Low-balance threshold is ${threshold}. Long-running jobs may stop if funds run out.',
        balanceWarningKicker: 'Balance Warning',
        goToRedeem: 'Go to Redeem',
        quickstartKicker: 'Quickstart',
        quickstartTitle: 'Copy the config into your dev tool',
        serviceKicker: 'Service Status',
        serviceStatus: 'Service Status',
        servicePayment: 'Payment Enabled',
        serviceBalanceNotify: 'Balance Alerts',
        serviceChannelMonitor: 'Channel Monitoring',
        recentUsageKicker: 'Recent Usage',
        recentUsage: 'Recent Usage',
        viewAllUsage: 'View all usage',
        noUsageRecords: 'No usage records',
        tableTime: 'Time',
        tableModel: 'Model',
        tableTokens: 'Token',
        tableCost: 'Cost',
        tableStatus: 'Status',
        performanceKicker: 'Performance',
        performance: 'Performance',
        averageTime: 'Average time',
        concurrent: 'Concurrency',
        inviteBonusKicker: 'Invite Bonus',
        inviteBonusTitle: 'Invite Rewards',
        totalRewards: 'Total Rewards',
        inviteCode: 'Invite Code',
        availableQuota: 'Available Quota',
        modelDistributionKicker: 'Model Distribution',
        teamTitle: 'Team Workspace',
        teamKicker: 'Team',
        workspace: 'Workspace',
        personalWorkspace: 'Personal workspace',
        seat: 'Seat',
        role: 'Role',
        teamNote: 'Team members, multi-key groups, and member limits will sync after the backend interfaces are connected.',
        alertsKicker: 'Alerts',
        alertsTitle: 'Alert Subscriptions',
        notifyEmail: 'Notification Email',
        balanceThreshold: 'Balance Threshold',
        balanceLowReminder: 'Alert when balance falls below threshold',
        serviceAlert: 'Alert on service or account-pool issues',
        alertsNote: 'Alert preferences are stored locally first; email delivery will be wired to the backend notification templates later.',
        quickActionsKicker: 'Quick Actions',
        quickActions: 'Quick Actions',
        createApiKey: 'Create API Key',
        generateNewKey: 'Generate a new API key',
        viewUsage: 'View Usage',
        checkDetailedLogs: 'Check detailed usage logs',
        redeemCode: 'Redeem Code',
        addBalanceWithCode: 'Add balance with a code',
        modelDistribution: 'Model Distribution',
        noDataAvailable: 'No data available'
      }
})

const inviteLink = computed(() => {
  const code = affiliateDetail.value?.aff_code?.trim()
  if (!code) return ''
  if (typeof window === 'undefined') return `/register?aff=${encodeURIComponent(code)}`
  return `${window.location.origin}/register?aff=${encodeURIComponent(code)}`
})

const modelDistribution = computed(() => {
  const items = [...modelStats.value].sort((a, b) => b.total_tokens - a.total_tokens)
  const total = items.reduce((sum, item) => sum + (item.total_tokens || 0), 0)
  return items.slice(0, 4).map((item) => ({
    model: item.model,
    totalTokens: item.total_tokens,
    percent: total > 0 ? Math.max(1, Math.round((item.total_tokens / total) * 100)) : 0
  }))
})

const formatToggleState = (value: boolean | undefined): string => {
  if (value === undefined) return t('common.loading')
  return value ? t('common.enabled') : t('common.disabled')
}

const toneForToggleState = (value: boolean | undefined): string => {
  if (value === true) return 'dashboard-dot-success'
  if (value === false) return 'dashboard-dot-warn'
  return 'dashboard-dot-warn'
}

const serviceItems = computed(() => [
  {
    label: dashboardCopy.value.servicePayment,
    status: formatToggleState(appStore.cachedPublicSettings?.payment_enabled),
    tone: toneForToggleState(appStore.cachedPublicSettings?.payment_enabled)
  },
  {
    label: dashboardCopy.value.serviceBalanceNotify,
    status: formatToggleState(appStore.cachedPublicSettings?.balance_low_notify_enabled),
    tone: toneForToggleState(appStore.cachedPublicSettings?.balance_low_notify_enabled)
  },
  {
    label: dashboardCopy.value.serviceChannelMonitor,
    status: formatToggleState(appStore.cachedPublicSettings?.channel_monitor_enabled),
    tone: toneForToggleState(appStore.cachedPublicSettings?.channel_monitor_enabled)
  }
])

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0)

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en-US').format(value || 0)

const formatTokens = (value: number) => {
  const n = value || 0
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

const formatDuration = (value: number) => {
  const ms = value || 0
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`
  return `${ms.toFixed(0)}ms`
}

async function loadStats(): Promise<void> {
  loading.value = true
  try {
    await authStore.refreshUser()
    stats.value = await usageAPI.getDashboardStats()
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
    appStore.showError(t('dashboard.loadFailed'))
  } finally {
    loading.value = false
  }
}

async function loadCharts(): Promise<void> {
  try {
    const response = await usageAPI.getDashboardModels({
      start_date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0]
    })
    modelStats.value = response.models || []
  } catch (error) {
    console.error('Failed to load charts:', error)
    modelStats.value = []
  }
}

async function loadRecentUsage(): Promise<void> {
  recentUsageLoading.value = true
  try {
    const response = await usageAPI.getByDateRange(
      new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
      new Date().toISOString().split('T')[0]
    )
    recentUsage.value = response.items.slice(0, 5)
  } catch (error) {
    console.error('Failed to load recent usage:', error)
    recentUsage.value = []
  } finally {
    recentUsageLoading.value = false
  }
}

async function loadAffiliate(): Promise<void> {
  try {
    affiliateDetail.value = await userAPI.getAffiliateDetail()
  } catch (error) {
    console.error('Failed to load affiliate detail:', error)
    affiliateDetail.value = null
  }
}

async function copyQuickstart(): Promise<void> {
  if (!quickstartCommand.value) return
  await copyToClipboard(quickstartCommand.value, t('common.copied'))
}

async function copyInviteLink(): Promise<void> {
  if (!inviteLink.value) return
  await copyToClipboard(inviteLink.value, t('common.copied'))
}

onMounted(() => {
  void loadStats()
  void loadCharts()
  void loadRecentUsage()
  void loadAffiliate()
})
</script>

<style scoped>
.dashboard-pill {
  @apply inline-flex items-center justify-center rounded-full border border-ink-200 bg-white/80 px-4 py-2 text-sm font-medium text-ink-700 shadow-sm shadow-primary-900/5 backdrop-blur-sm transition-all duration-200;
  @apply hover:-translate-y-0.5 hover:bg-white hover:text-ink-950;
  @apply dark:border-dark-700 dark:bg-dark-900/70 dark:text-dark-100 dark:hover:bg-dark-800;
}

.dashboard-pill-success {
  @apply border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-200;
}

.dashboard-pill-accent {
  @apply border-pink-200 bg-pink-50 text-pink-600 dark:border-pink-500/30 dark:bg-pink-500/15 dark:text-pink-200;
}

.dashboard-pill-ghost {
  @apply cursor-pointer bg-transparent;
}

.dashboard-stat-card,
.dashboard-panel,
.dashboard-banner {
  @apply rounded-[1.5rem] border border-ink-200/80 bg-white/75 shadow-[0_18px_40px_rgba(255,130,181,0.10)] backdrop-blur-sm;
  @apply dark:border-dark-700/80 dark:bg-dark-900/50 dark:shadow-[0_18px_40px_rgba(2,6,23,0.35)];
}

.dashboard-stat-card {
  @apply p-5;
}

.dashboard-banner {
  @apply border-pink-200/70 bg-gradient-to-r from-white/80 via-pink-50/60 to-white/80 p-5 dark:border-pink-500/25 dark:from-dark-900/70 dark:via-pink-950/20 dark:to-dark-900/70;
}

.dashboard-panel {
  @apply overflow-hidden;
}

.dashboard-panel-header {
  @apply flex items-start justify-between gap-3 px-5 py-5;
}

.dashboard-section-kicker {
  @apply text-xs font-semibold uppercase tracking-[0.22em] text-primary-600 dark:text-primary-300;
}

.dashboard-section-title {
  @apply mt-1 text-lg font-semibold tracking-[-0.03em] text-ink-950 dark:text-white;
}

.dashboard-stat-label,
.dashboard-mini-label {
  @apply text-sm text-ink-500 dark:text-dark-400;
}

.dashboard-stat-value {
  @apply mt-3 text-3xl font-semibold tracking-[-0.04em];
}

.dashboard-stat-hint {
  @apply mt-2 text-xs text-ink-500 dark:text-dark-400;
}

.dashboard-code-block {
  @apply overflow-auto rounded-[1.25rem] bg-gradient-to-r from-[#1f1f39] via-[#4d2f83] to-[#6d4cf0] p-4 text-sm leading-6 text-white shadow-inner shadow-black/20;
}

.dashboard-service-row {
  @apply flex items-center justify-between rounded-2xl border border-ink-200/70 bg-white/70 px-4 py-3 dark:border-dark-700 dark:bg-dark-900/50;
}

.dashboard-dot {
  @apply h-2.5 w-2.5 rounded-full;
}

.dashboard-dot-success {
  @apply bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)];
}

.dashboard-dot-warn {
  @apply bg-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.12)];
}

.dashboard-mini-metric {
  @apply min-w-0 rounded-2xl border border-ink-200/70 bg-white/70 p-4 dark:border-dark-700 dark:bg-dark-900/50;
}

.dashboard-mini-value {
  @apply mt-2 min-w-0 text-2xl font-semibold tracking-[-0.04em] text-ink-950 dark:text-white;
}

.dashboard-hero-stat {
  @apply rounded-2xl border border-ink-200/70 bg-gradient-to-br from-white to-pink-50/70 p-4 dark:border-dark-700 dark:from-dark-900/70 dark:to-pink-950/20;
}

.dashboard-hero-value {
  @apply mt-2 text-3xl font-semibold tracking-[-0.04em] text-ink-950 dark:text-white;
}

.dashboard-definition-row {
  @apply flex items-center justify-between rounded-2xl border border-ink-200/70 bg-white/70 px-4 py-3 text-sm dark:border-dark-700 dark:bg-dark-900/50;
}

.dashboard-definition-row dt {
  @apply text-ink-500 dark:text-dark-400;
}

.dashboard-definition-row dd {
  @apply font-medium text-ink-950 dark:text-white;
}

.dashboard-status-tag {
  @apply inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-200;
}

.dashboard-action-row {
  @apply flex w-full items-center gap-4 rounded-2xl border border-ink-200/70 bg-white/70 px-4 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-white dark:border-dark-700 dark:bg-dark-900/50 dark:hover:bg-dark-800/70;
}

.dashboard-action-icon {
  @apply flex h-11 w-11 flex-none items-center justify-center rounded-2xl;
}

.dashboard-action-icon-primary {
  @apply bg-primary-100 dark:bg-primary-500/20;
}

.dashboard-action-icon-dark {
  @apply bg-ink-100 dark:bg-dark-700;
}

.dashboard-action-icon-accent {
  @apply bg-pink-100 dark:bg-pink-500/20;
}
</style>
