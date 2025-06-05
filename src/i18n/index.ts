import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'
import deDE from './locales/de-DE'
import frFR from './locales/fr-FR'
import arSA from './locales/ar-SA'

// 定义消息类型
type MessageSchema = typeof zhCN

// 创建i18n实例
const i18n = createI18n<[MessageSchema], 'zh-CN' | 'en-US' | 'de-DE' | 'fr-FR' | 'ar-SA'>({
    legacy: false, // 使用Composition API模式
    locale: 'zh-CN', // 默认语言
    fallbackLocale: 'en-US', // 回退语言
    messages: {
        'zh-CN': zhCN,
        'en-US': enUS,
        'de-DE': deDE,
        'fr-FR': frFR,
        'ar-SA': arSA
    }
})

export default i18n
