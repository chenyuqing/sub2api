<template>
  <AppLayout>
    <div class="mx-auto max-w-5xl space-y-6">
      <section class="card overflow-hidden">
        <div class="border-b border-pink-100/80 px-6 py-5 dark:border-dark-700">
          <p class="text-xs font-semibold uppercase tracking-[0.28em] text-primary-500">
            {{ t('feedbacks.kicker') }}
          </p>
          <h1 class="mt-1 text-3xl font-semibold text-ink-950 dark:text-white">
            {{ t('feedbacks.title') }}
          </h1>
          <p class="mt-1 text-sm text-ink-500 dark:text-dark-400">
            {{ t('feedbacks.description') }}
          </p>
        </div>

        <div class="px-6 py-12">
          <div class="rounded-[28px] border border-pink-100/80 bg-white/85 p-10 text-center shadow-[0_20px_60px_rgba(236,79,151,0.08)] dark:border-dark-700 dark:bg-dark-900/70">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500 text-white shadow-lg shadow-primary-500/20">
              <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75h6.75m-6.75 3.75h4.5m-10.5 6 3.75-3h11.25A2.25 2.25 0 0021.75 14.25v-9A2.25 2.25 0 0019.5 3H4.5A2.25 2.25 0 002.25 5.25v9A2.25 2.25 0 004.5 16.5h1.5v3.75l3.75-3z" />
              </svg>
            </div>
            <h2 class="mt-6 text-2xl font-semibold text-ink-950 dark:text-white">
              {{ t('feedbacks.emptyTitle') }}
            </h2>
            <p class="mt-3 text-sm text-ink-500 dark:text-dark-400">
              {{ t('feedbacks.emptyDescription') }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/layout/AppLayout.vue'

const { t } = useI18n()
</script>
