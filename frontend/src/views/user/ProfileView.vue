<template>
  <AppLayout>
    <div data-testid="profile-shell" class="mx-auto flex w-full max-w-[1240px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <section
        v-if="showBalanceWarning"
        class="rounded-[28px] border border-[#f1c4cf] bg-gradient-to-br from-[#fff4f3] via-white to-[#fff7fb] px-4 py-4 shadow-[0_1px_0_rgba(255,255,255,0.72),0_16px_42px_rgba(235,168,189,0.14)] sm:px-5"
      >
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="space-y-2">
            <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8d74e6]">
              {{ t('profile.balanceWarningKicker') }}
            </p>
            <h2 class="text-lg font-semibold tracking-[-0.04em] text-[#3a2f39] sm:text-xl">
              {{ t('profile.balanceWarningTitle', { balance: formatCurrency(balance) }) }}
            </h2>
            <p class="max-w-3xl text-sm leading-6 text-[#776974]">
              {{ t('profile.balanceWarningDescription', { threshold: formatCurrency(balanceThreshold) }) }}
            </p>
          </div>
          <RouterLink
            to="/redeem"
            class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#ff5f92] to-[#9a69ff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,95,146,0.24)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            {{ t('profile.goToRedeem') }}
          </RouterLink>
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <article class="rounded-[28px] border border-[#efe0e8] bg-white/92 p-4 shadow-[0_16px_40px_rgba(210,172,191,0.12)] sm:p-5">
          <div class="space-y-1">
            <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8d74e6]">
              {{ t('profile.overviewTitle') }}
            </p>
            <h2 class="text-2xl font-semibold tracking-[-0.045em] text-[#241c2b]">
              {{ t('profile.overviewTitle') }}
            </h2>
          </div>

          <dl class="mt-4 divide-y divide-[#f4e8ef] overflow-hidden rounded-[22px] border border-[#f0e2df] bg-white/95">
            <div class="grid grid-cols-[1fr_auto] gap-4 px-4 py-4">
              <dt class="text-sm text-[#8d7f8a]">{{ t('profile.accountBalance') }}</dt>
              <dd class="text-sm font-semibold text-[#241c2b]">${{ formatCurrency(balance) }}</dd>
            </div>
            <div class="grid grid-cols-[1fr_auto] gap-4 px-4 py-4">
              <dt class="text-sm text-[#8d7f8a]">{{ t('profile.concurrencyLimit') }}</dt>
              <dd class="text-sm font-semibold text-[#241c2b]">{{ user?.concurrency ?? 0 }}</dd>
            </div>
            <div class="grid grid-cols-[1fr_auto] gap-4 px-4 py-4">
              <dt class="text-sm text-[#8d7f8a]">{{ t('profile.memberSince') }}</dt>
              <dd class="text-sm font-semibold text-[#241c2b]">{{ formatDateOnly(user?.created_at) }}</dd>
            </div>
          </dl>
        </article>

        <article class="rounded-[28px] border border-[#efe0e8] bg-white/92 p-4 shadow-[0_16px_40px_rgba(210,172,191,0.12)] sm:p-5">
          <div class="space-y-1">
            <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8d74e6]">
              {{ t('profile.title') }}
            </p>
            <h2 class="text-2xl font-semibold tracking-[-0.045em] text-[#241c2b]">
              {{ t('profile.basicsTitle') }}
            </h2>
          </div>

          <dl class="mt-4 divide-y divide-[#f4e8ef] overflow-hidden rounded-[22px] border border-[#f0e2df] bg-white/95">
            <div class="grid grid-cols-[1fr_auto] gap-4 px-4 py-4">
              <dt class="text-sm text-[#8d7f8a]">{{ t('profile.email') }}</dt>
              <dd class="text-sm font-semibold text-[#241c2b]">{{ user?.email || '-' }}</dd>
            </div>
            <div class="grid grid-cols-[1fr_auto] gap-4 px-4 py-4">
              <dt class="text-sm text-[#8d7f8a]">{{ t('profile.username') }}</dt>
              <dd class="text-sm font-semibold text-[#241c2b]">{{ displayName }}</dd>
            </div>
            <div class="grid grid-cols-[1fr_auto] gap-4 px-4 py-4">
              <dt class="text-sm text-[#8d7f8a]">{{ t('profile.linkedProfileSources') }}</dt>
              <dd class="text-sm font-semibold text-[#241c2b]">{{ primaryToolLabel }}</dd>
            </div>
            <div class="grid grid-cols-[1fr_auto] gap-4 px-4 py-4">
              <dt class="text-sm text-[#8d7f8a]">{{ t('profile.role') }}</dt>
              <dd class="text-sm font-semibold text-[#241c2b]">{{ user?.role || '-' }}</dd>
            </div>
            <div class="grid grid-cols-[1fr_auto] gap-4 px-4 py-4">
              <dt class="text-sm text-[#8d7f8a]">ID</dt>
              <dd class="text-sm font-semibold text-[#241c2b]">{{ user?.id ?? '-' }}</dd>
            </div>
            <div class="grid grid-cols-[1fr_auto] gap-4 px-4 py-4">
              <dt class="text-sm text-[#8d7f8a]">{{ t('profile.memberSince') }}</dt>
              <dd class="text-sm font-semibold text-[#241c2b]">{{ formatDateOnly(user?.created_at) }}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section class="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <article class="rounded-[28px] border border-[#efe0e8] bg-white/92 p-4 shadow-[0_16px_40px_rgba(210,172,191,0.12)] sm:p-5">
          <div class="space-y-1">
            <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8d74e6]">
              {{ t('affiliate.yourCode') }}
            </p>
            <div class="flex items-start justify-between gap-3">
              <h2 class="text-2xl font-semibold tracking-[-0.045em] text-[#241c2b]">
                {{ t('affiliate.yourCode') }}
              </h2>
              <button
                class="rounded-full border border-[#e6d6e3] bg-white px-4 py-2 text-sm font-semibold text-[#43324b] shadow-[0_6px_18px_rgba(179,148,176,0.10)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="!inviteLink"
                @click="copyInviteLink"
              >
                {{ copiedInviteLink ? t('common.copied') : t('affiliate.copyLink') }}
              </button>
            </div>
          </div>

          <div class="mt-4 space-y-3">
            <div>
              <p class="text-xs font-medium text-[#8d7f8a]">{{ t('affiliate.yourCode') }}</p>
              <div class="mt-2 rounded-[16px] bg-gradient-to-r from-[#2c183f] via-[#4b2b6f] to-[#6550df] px-4 py-3 text-sm font-semibold tracking-[0.16em] text-white">
                {{ inviteCode || '-' }}
              </div>
            </div>
            <div>
              <p class="text-xs font-medium text-[#8d7f8a]">{{ t('affiliate.inviteLink') }}</p>
              <div class="mt-2 break-all rounded-[16px] bg-gradient-to-r from-[#4b2b6f] to-[#6755e0] px-4 py-3 text-sm font-medium text-white">
                {{ inviteLink || '-' }}
              </div>
            </div>
            <p class="text-sm leading-6 text-[#7b7180]">
              {{ t('affiliate.description') }}
            </p>
          </div>
        </article>

        <article class="rounded-[28px] border border-[#efe0e8] bg-white/92 p-4 shadow-[0_16px_40px_rgba(210,172,191,0.12)] sm:p-5">
          <div class="space-y-1">
            <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8d74e6]">
              {{ t('affiliate.invitees.title') }}
            </p>
            <h2 class="text-2xl font-semibold tracking-[-0.045em] text-[#241c2b]">
              {{ t('affiliate.invitees.title') }}
            </h2>
          </div>

          <div class="mt-4 overflow-hidden rounded-[22px] border border-[#f0e2df] bg-white/95">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-[#fff7fb] text-[11px] uppercase tracking-[0.18em] text-[#a58ca0]">
                <tr>
                  <th class="px-4 py-3 font-medium">{{ t('affiliate.invitees.columns.username') }}</th>
                  <th class="px-4 py-3 font-medium">{{ t('affiliate.stats.rebateRate') }}</th>
                  <th class="px-4 py-3 font-medium">{{ t('affiliate.stats.totalQuota') }}</th>
                  <th class="px-4 py-3 font-medium">{{ t('affiliate.transfer.title') }}</th>
                  <th class="px-4 py-3 font-medium">{{ t('affiliate.invitees.columns.joinedAt') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="invitees.length === 0">
                  <td colspan="5" class="px-4 py-10 text-center">
                    <p class="text-lg font-semibold text-[#2f2433]">{{ t('affiliate.invitees.empty') }}</p>
                    <p class="mt-2 text-sm text-[#8e8090]">
                      {{ t('affiliate.description') }}
                    </p>
                  </td>
                </tr>
                <tr
                  v-for="invitee in invitees"
                  :key="invitee.user_id"
                  class="border-t border-[#f3e5ee] text-[#312537]"
                >
                  <td class="px-4 py-3">
                    <div class="font-medium">{{ invitee.username || invitee.email }}</div>
                    <div class="text-xs text-[#8f8090]">{{ invitee.email }}</div>
                  </td>
                  <td class="px-4 py-3">
                    <span class="inline-flex rounded-full bg-[#efe7ff] px-2.5 py-1 text-xs font-medium text-[#5e46d6]">
                      {{ inviteeStatusLabel(invitee) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 font-medium text-[#241c2b]">
                    ${{ formatCurrency(invitee.total_rebate) }}
                  </td>
                  <td class="px-4 py-3">
                    <span :class="invitee.total_rebate > 0 ? 'text-emerald-600' : 'text-amber-600'" class="text-sm font-medium">
                      {{ invitee.total_rebate > 0 ? t('common.enabled') : t('common.pending') }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-[#7d7380]">
                    {{ formatDateOnly(invitee.created_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section class="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <article class="rounded-[28px] border border-[#efe0e8] bg-white/92 p-4 shadow-[0_16px_40px_rgba(210,172,191,0.12)] sm:p-5">
          <div class="space-y-1">
              <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8d74e6]">
              {{ t('profile.editProfile') }}
            </p>
            <h2 class="text-2xl font-semibold tracking-[-0.045em] text-[#241c2b]">
              {{ t('profile.editProfile') }}
            </h2>
          </div>

          <form class="mt-4 space-y-4" @submit.prevent="handleSaveProfile">
            <div>
              <label class="text-sm font-medium text-[#6f6070]">{{ t('profile.username') }}</label>
              <input
                v-model.trim="usernameDraft"
                type="text"
                class="mt-2 w-full rounded-[16px] border border-[#e9dce5] bg-white px-4 py-3 text-sm text-[#241c2b] outline-none transition focus:border-[#8d74e6]"
                :placeholder="t('profile.enterUsername')"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-[#6f6070]">{{ t('profile.linkedProfileSources') }}</label>
              <div class="mt-2 rounded-[16px] border border-[#e9dce5] bg-gradient-to-r from-[#f8f3ff] to-[#fff7fb] px-4 py-3 text-sm font-semibold text-[#4d3957]">
                {{ primaryToolLabel }}
              </div>
              <p class="mt-2 text-xs leading-5 text-[#8d7f8a]">
                {{ t('home.providers.description') }}
              </p>
            </div>

            <p class="text-sm text-[#7b7180]">
              {{ t('profile.updateProfile') }}
            </p>

            <div class="flex justify-end">
              <button
                type="submit"
                class="rounded-full bg-gradient-to-r from-[#ff5f92] to-[#9a69ff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(255,95,146,0.24)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                :disabled="savingProfile || !profileSaveEnabled"
              >
                {{ savingProfile ? t('profile.updating') : t('profile.updateProfile') }}
              </button>
            </div>
          </form>
        </article>

        <article class="rounded-[28px] border border-[#efe0e8] bg-white/92 p-4 shadow-[0_16px_40px_rgba(210,172,191,0.12)] sm:p-5">
          <ProfileIdentityBindingsSection
            :user="user"
            :linuxdo-enabled="linuxdoOAuthEnabled"
            :oidc-enabled="oidcOAuthEnabled"
            :oidc-provider-name="oidcOAuthProviderName"
            :wechat-enabled="wechatOAuthEnabled"
            :wechat-open-enabled="wechatOAuthOpenEnabled"
            :wechat-mp-enabled="wechatOAuthMPEnabled"
          />
        </article>
      </section>

      <section class="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <article class="rounded-[28px] border border-[#efe0e8] bg-white/92 p-4 shadow-[0_16px_40px_rgba(210,172,191,0.12)] sm:p-5">
          <div class="space-y-1">
              <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8d74e6]">
              {{ t('profile.overviewTitle') }}
            </p>
            <h2 class="text-2xl font-semibold tracking-[-0.045em] text-[#241c2b]">
              {{ t('profile.overviewTitle') }}
            </h2>
          </div>

          <div class="mt-4 overflow-hidden rounded-[22px] border border-[#f0e2df] bg-white/95">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-[#fff7fb] text-[11px] uppercase tracking-[0.18em] text-[#a58ca0]">
                <tr>
                  <th class="px-4 py-3 font-medium">{{ t('profile.username') }}</th>
                  <th class="px-4 py-3 font-medium">{{ t('profile.role') }}</th>
                  <th class="px-4 py-3 font-medium">{{ t('profile.concurrencyLimit') }}</th>
                  <th class="px-4 py-3 font-medium">{{ t('dashboard.totalTokens') }}</th>
                  <th class="px-4 py-3 font-medium">{{ t('profile.status') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-[#f3e5ee] text-[#312537]">
                  <td class="px-4 py-3">
                    <div class="font-medium">{{ user?.email || '-' }}</div>
                    <div class="text-xs text-[#8f8090]">{{ displayName }}</div>
                  </td>
                  <td class="px-4 py-3">{{ user?.role || '-' }}</td>
                  <td class="px-4 py-3">{{ user?.concurrency ?? 0 }}</td>
                  <td class="px-4 py-3">{{ formatTokens(monthlyTokens) }}</td>
                  <td class="px-4 py-3">
                    <span :class="user?.status === 'active' ? 'text-emerald-600' : 'text-rose-600'" class="font-medium">
                      {{ user?.status === 'active' ? t('common.active') : t('common.inactive') }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="rounded-[28px] border border-[#efe0e8] bg-white/92 p-4 shadow-[0_16px_40px_rgba(210,172,191,0.12)] sm:p-5">
          <div class="space-y-1">
              <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8d74e6]">
              {{ t('profile.securityTitle') }}
            </p>
            <div class="flex items-start justify-between gap-3">
              <h2 class="text-2xl font-semibold tracking-[-0.045em] text-[#241c2b]">
                {{ t('profile.securityTitle') }}
              </h2>
              <button
                class="rounded-full border border-[#e6d6e3] bg-white px-4 py-2 text-sm font-semibold text-[#43324b] shadow-[0_6px_18px_rgba(179,148,176,0.10)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="revokingSessions"
                @click="handleRevokeSessions"
              >
                {{ revokingSessions ? t('common.processing') : t('profile.logoutAllSessions') }}
              </button>
            </div>
          </div>

          <div class="mt-4 overflow-hidden rounded-[22px] border border-[#f0e2df] bg-white/95">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-[#fff7fb] text-[11px] uppercase tracking-[0.18em] text-[#a58ca0]">
                <tr>
                  <th class="px-4 py-3 font-medium">{{ t('profile.username') }}</th>
                  <th class="px-4 py-3 font-medium">{{ t('profile.location') }}</th>
                  <th class="px-4 py-3 font-medium">{{ t('profile.loginMethod') }}</th>
                  <th class="px-4 py-3 font-medium">{{ t('profile.lastActive') }}</th>
                  <th class="px-4 py-3 font-medium">{{ t('profile.status') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-t border-[#f3e5ee] text-[#312537]">
                  <td class="px-4 py-3 font-medium">{{ t('profile.currentBrowser') }}</td>
                  <td class="px-4 py-3 text-[#7d7380]">{{ t('profile.localMachine') }}</td>
                  <td class="px-4 py-3">{{ loginMethodLabel }}</td>
                  <td class="px-4 py-3">{{ formatDateTime(user?.last_active_at || user?.created_at) }}</td>
                  <td class="px-4 py-3">
                    <span class="inline-flex rounded-full bg-[#efe7ff] px-2.5 py-1 text-xs font-medium text-[#5e46d6]">
                      {{ t('profile.lowRisk') }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="mt-3 text-xs leading-5 text-[#8d7f8a]">
            {{ t('profile.logoutAllSessionsHint') }}
          </p>
        </article>
      </section>

      <section class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ProfilePasswordForm />
        <ProfileTotpCard />
      </section>

      <section>
        <ProfileBalanceNotifyCard
          v-if="user && balanceLowNotifyEnabled"
          :enabled="user.balance_notify_enabled ?? true"
          :threshold="user.balance_notify_threshold"
          :extra-emails="user.balance_notify_extra_emails ?? []"
          :system-default-threshold="systemDefaultThreshold"
          :user-email="user.email"
        />
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { authAPI, usageAPI, userAPI } from '@/api'
import AppLayout from '@/components/layout/AppLayout.vue'
import ProfileBalanceNotifyCard from '@/components/user/profile/ProfileBalanceNotifyCard.vue'
import ProfileIdentityBindingsSection from '@/components/user/profile/ProfileIdentityBindingsSection.vue'
import ProfilePasswordForm from '@/components/user/profile/ProfilePasswordForm.vue'
import ProfileTotpCard from '@/components/user/profile/ProfileTotpCard.vue'
import type { AffiliateInvitee, User, UserAffiliateDetail, UserAuthBindingStatus, UsageStatsResponse } from '@/types'

const appStore = useAppStore()
const authStore = useAuthStore()
const { t } = useI18n()

const user = computed(() => authStore.user)

const loadingProfile = ref(false)
const savingProfile = ref(false)
const revokingSessions = ref(false)
const balanceLowNotifyEnabled = ref(false)
const affiliateEnabled = ref(false)
const systemDefaultThreshold = ref(0)
const linuxdoOAuthEnabled = ref(false)
const wechatOAuthEnabled = ref(false)
const wechatOAuthOpenEnabled = ref<boolean | undefined>(undefined)
const wechatOAuthMPEnabled = ref<boolean | undefined>(undefined)
const oidcOAuthEnabled = ref(false)
const oidcOAuthProviderName = ref('OIDC')
const affiliateDetail = ref<UserAffiliateDetail | null>(null)
const monthlyStats = ref<UsageStatsResponse | null>(null)
const usernameDraft = ref('')
const copiedInviteLink = ref(false)

const primaryToolLabel = 'OpenAI / GPT'

const balance = computed(() => user.value?.balance ?? 0)
const balanceThreshold = computed(() => user.value?.balance_notify_threshold ?? 10)
const showBalanceWarning = computed(() => user.value != null && balance.value <= balanceThreshold.value)
const displayName = computed(() => user.value?.username?.trim() || user.value?.email?.trim() || 'User')
const monthlyTokens = computed(() => monthlyStats.value?.total_tokens ?? 0)
const invitees = computed(() => affiliateDetail.value?.invitees ?? [])
const inviteCode = computed(() => affiliateDetail.value?.aff_code?.trim() || '')
const inviteLink = computed(() => {
  if (!inviteCode.value || typeof window === 'undefined') {
    return ''
  }
  return `${window.location.origin}/register?aff=${encodeURIComponent(inviteCode.value)}`
})
const profileSaveEnabled = computed(() => {
  const draft = usernameDraft.value.trim()
  return !!draft && draft !== (user.value?.username?.trim() || '')
})

function normalizeBindingStatus(binding: boolean | UserAuthBindingStatus | undefined): boolean {
  if (typeof binding === 'boolean') {
    return binding
  }
  if (!binding) {
    return false
  }
  if (typeof binding.bound === 'boolean') {
    return binding.bound
  }
  return Boolean(binding.provider_subject || binding.issuer || binding.provider_key)
}

function hasEmailBinding(currentUser: User | null): boolean {
  if (!currentUser) {
    return false
  }
  if (typeof currentUser.email_bound === 'boolean') {
    return currentUser.email_bound
  }
  return normalizeBindingStatus(currentUser.auth_bindings?.email ?? currentUser.identity_bindings?.email)
}

function hasThirdPartyBinding(currentUser: User | null): boolean {
  if (!currentUser) {
    return false
  }
  return ['linuxdo', 'oidc', 'wechat'].some((provider) =>
    normalizeBindingStatus(currentUser.auth_bindings?.[provider as 'linuxdo' | 'oidc' | 'wechat'] ?? currentUser.identity_bindings?.[provider as 'linuxdo' | 'oidc' | 'wechat'])
  )
}

const loginMethodLabel = computed(() => {
  if (hasEmailBinding(user.value)) {
    return t('profile.loginMethodPasswordEmail')
  }
  if (hasThirdPartyBinding(user.value)) {
    return t('profile.loginMethodThirdParty')
  }
  return t('common.notAvailable')
})

function formatCurrency(value: number): string {
  return value.toFixed(2)
}

function formatTokens(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
  return value.toLocaleString()
}

function formatDateOnly(value?: string | null): string {
  if (!value) {
    return '-'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
}

function formatDateTime(value?: string | null): string {
  if (!value) {
    return '-'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '-'
  }
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function inviteeStatusLabel(invitee: AffiliateInvitee): string {
  return invitee.total_rebate > 0 ? t('common.active') : t('common.pending')
}

async function copyInviteLink() {
  if (!inviteLink.value) {
    return
  }

  try {
    await navigator.clipboard.writeText(inviteLink.value)
    copiedInviteLink.value = true
    window.setTimeout(() => {
      copiedInviteLink.value = false
    }, 1500)
  } catch (error) {
    console.error('Failed to copy invite link:', error)
  }
}

async function handleSaveProfile() {
  const nextUsername = usernameDraft.value.trim()
  if (!nextUsername) {
    appStore.showError(t('profile.usernameRequired'))
    return
  }

  savingProfile.value = true
  try {
    const updatedUser = await userAPI.updateProfile({ username: nextUsername })
    authStore.user = updatedUser
    appStore.showSuccess(t('profile.updateSuccess'))
  } catch (error: any) {
    appStore.showError(error.response?.data?.detail || t('profile.updateFailed'))
  } finally {
    savingProfile.value = false
  }
}

async function handleRevokeSessions() {
  if (revokingSessions.value) {
    return
  }

  const confirmed = window.confirm(t('profile.logoutAllSessionsConfirm'))
  if (!confirmed) {
    return
  }

  revokingSessions.value = true
  try {
    await authAPI.revokeAllSessions()
    appStore.showSuccess(t('profile.logoutAllSessionsSuccess'))
  } catch (error: any) {
    appStore.showError(error.response?.data?.detail || t('profile.logoutAllSessionsFailed'))
  } finally {
    revokingSessions.value = false
  }
}

async function loadPublicSettings() {
  try {
    const settings = await appStore.fetchPublicSettings()
    if (!settings) {
      return
    }
    balanceLowNotifyEnabled.value = settings.balance_low_notify_enabled ?? false
    affiliateEnabled.value = settings.affiliate_enabled ?? false
    systemDefaultThreshold.value = settings.balance_low_notify_threshold ?? 0
    linuxdoOAuthEnabled.value = settings.linuxdo_oauth_enabled ?? false
    wechatOAuthEnabled.value = settings.wechat_oauth_enabled ?? false
    wechatOAuthOpenEnabled.value = typeof settings.wechat_oauth_open_enabled === 'boolean'
      ? settings.wechat_oauth_open_enabled
      : undefined
    wechatOAuthMPEnabled.value = typeof settings.wechat_oauth_mp_enabled === 'boolean'
      ? settings.wechat_oauth_mp_enabled
      : undefined
    oidcOAuthEnabled.value = settings.oidc_oauth_enabled ?? false
    oidcOAuthProviderName.value = settings.oidc_oauth_provider_name || 'OIDC'
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

async function loadAffiliateDetail() {
  try {
    affiliateDetail.value = await userAPI.getAffiliateDetail()
  } catch (error) {
    console.error('Failed to load affiliate detail:', error)
  }
}

async function loadMonthlyStats() {
  try {
    monthlyStats.value = await usageAPI.getStats('month')
  } catch (error) {
    console.error('Failed to load monthly usage stats:', error)
  }
}

async function refreshProfile() {
  loadingProfile.value = true
  try {
    await authStore.refreshUser()
    usernameDraft.value = user.value?.username?.trim() || ''
  } catch (error) {
    console.error('Failed to refresh profile:', error)
    usernameDraft.value = user.value?.username?.trim() || ''
  } finally {
    loadingProfile.value = false
  }
}

onMounted(async () => {
  usernameDraft.value = user.value?.username?.trim() || ''

  await Promise.allSettled([
    refreshProfile(),
    loadPublicSettings(),
    loadMonthlyStats(),
    loadAffiliateDetail()
  ])
})
</script>
