/**
 * 存储工具库
 * 提供统一的本地存储接口，支持多种存储方式
 */

import type { Storage } from '@/types'
import { ErrorHandler } from './common'

/**
 * 存储项接口
 */
interface StorageItem<T = any> {
    value: T
    timestamp: number
    expiration?: number
}

/**
 * 本地存储适配器
 */
class LocalStorageAdapter implements Storage.StorageAdapter {
    private prefix: string
    private encryption: boolean

    constructor(options: Storage.StorageConfig = {}) {
        this.prefix = options.namespace ? `${options.namespace}:` : ''
        this.encryption = options.encryption || false
    }

    private getKey(key: string): string {
        return this.prefix + key
    }

    private encrypt(data: string): string {
        if (!this.encryption) return data
        // 简单的Base64编码，实际项目中应使用更安全的加密算法
        return btoa(data)
    }

    private decrypt(data: string): string {
        if (!this.encryption) return data
        try {
            return atob(data)
        } catch {
            return data
        }
    }

    async getItem<T>(key: string): Promise<T | null> {
        return ErrorHandler.safeExecute(() => {
            const fullKey = this.getKey(key)
            const rawData = localStorage.getItem(fullKey)

            if (!rawData) return null

            const decryptedData = this.decrypt(rawData)
            const item: StorageItem<T> = JSON.parse(decryptedData)

            // 检查是否过期
            if (item.expiration && Date.now() > item.expiration) {
                localStorage.removeItem(fullKey)
                return null
            }

            return item.value
        }, null)
    }

    async setItem<T>(key: string, value: T, expiration?: number): Promise<void> {
        return ErrorHandler.safeExecute(() => {
            const item: StorageItem<T> = {
                value,
                timestamp: Date.now(),
                expiration: expiration ? Date.now() + expiration : undefined
            }

            const data = JSON.stringify(item)
            const encryptedData = this.encrypt(data)
            localStorage.setItem(this.getKey(key), encryptedData)
        }, undefined)
    }

    async removeItem(key: string): Promise<void> {
        return ErrorHandler.safeExecute(() => {
            localStorage.removeItem(this.getKey(key))
        }, undefined)
    }

    async clear(): Promise<void> {
        return ErrorHandler.safeExecute(() => {
            const keys = Object.keys(localStorage)
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key)
                }
            })
        }, undefined)
    }

    async getAllKeys(): Promise<string[]> {
        return ErrorHandler.safeExecute(() => {
            const keys = Object.keys(localStorage)
            return keys
                .filter(key => key.startsWith(this.prefix))
                .map(key => key.slice(this.prefix.length))
        }, [])
    }
}

/**
 * 会话存储适配器
 */
class SessionStorageAdapter extends LocalStorageAdapter {
    constructor(options: Storage.StorageConfig = {}) {
        super(options)
    }

    async getItem<T>(key: string): Promise<T | null> {
        return ErrorHandler.safeExecute(() => {
            const fullKey = this.getKey(key)
            const rawData = sessionStorage.getItem(fullKey)

            if (!rawData) return null

            const decryptedData = this.decrypt(rawData)
            const item: StorageItem<T> = JSON.parse(decryptedData)

            return item.value
        }, null)
    }

    async setItem<T>(key: string, value: T): Promise<void> {
        return ErrorHandler.safeExecute(() => {
            const item: StorageItem<T> = {
                value,
                timestamp: Date.now()
            }

            const data = JSON.stringify(item)
            const encryptedData = this.encrypt(data)
            sessionStorage.setItem(this.getKey(key), encryptedData)
        }, undefined)
    }

    async removeItem(key: string): Promise<void> {
        return ErrorHandler.safeExecute(() => {
            sessionStorage.removeItem(this.getKey(key))
        }, undefined)
    }

    async clear(): Promise<void> {
        return ErrorHandler.safeExecute(() => {
            const keys = Object.keys(sessionStorage)
            keys.forEach(key => {
                if (key.startsWith(this.getKey(''))) {
                    sessionStorage.removeItem(key)
                }
            })
        }, undefined)
    }

    async getAllKeys(): Promise<string[]> {
        return ErrorHandler.safeExecute(() => {
            const keys = Object.keys(sessionStorage)
            return keys
                .filter(key => key.startsWith(this.getKey('')))
                .map(key => key.slice(this.getKey('').length))
        }, [])
    }

