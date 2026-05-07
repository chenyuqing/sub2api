<template>
  <AppLayout>
    <div class="mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <section
        v-if="showBalanceWarning"
        class="rounded-[28px] border border-[#f1c4cf] bg-gradient-to-br from-[#fff4f3] via-white to-[#fff7fb] px-4 py-4 shadow-[0_1px_0_rgba(255,255,255,0.72),0_16px_42px_rgba(235,168,189,0.14)] sm:px-5"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="space-y-2">
            <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8d74e6]">
              {{ t('usage.balanceWarningKicker') }}
            </p>
            <h2 class="text-lg font-semibold tracking-[-0.04em] text-[#3a2f39] sm:text-xl">
              {{ t('usage.balanceWarningTitle', { balance: formatStatCurrency(balance) }) }}
            </h2>
            <p class="max-w-3xl text-sm leading-6 text-[#776974]">
              {{ t('usage.balanceWarningDescription', { threshold: formatStatCurrency(balanceThreshold) }) }}
            </p>
          </div>
          <RouterLink
            to="/redeem"
            class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f92] to-[#9a69ff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,95,146,0.24)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            {{ t('usage.goToRedeem') }}
          </RouterLink>
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <article class="rounded-[28px] border border-[#efe0e8] bg-white/92 p-4 shadow-[0_16px_40px_rgba(210,172,191,0.12)] sm:p-5">
          <div class="space-y-1">
            <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8d74e6]">
              {{ t('usage.recent7Days') }}
            </p>
            <h2 class="text-2xl font-semibold tracking-[-0.045em] text-[#241c2b]">
              {{ t('usage.recent7Days') }}
            </h2>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-2xl border border-[#f0e2df] bg-[#fffaf4] px-4 py-3">
              <p class="text-xs font-medium text-[#847983]">{{ t('usage.todayTokensLabel') }}</p>
              <p class="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#241c2b]">
                {{ formatStatTokens(todayTokens) }}
              </p>
            </div>
            <div class="rounded-2xl border border-[#f0e2df] bg-[#fffaf4] px-4 py-3">
              <p class="text-xs font-medium text-[#847983]">{{ t('usage.totalCostLabel') }}</p>
              <p class="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#241c2b]">
                {{ formatStatCurrency(rangeActualCost) }}
              </p>
            </div>
            <div class="rounded-2xl border border-[#f0e2df] bg-[#fffaf4] px-4 py-3">
              <p class="text-xs font-medium text-[#847983]">{{ t('usage.activeKeysLabel') }}</p>
              <p class="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#241c2b]">
                {{ formatStatCount(activeApiKeys) }}
              </p>
            </div>
          </div>

          <div class="mt-5">
            <div
              v-if="chartHasData"
              class="flex h-[248px] items-end gap-3 rounded-[24px] border border-[#f3dee8] bg-gradient-to-b from-white to-[#fff8fb] px-4 py-5 sm:px-5"
            >
              <div
                v-for="point in chartBars"
                :key="point.date"
                class="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div class="flex h-full w-full items-end">
                  <div
                    class="mx-auto w-full max-w-[52px] rounded-t-[14px] bg-gradient-to-t from-[#7b5cff] via-[#ff5f92] to-[#ff5f92] shadow-[0_10px_24px_rgba(255,95,146,0.16)]"
                    :style="{ height: point.height + '%' }"
                    :title="`${point.label}: ${point.totalTokens.toLocaleString()} tokens`"
                  />
                </div>
                <div class="text-[11px] font-medium text-[#9a8795]">
                  {{ point.label }}
                </div>
              </div>
            </div>
            <div v-else class="flex h-[248px] items-center justify-center rounded-[24px] border border-dashed border-[#f3dee8] bg-gradient-to-b from-white to-[#fff8fb] px-4 py-5 sm:px-5">
              <p class="text-sm text-[#9a8795]">{{ t('usage.noTrendData') }}</p>
            </div>
          </div>
        </article>

        <article class="rounded-[28px] border border-[#efe0e8] bg-white/92 p-4 shadow-[0_16px_40px_rgba(210,172,191,0.12)] sm:p-5">
          <div class="space-y-1">
            <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8d74e6]">
              {{ t('usage.callDetails') }}
            </p>
            <h2 class="text-2xl font-semibold tracking-[-0.045em] text-[#241c2b]">
              {{ t('usage.callDetails') }}
            </h2>
          </div>

          <div class="mt-4 overflow-hidden rounded-[22px] border border-[#f0e2df] bg-white/95">
            <DataTable
              :columns="columns"
              :data="usageLogs"
              :loading="loading"
              :server-side-sort="true"
              default-sort-key="created_at"
              default-sort-order="desc"
              @sort="handleSort"
            >
              <template #cell-api_key="{ row }">
                <span class="text-sm font-medium text-[#2f2433]">
                  {{ row.api_key?.name || '-' }}
                </span>
              </template>

              <template #cell-model="{ value }">
                <span class="text-sm font-medium text-[#2f2433]">{{ value }}</span>
              </template>

              <template #cell-reasoning_effort="{ row }">
                <span class="text-sm text-[#514a57]">
                  {{ formatReasoningEffort(row.reasoning_effort) }}
                </span>
              </template>

              <template #cell-endpoint="{ row }">
                <span class="block max-w-[260px] break-all text-sm text-[#514a57]">
                  {{ formatUsageEndpoints(row) }}
                </span>
              </template>

              <template #cell-type="{ row }">
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  :class="getRequestTypeBadgeClass(row)"
                >
                  {{ getRequestTypeLabel(row) }}
                </span>
              </template>

              <template #cell-billing_mode="{ row }">
                <span
                  class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  :class="getBillingModeBadgeClass(row.billing_mode)"
                >
                  {{ getBillingModeLabel(row.billing_mode, t) }}
                </span>
              </template>

              <template #cell-tokens="{ row }">
                <div v-if="row.image_count > 0 && row.billing_mode === 'image'" class="flex items-center gap-1.5 text-sm">
                  <Icon name="chart" size="sm" class="text-[#8d74e6]" />
                  <span class="font-medium text-[#241c2b]">{{ row.image_count }}{{ $t('usage.imageUnit') }}</span>
                  <span class="text-[#9a8795]">({{ row.image_size || '2K' }})</span>
                </div>
                <div v-else class="space-y-1 text-sm">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-[#241c2b]">{{ row.input_tokens.toLocaleString() }}</span>
                    <span class="text-[#9a8795]">{{ t('usage.in') }}</span>
                    <span class="font-medium text-[#241c2b]">{{ row.output_tokens.toLocaleString() }}</span>
                    <span class="text-[#9a8795]">{{ t('usage.out') }}</span>
                  </div>
                  <div
                    v-if="row.cache_read_tokens > 0 || row.cache_creation_tokens > 0"
                    class="flex flex-wrap items-center gap-2 text-[11px]"
                  >
                    <span v-if="row.cache_read_tokens > 0" class="rounded-full bg-[#eef7ff] px-2 py-0.5 text-[#3d79d8]">
                      {{ t('usage.cache') }} {{ formatCacheTokens(row.cache_read_tokens) }}
                    </span>
                    <span v-if="row.cache_creation_tokens > 0" class="rounded-full bg-[#fff4e9] px-2 py-0.5 text-[#d97706]">
                      {{ t('usage.cacheWrite') }} {{ formatCacheTokens(row.cache_creation_tokens) }}
                    </span>
                  </div>
                </div>
              </template>

              <template #cell-cost="{ row }">
                <span class="text-sm font-medium text-[#1f8f59]">
                  ${{ row.actual_cost.toFixed(6) }}
                </span>
              </template>

              <template #cell-first_token="{ row }">
                <span v-if="row.first_token_ms != null" class="text-sm text-[#514a57]">
                  {{ formatDuration(row.first_token_ms) }}
                </span>
                <span v-else class="text-sm text-[#b0a2ac]">-</span>
              </template>

              <template #cell-duration="{ row }">
                <span class="text-sm text-[#514a57]">{{ formatDuration(row.duration_ms) }}</span>
              </template>

              <template #cell-created_at="{ value }">
                <span class="text-sm text-[#514a57]">{{ formatDateTime(value) }}</span>
              </template>

              <template #cell-user_agent="{ row }">
                <span v-if="row.user_agent" class="block max-w-[260px] break-all text-sm text-[#514a57]" :title="row.user_agent">
                  {{ formatUserAgent(row.user_agent) }}
                </span>
                <span v-else class="text-sm text-[#b0a2ac]">-</span>
              </template>

              <template #empty>
                <div class="flex flex-col items-center justify-center px-6 py-14 text-center">
                  <p class="text-lg font-semibold text-[#2f2433]">{{ t('usage.noRecords') }}</p>
                </div>
              </template>
            </DataTable>
          </div>
        </article>
      </section>

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { usageAPI } from '@/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import DataTable from '@/components/common/DataTable.vue'
import Icon from '@/components/icons/Icon.vue'
import type { TrendDataPoint, UsageLog, UsageStatsResponse } from '@/types'
import type { Column } from '@/components/common/types'
import { formatDateTime, formatReasoningEffort } from '@/utils/format'
import { formatCacheTokens } from '@/utils/formatters'
import { getBillingModeBadgeClass, getBillingModeLabel } from '@/utils/billingMode'
import { getPersistedPageSize } from '@/composables/usePersistedPageSize'
import { resolveUsageRequestType } from '@/utils/usageRequestType'

const { t } = useI18n()
const appStore = useAppStore()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const columns = computed<Column[]>(() => [
  { key: 'api_key', label: t('usage.apiKeyFilter'), sortable: false },
  { key: 'model', label: t('usage.model'), sortable: true },
  { key: 'reasoning_effort', label: t('usage.reasoningEffort'), sortable: false },
  { key: 'endpoint', label: t('usage.endpoint'), sortable: false },
  { key: 'type', label: t('usage.type'), sortable: false },
  { key: 'billing_mode', label: t('usage.costDetails'), sortable: false },
  { key: 'tokens', label: t('usage.tokens'), sortable: false },
  { key: 'cost', label: t('usage.cost'), sortable: false },
  { key: 'first_token', label: t('usage.firstToken'), sortable: false },
  { key: 'duration', label: t('usage.duration'), sortable: false },
  { key: 'created_at', label: t('usage.time'), sortable: true },
  { key: 'user_agent', label: t('usage.userAgent'), sortable: false }
])

const dashboardStats = ref<{
  total_api_keys: number
  active_api_keys: number
  total_requests: number
  total_input_tokens: number
  total_output_tokens: number
  total_cache_creation_tokens: number
  total_cache_read_tokens: number
  total_tokens: number
  total_cost: number
  total_actual_cost: number
  today_requests: number
  today_input_tokens: number
  today_output_tokens: number
  today_cache_creation_tokens: number
  today_cache_read_tokens: number
  today_tokens: number
  today_cost: number
  today_actual_cost: number
  average_duration_ms: number
  rpm: number
  tpm: number
} | null>(null)

const rangeStats = ref<UsageStatsResponse | null>(null)
const trendPoints = ref<TrendDataPoint[]>([])
const usageLogs = ref<UsageLog[]>([])
const loading = ref(false)

let abortController: AbortController | null = null

const now = new Date()
const weekAgo = new Date(now)
weekAgo.setDate(weekAgo.getDate() - 6)

const startDate = ref(formatLocalDate(weekAgo))
const endDate = ref(formatLocalDate(now))

const pagination = reactive({
  page: 1,
  page_size: getPersistedPageSize(),
  total: 0,
  pages: 0
})

const sortState = reactive({
  sort_by: 'created_at',
  sort_order: 'desc' as 'asc' | 'desc'
})

const todayTokens = computed(() => dashboardStats.value?.today_tokens ?? null)
const rangeActualCost = computed(() => rangeStats.value?.total_actual_cost ?? null)
const activeApiKeys = computed(() => dashboardStats.value?.active_api_keys ?? null)
const balance = computed(() => user.value?.balance ?? 0)
const balanceThreshold = computed(() => user.value?.balance_notify_threshold ?? 10)
const showBalanceWarning = computed(() => user.value != null && balance.value <= balanceThreshold.value)
const chartHasData = computed(() => trendPoints.value.some((point) => point.total_tokens > 0))

const chartBars = computed(() => {
  const lookup = new Map(trendPoints.value.map((point) => [point.date, point]))
  const points: { date: string; label: string; totalTokens: number; height: number }[] = []
  const dates = enumerateDates(startDate.value, endDate.value)
  const maxTokens = Math.max(0, ...dates.map((date) => lookup.get(date)?.total_tokens ?? 0))

  for (const date of dates) {
    const point = lookup.get(date)
    const value = point?.total_tokens ?? 0
    const height = maxTokens > 0 ? Math.max(0, Math.round((value / maxTokens) * 100)) : 0
    points.push({
      date,
      label: formatTrendLabel(date),
      totalTokens: value,
      height
    })
  }

  return points
})

function formatLocalDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function enumerateDates(start: string, end: string): string[] {
  const dates: string[] = []
  const current = new Date(`${start}T00:00:00`)
  const last = new Date(`${end}T00:00:00`)
  while (current <= last) {
    dates.push(formatLocalDate(current))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

function formatTrendLabel(date: string): string {
  const [year, month, day] = date.split('-').map((v) => Number(v))
  if (!year || !month || !day) return date
  return `${month}/${day}`
}

const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms.toFixed(0)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

const formatUserAgent = (ua: string): string => ua

const getRequestTypeLabel = (log: UsageLog): string => {
  const requestType = resolveUsageRequestType(log)
  if (requestType === 'ws_v2') return t('usage.ws')
  if (requestType === 'stream') return t('usage.stream')
  if (requestType === 'sync') return t('usage.sync')
  return t('usage.unknown')
}

const getRequestTypeBadgeClass = (log: UsageLog): string => {
  const requestType = resolveUsageRequestType(log)
  if (requestType === 'ws_v2') return 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200'
  if (requestType === 'stream') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  if (requestType === 'sync') return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
}

const formatUsageEndpoints = (log: UsageLog): string => {
  return log.inbound_endpoint?.trim() || '-'
}

const formatTokens = (value: number): string => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
  return value.toLocaleString()
}

const formatStatTokens = (value: number | null): string => {
  return value == null ? '-' : formatTokens(value)
}

const formatStatCurrency = (value: number | null): string => {
  return value == null ? '-' : `$${value.toFixed(2)}`
}

const formatStatCount = (value: number | null): string => {
  return value == null ? '-' : value.toLocaleString()
}

type UsageTableQueryParams = {
  page: number
  page_size: number
  start_date: string
  end_date: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

const buildUsageQueryParams = (page: number, pageSize: number): UsageTableQueryParams => ({
  page,
  page_size: pageSize,
  start_date: startDate.value,
  end_date: endDate.value,
  sort_by: sortState.sort_by,
  sort_order: sortState.sort_order
})

const loadDashboardStats = async () => {
  try {
    dashboardStats.value = await usageAPI.getDashboardStats()
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
  }
}

const loadTrend = async () => {
  try {
    const response = await usageAPI.getDashboardTrend({
      start_date: startDate.value,
      end_date: endDate.value,
      granularity: 'day'
    })
    trendPoints.value = response.trend
  } catch (error) {
    console.error('Failed to load trend data:', error)
  }
}

const loadRangeStats = async () => {
  try {
    rangeStats.value = await usageAPI.getStatsByDateRange(startDate.value, endDate.value)
  } catch (error) {
    console.error('Failed to load range stats:', error)
  }
}

const loadUsageLogs = async () => {
  abortController?.abort()
  const controller = new AbortController()
  abortController = controller
  loading.value = true

  try {
    const response = await usageAPI.query(buildUsageQueryParams(pagination.page, pagination.page_size), {
      signal: controller.signal
    })

    if (controller.signal.aborted) return

    usageLogs.value = response.items
    pagination.total = response.total
    pagination.pages = response.pages
  } catch (error) {
    const abortError = error as { name?: string; code?: string }
    if (abortError?.name === 'AbortError' || abortError?.code === 'ERR_CANCELED') return
    appStore.showError(t('usage.failedToLoad'))
  } finally {
    if (abortController === controller) {
      loading.value = false
    }
  }
}

const loadPage = async () => {
  await Promise.allSettled([loadDashboardStats(), loadRangeStats(), loadTrend(), loadUsageLogs()])
}

const handleSort = (key: string, order: 'asc' | 'desc') => {
  sortState.sort_by = key
  sortState.sort_order = order
  pagination.page = 1
  void loadUsageLogs()
}

onMounted(() => {
  void loadPage()
})
</script>
