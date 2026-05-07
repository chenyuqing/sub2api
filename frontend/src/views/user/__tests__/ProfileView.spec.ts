import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProfileView from '@/views/user/ProfileView.vue'

const {
  fetchPublicSettingsMock,
  refreshUserMock,
  getAffiliateDetailMock,
  getStatsMock,
  revokeAllSessionsMock,
  authState
} = vi.hoisted(() => ({
  fetchPublicSettingsMock: vi.fn(),
  refreshUserMock: vi.fn(),
  getAffiliateDetailMock: vi.fn(),
  getStatsMock: vi.fn(),
  revokeAllSessionsMock: vi.fn(),
  authState: {
    user: null as Record<string, unknown> | null,
    refreshUser: vi.fn()
  }
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => authState
}))

vi.mock('@/stores/app', () => ({
  useAppStore: () => ({
    fetchPublicSettings: fetchPublicSettingsMock,
    showError: vi.fn(),
    showSuccess: vi.fn()
  })
}))

vi.mock('@/api', () => ({
  authAPI: {
    revokeAllSessions: revokeAllSessionsMock
  },
  usageAPI: {
    getStats: getStatsMock
  },
  userAPI: {
    getAffiliateDetail: getAffiliateDetailMock,
    updateProfile: vi.fn()
  }
}))

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key
    })
  }
})

describe('ProfileView', () => {
  beforeEach(() => {
    refreshUserMock.mockReset()
    fetchPublicSettingsMock.mockReset()
    getAffiliateDetailMock.mockReset()
    getStatsMock.mockReset()
    revokeAllSessionsMock.mockReset()
    refreshUserMock.mockResolvedValue(undefined)
    getAffiliateDetailMock.mockResolvedValue({
      user_id: 1,
      aff_code: 'BERRY-MOTOLEIS-709',
      inviter_id: null,
      aff_count: 1,
      aff_quota: 12.5,
      aff_frozen_quota: 0,
      aff_history_quota: 12.5,
      effective_rebate_rate_percent: 10,
      invitees: [
        {
          user_id: 2,
          email: 'friend@example.com',
          username: 'friend',
          created_at: '2026-05-06T08:00:00Z',
          total_rebate: 1.2
        }
      ]
    })
    getStatsMock.mockResolvedValue({
      total_api_keys: 3,
      active_api_keys: 2,
      total_requests: 40,
      total_input_tokens: 1000,
      total_output_tokens: 2000,
      total_cache_creation_tokens: 0,
      total_cache_read_tokens: 0,
      total_tokens: 3000,
      total_cost: 6,
      total_actual_cost: 5,
      today_requests: 4,
      today_input_tokens: 100,
      today_output_tokens: 200,
      today_cache_creation_tokens: 0,
      today_cache_read_tokens: 0,
      today_tokens: 300,
      today_cost: 0.6,
      today_actual_cost: 0.5,
      average_duration_ms: 1200,
      rpm: 2,
      tpm: 100
    })
    authState.refreshUser = refreshUserMock
    authState.user = {
      id: 709,
      username: 'motoleisure',
      email: 'motoleisure@gmail.com',
      role: 'user',
      balance: 1,
      concurrency: 3,
      status: 'active',
      allowed_groups: null,
      balance_notify_enabled: true,
      balance_notify_threshold: 10,
      balance_notify_extra_emails: [],
      created_at: '2026-05-06T00:00:00Z',
      updated_at: '2026-05-06T00:00:00Z',
      last_active_at: '2026-05-07T01:23:00Z'
    }
    fetchPublicSettingsMock.mockResolvedValue({
      contact_info: '',
      balance_low_notify_enabled: true,
      balance_low_notify_threshold: 10,
      linuxdo_oauth_enabled: true,
      wechat_oauth_enabled: true,
      wechat_oauth_open_enabled: true,
      wechat_oauth_mp_enabled: false,
      oidc_oauth_enabled: true,
      oidc_oauth_provider_name: 'OIDC',
      registration_enabled: true,
      email_verify_enabled: true,
      force_email_on_third_party_signup: false,
      registration_email_suffix_whitelist: [],
      promo_code_enabled: true,
      password_reset_enabled: true,
      invitation_code_enabled: true,
      turnstile_enabled: false,
      turnstile_site_key: '',
      site_name: 'BerryCode',
      site_logo: '',
      site_subtitle: '',
      api_base_url: '',
      doc_url: '',
      home_content: '',
      hide_ccs_import_button: false,
      payment_enabled: true,
      table_default_page_size: 20,
      table_page_size_options: [10, 20, 50],
      custom_menu_items: [],
      custom_endpoints: [],
      backend_mode_enabled: false,
      version: 'v0.1.123',
      account_quota_notify_enabled: true,
      channel_monitor_enabled: true,
      channel_monitor_default_interval_seconds: 60,
      available_channels_enabled: true,
      affiliate_enabled: true
    })
  })

  it('renders the BerryCode-like profile shell with real-data cards', async () => {
    const wrapper = mount(ProfileView, {
      global: {
        stubs: {
          AppLayout: { template: '<div><slot /></div>' },
          RouterLink: { template: '<a><slot /></a>' },
          ProfileIdentityBindingsSection: { template: '<div data-testid="profile-bindings" />' },
          ProfilePasswordForm: { template: '<div data-testid="profile-password-form" />' },
          ProfileTotpCard: { template: '<div data-testid="profile-totp-card" />' },
          ProfileBalanceNotifyCard: { template: '<div data-testid="profile-balance-notify-card" />' }
        }
      }
    })

    await flushPromises()

    expect(wrapper.get('[data-testid="profile-shell"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('个人资料')
    expect(wrapper.text()).toContain('邀请码')
    expect(wrapper.text()).toContain('登录设备')
    expect(wrapper.get('[data-testid="profile-bindings"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="profile-password-form"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="profile-totp-card"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="profile-balance-notify-card"]').exists()).toBe(true)
  })
})
