import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Theme = 'light' | 'dark' | 'auto'

export const useThemeStore = defineStore('theme', () => {
    const theme = ref<Theme>('auto')
    const actualTheme = ref<'light' | 'dark'>('light')

    // 检测系统主题
    const getSystemTheme = (): 'light' | 'dark' => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark'
        }
        return 'light'
    }

    // 应用主题
    const applyTheme = (themeValue: 'light' | 'dark') => {
        actualTheme.value = themeValue
        document.documentElement.setAttribute('data-theme', themeValue)
    }

    // 设置主题
    const setTheme = (newTheme: Theme) => {
        theme.value = newTheme
        localStorage.setItem('theme', newTheme)

        if (newTheme === 'auto') {
            applyTheme(getSystemTheme())
        } else {
            applyTheme(newTheme)
        }
    }

    // 初始化主题
    const initTheme = () => {
        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme) {
            setTheme(savedTheme)
        } else {
            setTheme('auto')
        }
    }

    // 监听系统主题变化
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (theme.value === 'auto') {
                applyTheme(e.matches ? 'dark' : 'light')
            }
        })
    }

    return {
        theme,
        actualTheme,
        setTheme,
        initTheme
    }
})