    private getKey(key: string): string {
        return super['getKey'](key)
    }

    private encrypt(data: string): string {
        return super['encrypt'](data)
    }

    private decrypt(data: string): string {
        return super['decrypt'](data)
    }
}

/**
 * IndexedDB 存储适配器
 */
class IndexedDBAdapter implements Storage.StorageAdapter {
    private dbName: string
    private storeName: string
    private version: number
    private db: IDBDatabase | null = null

    constructor(options: { dbName?: string; storeName?: string; version?: number } = {}) {
        this.dbName = options.dbName || 'GameCollection'
        this.storeName = options.storeName || 'storage'
        this.version = options.version || 1
    }

    private async openDB(): Promise<IDBDatabase> {
        if (this.db) return this.db

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version)

            request.onerror = () => reject(request.error)
            request.onsuccess = () => {
                this.db = request.result
                resolve(this.db)
            }

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: 'key' })
                }
            }
        })
    }

    async getItem<T>(key: string): Promise<T | null> {
        try {
            const db = await this.openDB()
            const transaction = db.transaction([this.storeName], 'readonly')
            const store = transaction.objectStore(this.storeName)

            return new Promise((resolve, reject) => {
                const request = store.get(key)
                request.onerror = () => reject(request.error)
                request.onsuccess = () => {
                    const result = request.result
                    if (!result) {
                        resolve(null)
                        return
                    }

                    const item: StorageItem<T> = result.value

                    // 检查是否过期
                    if (item.expiration && Date.now() > item.expiration) {
                        this.removeItem(key)
                        resolve(null)
                        return
                    }

                    resolve(item.value)
                }
            })
        } catch (error) {
            console.error('IndexedDB getItem error:', error)
            return null
        }
    }

    async setItem<T>(key: string, value: T, expiration?: number): Promise<void> {
        try {
            const db = await this.openDB()
            const transaction = db.transaction([this.storeName], 'readwrite')
            const store = transaction.objectStore(this.storeName)

            const item: StorageItem<T> = {
                value,
                timestamp: Date.now(),
                expiration: expiration ? Date.now() + expiration : undefined
            }

            return new Promise((resolve, reject) => {
                const request = store.put({ key, value: item })
                request.onerror = () => reject(request.error)
                request.onsuccess = () => resolve()
            })
        } catch (error) {
            console.error('IndexedDB setItem error:', error)
        }
    }

    async removeItem(key: string): Promise<void> {
        try {
            const db = await this.openDB()
            const transaction = db.transaction([this.storeName], 'readwrite')
            const store = transaction.objectStore(this.storeName)

            return new Promise((resolve, reject) => {
                const request = store.delete(key)
                request.onerror = () => reject(request.error)
                request.onsuccess = () => resolve()
            })
        } catch (error) {
            console.error('IndexedDB removeItem error:', error)
        }
    }

    async clear(): Promise<void> {
        try {
            const db = await this.openDB()
            const transaction = db.transaction([this.storeName], 'readwrite')
            const store = transaction.objectStore(this.storeName)

            return new Promise((resolve, reject) => {
                const request = store.clear()
                request.onerror = () => reject(request.error)
                request.onsuccess = () => resolve()
            })
        } catch (error) {
            console.error('IndexedDB clear error:', error)
        }
    }

    async getAllKeys(): Promise<string[]> {
        try {
            const db = await this.openDB()
            const transaction = db.transaction([this.storeName], 'readonly')
            const store = transaction.objectStore(this.storeName)

            return new Promise((resolve, reject) => {
                const request = store.getAllKeys()
                request.onerror = () => reject(request.error)
                request.onsuccess = () => resolve(request.result as string[])
            })
        } catch (error) {
            console.error('IndexedDB getAllKeys error:', error)
            return []
        }
    }
}

/**
 * 内存存储适配器
 */
class MemoryStorageAdapter implements Storage.StorageAdapter {
    private storage = new Map<string, StorageItem>()
    private timers = new Map<string, NodeJS.Timeout>()

    async getItem<T>(key: string): Promise<T | null> {
        const item = this.storage.get(key)
        if (!item) return null

        // 检查是否过期
        if (item.expiration && Date.now() > item.expiration) {
            this.removeItem(key)
            return null
        }

        return item.value as T
    }

