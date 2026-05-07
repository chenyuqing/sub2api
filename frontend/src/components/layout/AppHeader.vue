<template>
  <header class="glass sticky top-0 z-30 border-b border-pink-200/50 dark:border-dark-700/50">
    <div class="flex min-h-[4.25rem] items-center justify-between gap-4 px-4 py-3 md:px-6">
      <div class="flex min-w-0 items-center gap-4">
        <button
          @click="toggleMobileSidebar"
          class="btn-ghost btn-icon lg:hidden"
          aria-label="Toggle Menu"
        >
          <Icon name="menu" size="md" />
        </button>

        <div class="min-w-0">
          <h1 class="truncate text-lg font-semibold text-ink-950 dark:text-white">
            {{ pageTitle }}
          </h1>
          <p v-if="pageDescription" class="truncate text-xs text-ink-500 dark:text-dark-400">
            {{ pageDescription }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 md:gap-3">
        <a
          v-if="docUrl"
          :href="docUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="dashboard-pill dashboard-pill-ghost hidden sm:inline-flex"
        >
          {{ headerCopy.docs }}
        </a>

        <router-link to="/monitor" class="dashboard-pill dashboard-pill-success">
          {{ headerCopy.online }}
        </router-link>

        <div
          v-if="user"
          class="dashboard-pill hidden sm:inline-flex"
        >
          ${{ user.balance?.toFixed(2) || '0.00' }}
        </div>

        <button
          type="button"
          class="dashboard-pill dashboard-pill-ghost hidden md:inline-flex"
          :disabled="switchingLocale"
          :title="localeToggleTitle"
          @click="toggleLocale"
        >
          {{ localeLabel }}
        </button>

        <div
          v-if="user"
          class="dashboard-pill hidden lg:inline-flex max-w-[14rem] truncate"
          :title="user.email"
        >
          {{ user.email }}
        </div>

        <button
          v-if="user"
          @click="handleLogout"
          class="dashboard-pill dashboard-pill-ghost"
        >
          {{ headerCopy.logout }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore, useAuthStore } from '@/stores'
import { useAdminSettingsStore } from '@/stores/adminSettings'
import { setLocale } from '@/i18n'
import Icon from '@/components/icons/Icon.vue'

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()
const appStore = useAppStore()
const authStore = useAuthStore()
const adminSettingsStore = useAdminSettingsStore()
const switchingLocale = ref(false)

const user = computed(() => authStore.user)
const docUrl = computed(() => appStore.docUrl)
const localeLabel = computed(() => (locale.value === 'zh' ? '中文' : 'English'))
const localeToggleTitle = computed(() =>
  locale.value === 'zh' ? '切换到 English' : '切换到 中文'
)
const headerCopy = computed(() =>
  locale.value === 'zh'
    ? { docs: '文档', online: '在线', logout: '退出登录' }
    : { docs: 'Docs', online: 'Online', logout: 'Logout' }
)

const pageTitle = computed(() => {
  // For custom pages, use the menu item's label instead of generic "自定义页面"
  if (route.name === 'CustomPage') {
    const id = route.params.id as string
    const publicItems = appStore.cachedPublicSettings?.custom_menu_items ?? []
    const menuItem = publicItems.find((item) => item.id === id)
      ?? (authStore.isAdmin ? adminSettingsStore.customMenuItems.find((item) => item.id === id) : undefined)
    if (menuItem?.label) return menuItem.label
  }
  const titleKey = route.meta.titleKey as string
  if (titleKey) {
    return t(titleKey)
  }
  return (route.meta.title as string) || ''
})

const pageDescription = computed(() => {
  const descKey = route.meta.descriptionKey as string
  if (descKey) {
    return t(descKey)
  }
  return (route.meta.description as string) || ''
})

function toggleMobileSidebar() {
  appStore.toggleMobileSidebar()
}

async function toggleLocale() {
  if (switchingLocale.value) {
    return
  }

  switchingLocale.value = true
  try {
    await setLocale(locale.value === 'zh' ? 'en' : 'zh')
  } finally {
    switchingLocale.value = false
  }
}

async function handleLogout() {
  try {
    await authStore.logout()
  } catch (error) {
    // Ignore logout errors - still redirect to login
    console.error('Logout error:', error)
  }
  await router.push('/login')
}
</script>
