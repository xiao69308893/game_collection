export class PWAManager {
    private deferredPrompt: any = null

    constructor() {
        this.setupInstallPrompt()
        this.setupBeforeInstallPrompt()
    }

    private setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // 阻止浏览器默认的安装提示
            e.preventDefault()
            // 保存事件以便稍后触发
            this.deferredPrompt = e
        })
    }

    private setupBeforeInstallPrompt() {
        window.addEventListener('appinstalled', () => {
            console.log('PWA 已安装')
            this.deferredPrompt = null
        })
    }

    // 显示安装提示
    async showInstallPrompt(): Promise<boolean> {
        if (!this.deferredPrompt) {
            return false
        }

        // 显示安装提示
        this.deferredPrompt.prompt()

        // 等待用户响应
        const { outcome } = await this.deferredPrompt.userChoice

        // 清除保存的事件
        this.deferredPrompt = null

        return outcome === 'accepted'
    }

    // 检查是否可以安装
    canInstall(): boolean {
        return this.deferredPrompt !== null
    }

    // 检查是否已安装
    isInstalled(): boolean {
        return window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true
    }

    // 检查是否支持 PWA
    isPWASupported(): boolean {
        return 'serviceWorker' in navigator && 'PushManager' in window
    }

    // 请求通知权限
    async requestNotificationPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            return 'denied'
        }

        if (Notification.permission === 'default') {
            return await Notification.requestPermission()
        }

        return Notification.permission
    }

    // 发送通知
    async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
        const permission = await this.requestNotificationPermission()

        if (permission === 'granted') {
            const registration = await navigator.serviceWorker.ready

            if ('showNotification' in registration) {
                registration.showNotification(title, {
                    icon: '/pwa-192x192.png',
                    badge: '/pwa-192x192.png',
                    tag: 'game-notification',
                    ...options
                })
            } else {
                new Notification(title, {
                    icon: '/pwa-192x192.png',
                    ...options
                })
            }
        }
    }

    // 获取网络状态
    getNetworkStatus(): {
        online: boolean
        connection?: any
    } {
        return {
            online: navigator.onLine,
            connection: (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
        }
    }

    // 添加到主屏幕提示组件
    createInstallButton(): HTMLElement {
        const button = document.createElement('button')
        button.textContent = '安装应用'
        button.className = 'install-button'
        button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #3b82f6;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      transition: all 0.3s ease;
    `

        button.addEventListener('click', async () => {
            const installed = await this.showInstallPrompt()
            if (installed) {
                button.remove()
            }
        })

        // 只在可以安装且未安装时显示
        if (this.canInstall() && !this.isInstalled()) {
            return button
        }

        return document.createElement('div') // 返回空元素
    }
}

// 导出全局 PWA 管理器实例
export const pwaManager = new PWAManager()
