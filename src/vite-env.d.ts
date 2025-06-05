/// <reference types="vite/client" />

// Vite 客户端类型声明
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
    readonly VITE_GAME_AUTO_SAVE: string
    readonly VITE_GAME_MAX_HIGH_SCORES: string
    readonly VITE_CDN_BASE_URL: string
    readonly VITE_STATIC_BASE_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

// Vue 文件类型声明
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

// 静态资源类型声明
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

declare module '*.bmp' {
    const content: string
    export default content
}

declare module '*.tiff' {
    const content: string
    export default content
}

// 音频文件类型声明
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

declare module '*.m4a' {
    const content: string
    export default content
}

declare module '*.aac' {
    const content: string
    export default content
}

declare module '*.flac' {
    const content: string
    export default content
}

// 视频文件类型声明
declare module '*.mp4' {
    const content: string
    export default content
}

declare module '*.webm' {
    const content: string
    export default content
}

declare module '*.ogv' {
    const content: string
    export default content
}

// 字体文件类型声明
declare module '*.woff' {
    const content: string
    export default content
}

declare module '*.woff2' {
    const content: string
    export default content
}

declare module '*.eot' {
    const content: string
    export default content
}

declare module '*.ttf' {
    const content: string
    export default content
}

declare module '*.otf' {
    const content: string
    export default content
}

// CSS 模块类型声明
declare module '*.module.css' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module '*.module.scss' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module '*.module.sass' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module '*.module.less' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module '*.module.styl' {
    const classes: { readonly [key: string]: string }
    export default classes
}

declare module '*.module.stylus' {
    const classes: { readonly [key: string]: string }
    export default classes
}

// PWA 相关类型声明
declare module 'virtual:pwa-register' {
    export interface RegisterSWOptions {
        immediate?: boolean
        onNeedRefresh?: () => void
        onOfflineReady?: () => void
        onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
        onRegisterError?: (error: any) => void
    }

    export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
}

declare module 'virtual:pwa-register/vue' {
    import type { Ref } from 'vue'

    export interface RegisterSWOptions {
        immediate?: boolean
        onNeedRefresh?: () => void
        onOfflineReady?: () => void
        onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
        onRegisterError?: (error: any) => void
    }

    export function useRegisterSW(options?: RegisterSWOptions): {
        needRefresh: Ref<boolean>
        offlineReady: Ref<boolean>
        updateServiceWorker: (reloadPage?: boolean) => Promise<void>
    }
}

declare module 'virtual:pwa-register/react' {
    export interface RegisterSWOptions {
        immediate?: boolean
        onNeedRefresh?: () => void
        onOfflineReady?: () => void
        onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
        onRegisterError?: (error: any) => void
    }

    export function useRegisterSW(options?: RegisterSWOptions): {
        needRefresh: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
        offlineReady: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
        updateServiceWorker: (reloadPage?: boolean) => Promise<void>
    }
}

declare module 'virtual:pwa-register/svelte' {
    import type { Writable } from 'svelte/store'

    export interface RegisterSWOptions {
        immediate?: boolean
        onNeedRefresh?: () => void
        onOfflineReady?: () => void
        onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
        onRegisterError?: (error: any) => void
    }

    export function useRegisterSW(options?: RegisterSWOptions): {
        needRefresh: Writable<boolean>
        offlineReady: Writable<boolean>
        updateServiceWorker: (reloadPage?: boolean) => Promise<void>
    }
}

// Virtual modules 类型声明
declare module 'virtual:*' {
    const content: any
    export default content
}

// Web Workers 类型声明
declare module '*?worker' {
    const workerConstructor: {
        new (): Worker
    }
    export default workerConstructor
}

declare module '*?worker&inline' {
    const workerConstructor: {
        new (): Worker
    }
    export default workerConstructor
}

declare module '*?worker&url' {
    const url: string
    export default url
}

declare module '*?sharedworker' {
    const sharedWorkerConstructor: {
        new (): SharedWorker
    }
    export default sharedWorkerConstructor
}

declare module '*?sharedworker&inline' {
    const sharedWorkerConstructor: {
        new (): SharedWorker
    }
    export default sharedWorkerConstructor
}

declare module '*?sharedworker&url' {
    const url: string
    export default url
}

// WASM 模块类型声明
declare module '*.wasm' {
    const wasmModule: WebAssembly.Module
    export default wasmModule
}

declare module '*.wasm?url' {
    const url: string
    export default url
}

// 原始文本导入
declare module '*?raw' {
    const content: string
    export default content
}

declare module '*?url' {
    const url: string
    export default url
}

declare module '*?inline' {
    const content: string
    export default content
}

// JSON 模块
declare module '*.json' {
    const value: any
    export default value
}

// YAML 模块（如果使用 YAML 插件）
declare module '*.yaml' {
    const value: any
    export default value
}

declare module '*.yml' {
    const value: any
    export default value
}

// TOML 模块（如果使用 TOML 插件）
declare module '*.toml' {
    const value: any
    export default value
}

// 全局变量声明
declare const __APP_VERSION__: string
declare const __BUILD_TIME__: string
declare const __COMMIT_HASH__: string

// Service Worker 相关
declare const __SW__: boolean
declare const __VITE_IS_MODERN__: boolean

// 开发模式相关
declare const __DEV__: boolean
declare const __PROD__: boolean
declare const __SSR__: boolean

// HMR 相关（仅开发模式）
interface ImportMeta {
    readonly hot?: {
        readonly data: any
        accept(): void
        accept(cb: (mod: any) => void): void
        accept(dep: string, cb: (mod: any) => void): void
        accept(deps: readonly string[], cb: (mods: any[]) => void): void
        dispose(cb: (data: any) => void): void
        decline(): void
        invalidate(): void
        on<T extends string>(event: T, cb: (payload: any) => void): void
        send<T extends string>(event: T, data?: any): void
    }
}
