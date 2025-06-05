/**
 * PWA 服务工作者注册组合式函数
 */

import { ref, onMounted } from 'vue'
import { registerSW } from 'virtual:pwa-register'

/**
 * PWA 注册和更新管理
 */
export function usePWA() {
    // 响应式状态
    const needRefresh = ref(false)
    const offlineReady = ref(false)
    const isOnline = ref(navigator.onLine)

    // 更新服务工作者的函数
    let updateServiceWorker: ((reloadPage?: boolean) => Promise<void>) | null = null

    // 注册服务工作者
    const registerServiceWorker = () => {
        updateServiceWorker = registerSW({
            immediate: true,
            onNeedRefresh() {
                needRefresh.value = true
                console.log('检测到新版本，需要刷新页面')
            },
            onOfflineReady() {
                offlineReady.value = true
                console.log('应用已准备好离线使用')
            },
            onRegistered(registration) {
                console.log('服务工作者注册成功:', registration)
            },
            onRegisterError(error) {
                console.error('服务工作者注册失败:', error)
            }
        })
    }

    // 手动更新应用
    const updateApp = async (reloadPage = true) => {
        if (updateServiceWorker) {
            try {
                await updateServiceWorker(reloadPage)
                needRefresh.value = false
            } catch (error) {
                console.error('更新应用失败:', error)
            }
        }
    }

    // 关闭更新提示
    const closeUpdatePrompt = () => {
        needRefresh.value = false
    }

    // 监听网络状态变化
    const handleOnlineStatusChange = () => {
        isOnline.value = navigator.onLine

        if (isOnline.value) {
            console.log('网络已连接')
            // 网络恢复时可以检查是否有新版本
            checkForUpdates()
        } else {
            console.log('网络已断开，应用将使用离线模式')
        }
    }

    // 检查更新
    const checkForUpdates = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.getRegistration()
                if (registration) {
                    registration.update()
                }
            } catch (error) {
                console.error('检查更新失败:', error)
            }
        }
    }

    // 获取安装提示
    const installPrompt = ref<BeforeInstallPromptEvent | null>(null)
    const isInstallable = ref(false)

    // 处理安装提示事件
    const handleBeforeInstallPrompt = (event: Event) => {
        // 阻止默认行为
        event.preventDefault()
        // 保存事件以便后续使用
        installPrompt.value = event as BeforeInstallPromptEvent
        isInstallable.value = true
        console.log('应用可以被安装')
    }

    // 安装应用
    const installApp = async () => {
        if (!installPrompt.value) {
            console.log('安装提示不可用')
            return false
        }

        try {
            // 显示安装提示
            installPrompt.value.prompt()

            // 等待用户响应
            const { outcome } = await installPrompt.value.userChoice

            if (outcome === 'accepted') {
                console.log('用户接受了安装提示')
            } else {
                console.log('用户拒绝了安装提示')
            }

            // 清除安装提示
            installPrompt.value = null
            isInstallable.value = false

            return outcome === 'accepted'
        } catch (error) {
            console.error('安装应用失败:', error)
            return false
        }
    }

    // 检查是否已安装
    const isInstalled = ref(false)
    const checkInstallStatus = () => {
        // 检查是否在 PWA 环境中运行
        isInstalled.value = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes('android-app://')
    }

    // 初始化
    onMounted(() => {
        // 注册服务工作者
        registerServiceWorker()

        // 监听网络状态变化
        window.addEventListener('online', handleOnlineStatusChange)
        window.addEventListener('offline', handleOnlineStatusChange)

        // 监听安装提示事件
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        // 检查安装状态
        checkInstallStatus()

        // 监听应用安装事件
        window.addEventListener('appinstalled', () => {
            console.log('应用已安装')
            isInstalled.value = true
            isInstallable.value = false
            installPrompt.value = null
        })

        // 清理函数
        return () => {
            window.removeEventListener('online', handleOnlineStatusChange)
            window.removeEventListener('offline', handleOnlineStatusChange)
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        }
    })

    return {
        // 状态
        needRefresh,
        offlineReady,
        isOnline,
        isInstallable,
        isInstalled,

        // 方法
        updateApp,
        closeUpdatePrompt,
        checkForUpdates,
        installApp
    }
}

// 扩展 BeforeInstallPromptEvent 类型
declare global {
    interface BeforeInstallPromptEvent extends Event {
        readonly platforms: string[]
        readonly userChoice: Promise<{
            outcome: 'accepted' | 'dismissed'
            platform: string
        }>
        prompt(): Promise<void>
    }

    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent
    }
}

export default usePWA