    async setItem<T>(key: string, value: T, expiration?: number): Promise<void> {
        const item: StorageItem<T> = {
            value,
            timestamp: Date.now(),
            expiration: expiration ? Date.now() + expiration : undefined
        }

        this.storage.set(key, item)

        // 设置过期定时器
        if (expiration) {
            this.clearTimer(key)
            const timer = setTimeout(() => {
                this.removeItem(key)
            }, expiration)
            this.timers.set(key, timer)
        }
    }

    async removeItem(key: string): Promise<void> {
        this.storage.delete(key)
        this.clearTimer(key)
    }

    async clear(): Promise<void> {
        this.storage.clear()
        this.timers.forEach(timer => clearTimeout(timer))
        this.timers.clear()
    }

    async getAllKeys(): Promise<string[]> {
        return Array.from(this.storage.keys())
    }

    private clearTimer(key: string): void {
        const timer = this.timers.get(key)
        if (timer) {
            clearTimeout(timer)
            this.timers.delete(key)
        }
    }
}

/**
 * 存储管理器
 */
export class StorageManager {
    private adapter: Storage.StorageAdapter
    private defaultExpiration?: number

    constructor(
        type: 'localStorage' | 'sessionStorage' | 'indexedDB' | 'memory' = 'localStorage',
        config: Storage.StorageConfig = {}
    ) {
        this.defaultExpiration = config.expiration

        switch (type) {
            case 'localStorage':
                this.adapter = new LocalStorageAdapter(config)
                break
            case 'sessionStorage':
                this.adapter = new SessionStorageAdapter(config)
                break
            case 'indexedDB':
                this.adapter = new IndexedDBAdapter()
                break
            case 'memory':
                this.adapter = new MemoryStorageAdapter()
                break
            default:
                this.adapter = new LocalStorageAdapter(config)
        }
    }

    /**
     * 获取数据
     */
    async get<T>(key: Storage.StorageKey | string): Promise<T | null> {
        return this.adapter.getItem<T>(key.toString())
    }

    /**
     * 设置数据
     */
    async set<T>(
        key: Storage.StorageKey | string,
        value: T,
        expiration?: number
    ): Promise<void> {
        return this.adapter.setItem(
            key.toString(),
            value,
            expiration || this.defaultExpiration
        )
    }

    /**
     * 删除数据
     */
    async remove(key: Storage.StorageKey | string): Promise<void> {
        return this.adapter.removeItem(key.toString())
    }

    /**
     * 清空所有数据
     */
    async clear(): Promise<void> {
        return this.adapter.clear()
    }

    /**
     * 获取所有键名
     */
    async keys(): Promise<string[]> {
        return this.adapter.getAllKeys()
    }

    /**
     * 检查键是否存在
     */
    async has(key: Storage.StorageKey | string): Promise<boolean> {
        const value = await this.get(key)
        return value !== null
    }

    /**
     * 获取存储大小（仅适用于localStorage和sessionStorage）
     */
    async size(): Promise<number> {
        if (this.adapter instanceof LocalStorageAdapter) {
            const keys = await this.keys()
            let size = 0
            for (const key of keys) {
                const value = await this.get(key)
                size += JSON.stringify(value).length
            }
            return size
        }
        return 0
    }
}

/**
 * 创建默认存储实例
 */
export const storage = new StorageManager('localStorage', {
    namespace: 'game-collection',
    encryption: false,
    expiration: 30 * 24 * 60 * 60 * 1000 // 30天
})

/**
 * 创建会话存储实例
 */
export const sessionStorage = new StorageManager('sessionStorage', {
    namespace: 'game-collection-session'
})

/**
 * 创建IndexedDB存储实例
 */
export const indexedDBStorage = new StorageManager('indexedDB')

/**
 * 创建内存存储实例
 */
export const memoryStorage = new StorageManager('memory')

/**
 * 游戏数据存储工具
 */
export class GameDataStorage {
    private storage: StorageManager

    constructor(storageType: 'localStorage' | 'indexedDB' = 'localStorage') {
        this.storage = storageType === 'indexedDB' ? indexedDBStorage : storage
    }

    /**
     * 保存游戏设置
     */
    async saveGameSettings(settings: any): Promise<void> {
        await this.storage.set(Storage.StorageKey.USER_SETTINGS, settings)
    }

