/*
// ============================================
// 全局类型定义
// ============================================

/!**
 * 游戏相关类型定义
 *!/
export namespace Game {
    /!** 游戏状态枚举 *!/
    export enum GameState {
        IDLE = 'idle',
        PLAYING = 'playing',
        PAUSED = 'paused',
        GAME_OVER = 'game_over',
        LOADING = 'loading'
    }

    /!** 游戏难度级别 *!/
    export enum Difficulty {
        EASY = 'easy',
        NORMAL = 'normal',
        HARD = 'hard',
        EXPERT = 'expert'
    }

    /!** 游戏类型 *!/
    export type GameType = 'tetris' | 'snake' | 'puzzle' | 'memory'

    /!** 游戏分数记录 *!/
    export interface Score {
        id: string
        gameType: GameType
        score: number
        level: number
        duration: number // 游戏时长（秒）
        difficulty: Difficulty
        date: string // ISO 日期字符串
        playerName?: string
        achievements?: Achievement[]
    }

    /!** 游戏成就 *!/
    export interface Achievement {
        id: string
        name: string
        description: string
        icon: string
        unlockedAt: string // ISO 日期字符串
        rarity: 'common' | 'rare' | 'epic' | 'legendary'
    }

    /!** 游戏配置 *!/
    export interface GameConfig {
        gameType: GameType
        difficulty: Difficulty
        enableSound: boolean
        enableMusic: boolean
        enableVibration: boolean
        autoSave: boolean
        showFPS: boolean
        debugMode: boolean
    }

    /!** 游戏统计信息 *!/
    export interface GameStats {
        totalGamesPlayed: number
        totalPlayTime: number // 总游戏时间（秒）
        bestScore: number
        bestLevel: number
        averageScore: number
        gamesWon: number
        gamesLost: number
        streakCount: number // 连胜次数
        achievements: Achievement[]
        lastPlayedAt: string // ISO 日期字符串
    }
}

/!**
 * 用户界面相关类型
 *!/
export namespace UI {
    /!** 主题类型 *!/
    export type Theme = 'light' | 'dark' | 'auto'

    /!** 语言代码 *!/
    export type Locale = 'zh-CN' | 'en-US' | 'de-DE' | 'fr-FR' | 'ar-SA'

    /!** 设备类型 *!/
    export type DeviceType = 'mobile' | 'tablet' | 'desktop'

    /!** 屏幕方向 *!/
    export type Orientation = 'portrait' | 'landscape'

    /!** 导航菜单项 *!/
    export interface MenuItem {
        id: string
        label: string
        icon?: string
        route?: string
        children?: MenuItem[]
        disabled?: boolean
        badge?: string | number
    }

    /!** 模态框配置 *!/
    export interface ModalConfig {
        title: string
        content: string
        confirmText?: string
        cancelText?: string
        type?: 'info' | 'warning' | 'error' | 'success'
        showCancel?: boolean
        persistent?: boolean
    }

    /!** 通知配置 *!/
    export interface NotificationConfig {
        id: string
        title: string
        message: string
        type: 'info' | 'success' | 'warning' | 'error'
        duration?: number // 显示持续时间（毫秒）
        persistent?: boolean
        actions?: NotificationAction[]
    }

    /!** 通知操作 *!/
    export interface NotificationAction {
        label: string
        action: () => void
        style?: 'primary' | 'secondary' | 'danger'
    }
}

/!**
 * API 相关类型定义
 *!/
export namespace API {
    /!** API 响应基础结构 *!/
    export interface BaseResponse<T = any> {
        code: number
        message: string
        data: T
        timestamp: number
        success: boolean
    }

    /!** 分页参数 *!/
    export interface PaginationParams {
        page: number
        pageSize: number
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
    }

    /!** 分页响应 *!/
    export interface PaginatedResponse<T> {
        items: T[]
        total: number
        page: number
        pageSize: number
        totalPages: number
        hasNext: boolean
        hasPrevious: boolean
    }

    /!** 请求配置 *!/
    export interface RequestConfig {
        timeout?: number
        retries?: number
        headers?: Record<string, string>
        cache?: boolean
        cacheDuration?: number // 缓存持续时间（毫秒）
    }

    /!** 错误响应 *!/
    export interface ErrorResponse {
        code: number
        message: string
        details?: string
        timestamp: number
        path?: string
    }
}

/!**
 * 应用配置相关类型
 *!/
export namespace Config {
    /!** 应用环境 *!/
    export type Environment = 'development' | 'staging' | 'production' | 'test'

    /!** 应用配置 *!/
    export interface AppConfig {
        name: string
        version: string
        environment: Environment
        apiBaseURL: string
        cdnBaseURL?: string
        enableAnalytics: boolean
        enableSentry: boolean
        debugMode: boolean
        features: FeatureFlags
    }

    /!** 功能特性开关 *!/
    export interface FeatureFlags {
        enablePWA: boolean
        enableOfflineMode: boolean
        enableCloudSave: boolean
        enableMultiplayer: boolean
        enableAchievements: boolean
        enableLeaderboard: boolean
        enableReplay: boolean
        enableTutorial: boolean
    }

    /!** 游戏引擎配置 *!/
    export interface GameEngineConfig {
        physics: {
            gravity: number
            debug: boolean
        }
        renderer: {
            antialias: boolean
            backgroundColor: string
            resolution: number
        }
        audio: {
            volume: number
            mute: boolean
            format: string[]
        }
    }
}

/!**
 * 事件相关类型定义
 *!/
export namespace Events {
    /!** 游戏事件类型 *!/
    export type GameEventType =
        | 'game_start'
        | 'game_pause'
        | 'game_resume'
        | 'game_over'
        | 'score_update'
        | 'level_up'
        | 'achievement_unlock'

    /!** 游戏事件数据 *!/
    export interface GameEvent {
        type: GameEventType
        timestamp: number
        gameType: Game.GameType
        data?: Record<string, any>
    }

    /!** 系统事件类型 *!/
    export type SystemEventType =
        | 'theme_change'
        | 'language_change'
        | 'orientation_change'
        | 'network_change'
        | 'fullscreen_change'

    /!** 系统事件数据 *!/
    export interface SystemEvent {
        type: SystemEventType
        timestamp: number
        data?: Record<string, any>
    }

    /!** 事件监听器 *!/
    export type EventListener<T = any> = (event: T) => void

    /!** 事件发射器接口 *!/
    export interface EventEmitter {
        on<T>(event: string, listener: EventListener<T>): void
        off<T>(event: string, listener: EventListener<T>): void
        emit<T>(event: string, data?: T): void
        once<T>(event: string, listener: EventListener<T>): void
    }
}

/!**
 * 存储相关类型定义
 *!/
export namespace Storage {
    /!** 存储键名枚举 *!/
    export enum StorageKey {
        // 用户设置
        USER_SETTINGS = 'user_settings',
        THEME_PREFERENCE = 'theme_preference',
        LANGUAGE_PREFERENCE = 'language_preference',

        // 游戏数据
        GAME_SCORES = 'game_scores',
        GAME_ACHIEVEMENTS = 'game_achievements',
        GAME_STATISTICS = 'game_statistics',
        GAME_SAVES = 'game_saves',

        // 应用状态
        RECENT_GAMES = 'recent_games',
        APP_VERSION = 'app_version',
        FIRST_LAUNCH = 'first_launch',
        TUTORIAL_COMPLETED = 'tutorial_completed'
    }

    /!** 存储适配器接口 *!/
    export interface StorageAdapter {
        getItem<T>(key: string): Promise<T | null>
        setItem<T>(key: string, value: T, expiration?: number): Promise<void>
        removeItem(key: string): Promise<void>
        clear(): Promise<void>
        getAllKeys(): Promise<string[]>
    }

    /!** 存储配置 *!/
    export interface StorageConfig {
        namespace?: string
        encryption?: boolean
        compression?: boolean
        expiration?: number // 过期时间（毫秒）
    }
}

/!**
 * 工具类型定义
 *!/
export namespace Utils {
    /!** 深度可选类型 *!/
    export type DeepPartial<T> = {
        [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
    }

    /!** 深度只读类型 *!/
    export type DeepReadonly<T> = {
        readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P]
    }

    /!** 可空类型 *!/
    export type Nullable<T> = T | null

    /!** 可选类型 *!/
    export type Optional<T> = T | undefined

    /!** 数组元素类型 *!/
    export type ArrayElement<T> = T extends (infer U)[] ? U : never

    /!** 函数参数类型 *!/
    export type FunctionArgs<T> = T extends (...args: infer U) => any ? U : never

    /!** 函数返回类型 *!/
    export type FunctionReturn<T> = T extends (...args: any[]) => infer U ? U : never

    /!** Promise 包装类型 *!/
    export type PromiseType<T> = T extends Promise<infer U> ? U : T

    /!** 键值对类型 *!/
    export type KeyValuePair<K extends string | number | symbol, V> = {
        [P in K]: V
    }
}

/!**
 * 第三方库类型扩展
 *!/
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module '*.svg' {
    const content: string
    export default content
}

declare module '*.png' {
    const content: string
    export default content
}

declare module '*.jpg' {
    const content: string
    export default content
}

declare module '*.jpeg' {
    const content: string
    export default content
}

declare module '*.gif' {
    const content: string
    export default content
}

declare module '*.webp' {
    const content: string
    export default content
}

declare module '*.ico' {
    const content: string
    export default content
}

declare module '*.mp3' {
    const content: string
    export default content
}

declare module '*.wav' {
    const content: string
    export default content
}

declare module '*.ogg' {
    const content: string
    export default content
}

/!**
 * 全局变量类型声明
 *!/
declare global {
    interface Window {
        // 游戏相关
        __GAME_DEBUG__?: boolean
        __GAME_VERSION__?: string

        // 第三方库
        gtag?: (...args: any[]) => void
        dataLayer?: any[]

        // PWA 相关
        workbox?: any

        // 移动端相关
        DeviceMotionEvent?: {
            requestPermission?: () => Promise<'granted' | 'denied'>
        }
        DeviceOrientationEvent?: {
            requestPermission?: () => Promise<'granted' | 'denied'>
        }

        // 事件总线全局实例
        eventBus?: any
    }

    // Vite 环境变量类型
    interface ImportMetaEnv {
        readonly VITE_APP_TITLE: string
        readonly VITE_APP_DESCRIPTION: string
        readonly VITE_APP_VERSION: string
        readonly VITE_API_BASE_URL: string
        readonly VITE_API_TIMEOUT: string
        readonly VITE_ENABLE_PWA: string
        readonly VITE_ENABLE_ANALYTICS: string
        readonly VITE_ENABLE_SENTRY: string
        readonly VITE_DEBUG_MODE: string
        readonly VITE_DEFAULT_THEME: string
        readonly VITE_DEFAULT_LOCALE: string
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv
    }

    // Node.js 环境变量
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test'
            VITE_MODE?: string
        }
    }
}

// 确保此文件被视为模块
export {}
*/
