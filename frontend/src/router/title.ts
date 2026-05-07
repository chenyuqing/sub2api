import { i18n } from '@/i18n'

/**
 * 统一生成页面标题，避免多处写入 document.title 产生覆盖冲突。
 * 优先使用 titleKey 通过 i18n 翻译，fallback 到静态 routeTitle。
 */
export function resolveDocumentTitle(routeTitle: unknown, siteName?: string, titleKey?: string): string {
  const locale = i18n.global.locale.value
  const normalizedSiteName = (() => {
    if (typeof siteName !== 'string' || !siteName.trim()) {
      return locale.startsWith('en') ? 'xLai Coding' : '象來Coding'
    }
    const trimmed = siteName.trim()
    if (trimmed === '象來Coding' || trimmed === 'xLai Coding') {
      return locale.startsWith('en') ? 'xLai Coding' : '象來Coding'
    }
    return trimmed
  })()

  if (typeof titleKey === 'string' && titleKey.trim()) {
    const translated = i18n.global.t(titleKey)
    if (translated && translated !== titleKey) {
      return `${translated} - ${normalizedSiteName}`
    }
  }

  if (typeof routeTitle === 'string' && routeTitle.trim()) {
    return `${routeTitle.trim()} - ${normalizedSiteName}`
  }

  return normalizedSiteName
}