    /**
     * 获取游戏设置
     */
    async getGameSettings(): Promise<any> {
        return this.storage.get(Storage.StorageKey.USER_SETTINGS)
    }

    /**
     * 保存游戏分数
     */
    async saveGameScore(gameType: string, score: any): Promise<void> {
        const scores = await this.getGameScores(gameType) || []
        scores.push({
            ...score,
            id: Date.now().toString(),
            timestamp: Date.now()
        })

        // 只保留最高的10个分数
        scores.sort((a, b) => b.score - a.score)
        const topScores = scores.slice(0, 10)

        await this.storage.set(`${Storage.StorageKey.GAME_SCORES}_${gameType}`, topScores)
    }

    /**
     * 获取游戏分数
     */
    async getGameScores(gameType: string): Promise<any[]> {
        return this.storage.get(`${Storage.StorageKey.GAME_SCORES}_${gameType}`) || []
    }

    /**
     * 保存游戏存档
     */
    async saveGameData(gameType: string, saveData: any): Promise<void> {
        const saves = await this.getGameSaves(gameType) || []
        const existingIndex = saves.findIndex(save => save.slot === saveData.slot)

        const saveItem = {
            ...saveData,
            timestamp: Date.now(),
            id: saveData.id || Date.now().toString()
        }

        if (existingIndex >= 0) {
            saves[existingIndex] = saveItem
        } else {
            saves.push(saveItem)
        }

        await this.storage.set(`${Storage.StorageKey.GAME_SAVES}_${gameType}`, saves)
    }

    /**
     * 获取游戏存档
     */
    async getGameSaves(gameType: string): Promise<any[]> {
        return this.storage.get(`${Storage.StorageKey.GAME_SAVES}_${gameType}`) || []
    }

    /**
     * 删除游戏存档
     */
    async deleteGameSave(gameType: string, saveId: string): Promise<void> {
        const saves = await this.getGameSaves(gameType)
        const filteredSaves = saves.filter(save => save.id !== saveId)
        await this.storage.set(`${Storage.StorageKey.GAME_SAVES}_${gameType}`, filteredSaves)
    }

    /**
     * 保存游戏成就
     */
    async saveAchievement(achievement: any): Promise<void> {
        const achievements = await this.getAchievements() || []
        const existingIndex = achievements.findIndex(a => a.id === achievement.id)

        if (existingIndex === -1) {
            achievements.push({
                ...achievement,
                unlockedAt: Date.now()
            })
            await this.storage.set(Storage.StorageKey.GAME_ACHIEVEMENTS, achievements)
        }
    }

    /**
     * 获取游戏成就
     */
    async getAchievements(): Promise<any[]> {
        return this.storage.get(Storage.StorageKey.GAME_ACHIEVEMENTS) || []
    }

    /**
     * 保存游戏统计
     */
    async saveGameStatistics(gameType: string, stats: any): Promise<void> {
        await this.storage.set(`${Storage.StorageKey.GAME_STATISTICS}_${gameType}`, {
            ...stats,
            lastUpdated: Date.now()
        })
    }

    /**
     * 获取游戏统计
     */
    async getGameStatistics(gameType: string): Promise<any> {
        return this.storage.get(`${Storage.StorageKey.GAME_STATISTICS}_${gameType}`)
    }

    /**
     * 清除指定游戏的所有数据
     */
    async clearGameData(gameType: string): Promise<void> {
        await Promise.all([
            this.storage.remove(`${Storage.StorageKey.GAME_SCORES}_${gameType}`),
            this.storage.remove(`${Storage.StorageKey.GAME_SAVES}_${gameType}`),
            this.storage.remove(`${Storage.StorageKey.GAME_STATISTICS}_${gameType}`)
        ])
    }

    /**
     * 导出游戏数据
     */
    async exportGameData(): Promise<string> {
        const data = {
            settings: await this.getGameSettings(),
            achievements: await this.getAchievements(),
            scores: {},
            saves: {},
            statistics: {},
            exportDate: Date.now(),
            version: '1.0.0'
        }

        const gameTypes = ['tetris', 'snake', 'puzzle', 'memory']

        for (const gameType of gameTypes) {
            data.scores[gameType] = await this.getGameScores(gameType)
            data.saves[gameType] = await this.getGameSaves(gameType)
            data.statistics[gameType] = await this.getGameStatistics(gameType)
        }

        return JSON.stringify(data, null, 2)
    }

