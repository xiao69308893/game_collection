/*
/!**
 * 事件总线工具
 * 提供跨组件通信和事件管理功能
 *!/

import { Events } from '@/types'

/!**
 * 事件监听器类型
 *!/
type EventListener<T = any> = (data: T) => void

/!**
 * 事件映射类型
 *!/
interface EventMap {
    [key: string]: any
}

/!**
 * 事件总线类
 *!/
export class EventBus<T extends EventMap = EventMap> implements Events.EventEmitter {
    private events: Map<keyof T, Set<EventListener<T[keyof T]>>> = new Map()
    private onceEvents: Map<keyof T, Set<EventListener<T[keyof T]>>> = new Map()
    private maxListeners: number = 10
    private debug: boolean = false

    constructor(options: { maxListeners?: number; debug?: boolean } = {}) {
        this.maxListeners = options.maxListeners || 10
        this.debug = options.debug || false
    }

    /!**
     * 添加事件监听器
     * @param event 事件名
     * @param listener 监听器函数
     *!/
    on<K extends keyof T>(event: K, listener: EventListener<T[K]>): void {
        if (!this.events.has(event)) {
            this.events.set(event, new Set())
        }

        const listeners = this.events.get(event)!

        // 检查监听器数量限制
        if (listeners.size >= this.maxListeners) {
            console.warn(`Event '${String(event)}' has too many listeners (${listeners.size})`)
        }

        listeners.add(listener)

        if (this.debug) {
            console.log(`Event listener added for '${String(event)}'`)
        }
    }

    /!**
     * 添加一次性事件监听器
     * @param event 事件名
     * @param listener 监听器函数
     *!/
    once<K extends keyof T>(event: K, listener: EventListener<T[K]>): void {
        if (!this.onceEvents.has(event)) {
            this.onceEvents.set(event, new Set())
        }

        this.onceEvents.get(event)!.add(listener)

        if (this.debug) {
            console.log(`One-time event listener added for '${String(event)}'`)
        }
    }

    /!**
     * 移除事件监听器
     * @param event 事件名
     * @param listener 监听器函数
     *!/
    off<K extends keyof T>(event: K, listener: EventListener<T[K]>): void {
        const listeners = this.events.get(event)
        if (listeners) {
            listeners.delete(listener)
            if (listeners.size === 0) {
                this.events.delete(event)
            }
        }

        const onceListeners = this.onceEvents.get(event)
        if (onceListeners) {
            onceListeners.delete(listener)
            if (onceListeners.size === 0) {
                this.onceEvents.delete(event)
            }
        }

        if (this.debug) {
            console.log(`Event listener removed for '${String(event)}'`)
        }
    }

    /!**
     * 移除指定事件的所有监听器
     * @param event 事件名
     *!/
    removeAllListeners<K extends keyof T>(event?: K): void {
        if (event) {
            this.events.delete(event)
            this.onceEvents.delete(event)
            if (this.debug) {
                console.log(`All listeners removed for '${String(event)}'`)
            }
        } else {
            this.events.clear()
            this.onceEvents.clear()
            if (this.debug) {
                console.log('All event listeners removed')
            }
        }
    }

    /!**
     * 触发事件
     * @param event 事件名
     * @param data 事件数据
     *!/
    emit<K extends keyof T>(event: K, data?: T[K]): void {
        // 触发普通监听器
        const listeners = this.events.get(event)
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(data)
                } catch (error) {
                    console.error(`Error in event listener for '${String(event)}':`, error)
                }
            })
        }

        // 触发一次性监听器
        const onceListeners = this.onceEvents.get(event)
        if (onceListeners) {
            onceListeners.forEach(listener => {
                try {
                    listener(data)
                } catch (error) {
                    console.error(`Error in one-time event listener for '${String(event)}':`, error)
                }
            })
            // 清除一次性监听器
            this.onceEvents.delete(event)
        }

        if (this.debug) {
            console.log(`Event '${String(event)}' emitted with data:`, data)
        }
    }

    /!**
     * 异步触发事件
     * @param event 事件名
     * @param data 事件数据
     *!/
    async emitAsync<K extends keyof T>(event: K, data?: T[K]): Promise<void> {
        const promises: Promise<void>[] = []

        // 收集普通监听器的Promise
        const listeners = this.events.get(event)
        if (listeners) {
            listeners.forEach(listener => {
                promises.push(Promise.resolve(listener(data)))
            })
        }

        // 收集一次性监听器的Promise
        const onceListeners = this.onceEvents.get(event)
        if (onceListeners) {
            onceListeners.forEach(listener => {
                promises.push(Promise.resolve(listener(data)))
            })
            // 清除一次性监听器
            this.onceEvents.delete(event)
        }

        try {
            await Promise.all(promises)
        } catch (error) {
            console.error(`Error in async event emission for '${String(event)}':`, error)
        }

        if (this.debug) {
            console.log(`Async event '${String(event)}' emitted with data:`, data)
        }
    }

    /!**
     * 获取事件的监听器数量
     * @param event 事件名
     * @returns 监听器数量
     *!/
    listenerCount<K extends keyof T>(event: K): number {
        const listeners = this.events.get(event)
        const onceListeners = this.onceEvents.get(event)
        return (listeners?.size || 0) + (onceListeners?.size || 0)
    }

    /!**
     * 获取所有事件名
     * @returns 事件名数组
     *!/
    eventNames(): (keyof T)[] {
        const allEvents = new Set([...this.events.keys(), ...this.onceEvents.keys()])
        return Array.from(allEvents)
    }

    /!**
     * 获取指定事件的所有监听器
     * @param event 事件名
     * @returns 监听器数组
     *!/
    listeners<K extends keyof T>(event: K): EventListener<T[K]>[] {
        const listeners = this.events.get(event) || new Set()
        const onceListeners = this.onceEvents.get(event) || new Set()
        return [...listeners, ...onceListeners]
    }

    /!**
     * 设置最大监听器数量
     * @param n 最大数量
     *!/
    setMaxListeners(n: number): void {
        this.maxListeners = n
    }

    /!**
     * 获取最大监听器数量
     * @returns 最大数量
     *!/
    getMaxListeners(): number {
        return this.maxListeners
    }

    /!**
     * 等待事件触发
     * @param event 事件名
     * @param timeout 超时时间（毫秒）
     * @returns Promise<事件数据>
     *!/
    waitFor<K extends keyof T>(event: K, timeout?: number): Promise<T[K]> {
        return new Promise((resolve, reject) => {
            let timeoutId: NodeJS.Timeout | null = null

            const listener = (data: T[K]) => {
                if (timeoutId) {
                    clearTimeout(timeoutId)
                }
                resolve(data)
            }

            this.once(event, listener)

            if (timeout) {
                timeoutId = setTimeout(() => {
                    this.off(event, listener)
                    reject(new Error(`Timeout waiting for event '${String(event)}'`))
                }, timeout)
            }
        })
    }

    /!**
     * 创建事件代理
     * @param targetBus 目标事件总线
     * @param eventMap 事件映射
     *!/
    proxy<U extends EventMap>(
        targetBus: EventBus<U>,
        eventMap: Partial<Record<keyof T, keyof U>>
    ): void {
        Object.entries(eventMap).forEach(([sourceEvent, targetEvent]) => {
            this.on(sourceEvent as keyof T, (data) => {
                targetBus.emit(targetEvent as keyof U, data)
            })
        })
    }

    /!**
     * 销毁事件总线
     *!/
    destroy(): void {
        this.removeAllListeners()
        if (this.debug) {
            console.log('EventBus destroyed')
        }
    }
}

/!**
 * 游戏事件接口
 *!/
interface GameEvents {
    // 游戏生命周期事件
    'game:start': { gameType: string; timestamp: number }
    'game:pause': { gameType: string; timestamp: number }
    'game:resume': { gameType: string; timestamp: number }
    'game:over': { gameType: string; score: number; timestamp: number }
    'game:restart': { gameType: string; timestamp: number }

    // 游戏状态事件
    'score:update': { gameType: string; score: number; delta: number }
    'level:up': { gameType: string; level: number; oldLevel: number }
    'achievement:unlock': { id: string; name: string; timestamp: number }

    // 用户界面事件
    'ui:theme:change': { theme: 'light' | 'dark' | 'auto' }
    'ui:language:change': { language: string }
    'ui:fullscreen:toggle': { isFullscreen: boolean }

    // 系统事件
    'system:online': { isOnline: boolean }
    'system:focus': { hasFocus: boolean }
    'system:visibility': { isVisible: boolean }

    // 错误事件
    'error:game': { gameType: string; error: Error; timestamp: number }
    'error:storage': { operation: string; error: Error; timestamp: number }
    'error:network': { url?: string; error: Error; timestamp: number }
}

/!**
 * 全局事件总线实例
 *!/
export const eventBus = new EventBus<GameEvents>({ debug: false })

/!**
 * 游戏事件管理器
 *!/
export class GameEventManager {
    private eventBus: EventBus<GameEvents>
    private gameType: string

    constructor(gameType: string, eventBusInstance?: EventBus<GameEvents>) {
        this.gameType = gameType
        this.eventBus = eventBusInstance || eventBus
    }

    /!**
     * 触发游戏开始事件
     *!/
    emitGameStart(): void {
        this.eventBus.emit('game:start', {
            gameType: this.gameType,
            timestamp: Date.now()
        })
    }

    /!**
     * 触发游戏暂停事件
     *!/
    emitGamePause(): void {
        this.eventBus.emit('game:pause', {
            gameType: this.gameType,
            timestamp: Date.now()
        })
    }

    /!**
     * 触发游戏继续事件
     *!/
    emitGameResume(): void {
        this.eventBus.emit('game:resume', {
            gameType: this.gameType,
            timestamp: Date.now()
        })
    }

    /!**
     * 触发游戏结束事件
     *!/
    emitGameOver(score: number): void {
        this.eventBus.emit('game:over', {
            gameType: this.gameType,
            score,
            timestamp: Date.now()
        })
    }

    /!**
     * 触发游戏重启事件
     *!/
    emitGameRestart(): void {
        this.eventBus.emit('game:restart', {
            gameType: this.gameType,
            timestamp: Date.now()
        })
    }

    /!**
     * 触发分数更新事件
     *!/
    emitScoreUpdate(score: number, delta: number): void {
        this.eventBus.emit('score:update', {
            gameType: this.gameType,
            score,
            delta
        })
    }

    /!**
     * 触发等级提升事件
     *!/
    emitLevelUp(level: number, oldLevel: number): void {
        this.eventBus.emit('level:up', {
            gameType: this.gameType,
            level,
            oldLevel
        })
    }

    /!**
     * 触发成就解锁事件
     *!/
    emitAchievementUnlock(id: string, name: string): void {
        this.eventBus.emit('achievement:unlock', {
            id,
            name,
            timestamp: Date.now()
        })
    }

    /!**
     * 触发游戏错误事件
     *!/
    emitGameError(error: Error): void {
        this.eventBus.emit('error:game', {
            gameType: this.gameType,
            error,
            timestamp: Date.now()
        })
    }
}

/!**
 * 系统事件监听器
 *!/
export class SystemEventListener {
    private eventBus: EventBus<GameEvents>

    constructor(eventBusInstance?: EventBus<GameEvents>) {
        this.eventBus = eventBusInstance || eventBus
        this.setupSystemListeners()
    }

    private setupSystemListeners(): void {
        // 监听网络状态变化
        window.addEventListener('online', () => {
            this.eventBus.emit('system:online', { isOnline: true })
        })

        window.addEventListener('offline', () => {
            this.eventBus.emit('system:online', { isOnline: false })
        })

        // 监听页面焦点变化
        window.addEventListener('focus', () => {
            this.eventBus.emit('system:focus', { hasFocus: true })
        })

        window.addEventListener('blur', () => {
            this.eventBus.emit('system:focus', { hasFocus: false })
        })

        // 监听页面可见性变化
        document.addEventListener('visibilitychange', () => {
            this.eventBus.emit('system:visibility', {
                isVisible: !document.hidden
            })
        })

        // 监听全屏状态变化
        document.addEventListener('fullscreenchange', () => {
            this.eventBus.emit('ui:fullscreen:toggle', {
                isFullscreen: !!document.fullscreenElement
            })
        })
    }
}

/!**
 * 事件记录器
 *!/
export class EventLogger {
    private eventBus: EventBus<GameEvents>
    private logs: Array<{
        event: string
        data: any
        timestamp: number
    }> = []
    private maxLogs: number = 1000

    constructor(eventBusInstance?: EventBus<GameEvents>, maxLogs = 1000) {
        this.eventBus = eventBusInstance || eventBus
        this.maxLogs = maxLogs
        this.setupLogging()
    }

    private setupLogging(): void {
        // 监听所有事件
        const originalEmit = this.eventBus.emit.bind(this.eventBus)
        this.eventBus.emit = (event: any, data?: any) => {
            this.logEvent(event, data)
            return originalEmit(event, data)
        }
    }

    private logEvent(event: string, data: any): void {
        this.logs.push({
            event,
            data: JSON.parse(JSON.stringify(data)), // 深拷贝数据
            timestamp: Date.now()
        })

        // 限制日志数量
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs)
        }
    }

    /!**
     * 获取事件日志
     *!/
    getLogs(filter?: {
        event?: string
        startTime?: number
        endTime?: number
        limit?: number
    }): Array<{ event: string; data: any; timestamp: number }> {
        let filteredLogs = [...this.logs]

        if (filter) {
            if (filter.event) {
                filteredLogs = filteredLogs.filter(log => log.event === filter.event)
            }
            if (filter.startTime) {
                filteredLogs = filteredLogs.filter(log => log.timestamp >= filter.startTime!)
            }
            if (filter.endTime) {
                filteredLogs = filteredLogs.filter(log => log.timestamp <= filter.endTime!)
            }
            if (filter.limit) {
                filteredLogs = filteredLogs.slice(-filter.limit)
            }
        }

        return filteredLogs
    }

    /!**
     * 清除日志
     *!/
    clearLogs(): void {
        this.logs = []
    }

    /!**
     * 导出日志
     *!/
    exportLogs(): string {
        return JSON.stringify(this.logs, null, 2)
    }
}

// 初始化全局事件总线
if (typeof globalThis !== 'undefined') {
    globalThis.eventBus = eventBus
}

// 初始化系统事件监听器
if (typeof window !== 'undefined') {
    new SystemEventListener()
}

export default eventBus
*/