    /**
     * 导入游戏数据
     */
    async importGameData(dataString: string): Promise<boolean> {
        try {
            const data = JSON.parse(dataString)

            // 验证数据格式
            if (!data.version || !data.exportDate) {
                throw new Error('Invalid data format')
            }

            // 导入设置
            if (data.settings) {
                await this.saveGameSettings(data.settings)
            }

            // 导入成就
            if (data.achievements) {
                await this.storage.set(Storage.StorageKey.GAME_ACHIEVEMENTS, data.achievements)
            }

            // 导入游戏数据
            const gameTypes = ['tetris', 'snake', 'puzzle', 'memory']

            for (const gameType of gameTypes) {
                if (data.scores[gameType]) {
                    await this.storage.set(`${Storage.StorageKey.GAME_SCORES}_${gameType}`, data.scores[gameType])
                }
                if (data.saves[gameType]) {
                    await this.storage.set(`${Storage.StorageKey.GAME_SAVES}_${gameType}`, data.saves[gameType])
                }
                if (data.statistics[gameType]) {
                    await this.storage.set(`${Storage.StorageKey.GAME_STATISTICS}_${gameType}`, data.statistics[gameType])
                }
            }

            return true
        } catch (error) {
            console.error('导入游戏数据失败:', error)
            return false
        }
    }
}

/**
 * 默认游戏数据存储实例
 */
export const gameDataStorage = new GameDataStorage()

/**
 * 存储配额管理
 */
export class StorageQuotaManager {
    /**
     * 获取存储配额信息
     */
    static async getQuotaInfo(): Promise<{
        quota: number
        usage: number
        available: number
        percentage: number
    } | null> {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate()
                const quota = estimate.quota || 0
                const usage = estimate.usage || 0
                const available = quota - usage
                const percentage = quota > 0 ? (usage / quota) * 100 : 0

                return {
                    quota,
                    usage,
                    available,
                    percentage
                }
            } catch (error) {
                console.error('获取存储配额信息失败:', error)
            }
        }
        return null
    }

    /**
     * 检查存储空间是否充足
     */
    static async hasEnoughSpace(requiredBytes: number): Promise<boolean> {
        const quotaInfo = await this.getQuotaInfo()
        if (!quotaInfo) return true // 无法检测时假设有足够空间

        return quotaInfo.available >= requiredBytes
    }

    /**
     * 清理过期数据
     */
    static async cleanupExpiredData(): Promise<void> {
        const storageManager = new StorageManager('localStorage')
        const keys = await storageManager.keys()

        for (const key of keys) {
            try {
                await storageManager.get(key) // 这会自动清理过期数据
            } catch (error) {
                console.error(`清理过期数据失败 (${key}):`, error)
            }
        }
    }
}

/**
 * 数据同步管理器
 */
export class DataSyncManager {
    private storage: StorageManager
    private lastSyncTime: number = 0

    constructor(storage: StorageManager) {
        this.storage = storage
    }

    /**
     * 标记数据为已修改
     */
    async markDataAsModified(key: string): Promise<void> {
        const modifiedKeys = await this.storage.get('_modified_keys') || []
        if (!modifiedKeys.includes(key)) {
            modifiedKeys.push(key)
            await this.storage.set('_modified_keys', modifiedKeys)
        }
    }

    /**
     * 获取已修改的数据
     */
    async getModifiedData(): Promise<Record<string, any>> {
        const modifiedKeys = await this.storage.get('_modified_keys') || []
        const modifiedData: Record<string, any> = {}

        for (const key of modifiedKeys) {
            const value = await this.storage.get(key)
            if (value !== null) {
                modifiedData[key] = value
            }
        }

        return modifiedData
    }

    /**
     * 清除修改标记
     */
    async clearModifiedMarks(): Promise<void> {
        await this.storage.remove('_modified_keys')
        this.lastSyncTime = Date.now()
        await this.storage.set('_last_sync_time', this.lastSyncTime)
    }

    /**
     * 获取上次同步时间
     */
    async getLastSyncTime(): Promise<number> {
        if (this.lastSyncTime === 0) {
            this.lastSyncTime = await this.storage.get('_last_sync_time') || 0
        }
        return this.lastSyncTime
    }
}
