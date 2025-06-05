/**
 * 通用工具函数库
 * 包含常用的工具函数，用于整个应用程序
 */

import type { Utils } from '@/types'

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否立即执行
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate = false
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            if (!immediate) func(...args)
        }

        const callNow = immediate && !timeout

        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(later, wait)

        if (callNow) func(...args)
    }
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 时间间隔（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func.apply(this, args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}

/**
 * 深拷贝对象
 * @param obj 要拷贝的对象
 * @returns 深拷贝后的对象
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as unknown as T
    }

    if (obj instanceof Array) {
        return obj.map(item => deepClone(item)) as unknown as T
    }

    if (typeof obj === 'object') {
        const clonedObj: any = {}
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key])
            }
        }
        return clonedObj
    }

    return obj
}

/**
 * 深度合并对象
 * @param target 目标对象
 * @param sources 源对象数组
 * @returns 合并后的对象
 */
export function deepMerge<T extends Record<string, any>>(
    target: T,
    ...sources: Utils.DeepPartial<T>[]
): T {
    if (!sources.length) return target

    const source = sources.shift()
    if (!source) return target

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} })
                deepMerge(target[key], source[key])
            } else {
                Object.assign(target, { [key]: source[key] })
            }
        }
    }

    return deepMerge(target, ...sources)
}

/**
 * 检查值是否为对象
 * @param item 要检查的值
 * @returns 是否为对象
 */
export function isObject(item: any): item is object {
    return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * 检查是否为空值
 * @param value 要检查的值
 * @returns 是否为空
 */
export function isEmpty(value: any): boolean {
    if (value == null) return true
    if (typeof value === 'string') return value.trim().length === 0
    if (Array.isArray(value)) return value.length === 0
    if (typeof value === 'object') return Object.keys(value).length === 0
    return false
}

/**
 * 生成唯一ID
 * @param prefix 前缀
 * @returns 唯一ID字符串
 */
export function generateId(prefix = ''): string {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`
}

/**
 * 生成UUID
 * @returns UUID字符串
 */
export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

/**
 * 格式化日期
 * @param date 日期对象或时间戳
 * @param format 格式字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number | string, format = 'YYYY-MM-DD HH:mm:ss'): string {
    const d = new Date(date)

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')

    return format
        .replace('YYYY', year.toString())
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds)
}

/**
 * 格式化时间间隔
 * @param seconds 秒数
 * @returns 格式化后的时间字符串
 */
export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }
}

/**
 * 格式化数字
 * @param num 数字
 * @param options 格式化选项
 * @returns 格式化后的数字字符串
 */
export function formatNumber(
    num: number,
    options: {
        decimals?: number
        separator?: string
        prefix?: string
        suffix?: string
    } = {}
): string {
    const { decimals = 0, separator = ',', prefix = '', suffix = '' } = options

    const fixedNum = num.toFixed(decimals)
    const parts = fixedNum.split('.')

    // 添加千位分隔符
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)

    return prefix + parts.join('.') + suffix
}

/**
 * 将数字转换为人类可读的格式
 * @param num 数字
 * @returns 格式化后的字符串
 */
export function humanizeNumber(num: number): string {
    const units = ['', 'K', 'M', 'B', 'T']
    let unitIndex = 0
    let value = num

    while (value >= 1000 && unitIndex < units.length - 1) {
        value /= 1000
        unitIndex++
    }

    const decimals = value >= 100 ? 0 : value >= 10 ? 1 : 2
    return value.toFixed(decimals) + units[unitIndex]
}

/**
 * 将字节大小转换为人类可读的格式
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的大小字符串
 */
export function formatFileSize(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * 随机生成指定范围内的整数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机整数
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 随机生成指定范围内的浮点数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机浮点数
 */
export function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min
}

/**
 * 从数组中随机选择一个元素
 * @param array 数组
 * @returns 随机元素
 */
export function randomChoice<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}

/**
 * 打乱数组顺序
 * @param array 数组
 * @returns 新的打乱后的数组
 */
export function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
}

/**
 * 将数组分块
 * @param array 数组
 * @param size 每块大小
 * @returns 分块后的二维数组
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
    }
    return chunks
}

/**
 * 数组去重
 * @param array 数组
 * @param key 对象数组的去重键
 * @returns 去重后的数组
 */
export function uniqueArray<T>(array: T[], key?: keyof T): T[] {
    if (!key) {
        return [...new Set(array)]
    }

    const seen = new Set()
    return array.filter(item => {
        const value = item[key]
        if (seen.has(value)) {
            return false
        }
        seen.add(value)
        return true
    })
}

/**
 * 获取URL参数
 * @param name 参数名
 * @param url URL字符串（可选，默认为当前页面URL）
 * @returns 参数值
 */
export function getUrlParam(name: string, url?: string): string | null {
    const urlToParse = url || window.location.href
    const urlParams = new URLSearchParams(new URL(urlToParse).search)
    return urlParams.get(name)
}

/**
 * 设置URL参数
 * @param params 参数对象
 * @param replace 是否替换当前历史记录
 */
export function setUrlParams(params: Record<string, string>, replace = false): void {
    const url = new URL(window.location.href)
    Object.keys(params).forEach(key => {
        if (params[key]) {
            url.searchParams.set(key, params[key])
        } else {
            url.searchParams.delete(key)
        }
    })

    if (replace) {
        window.history.replaceState({}, '', url.toString())
    } else {
        window.history.pushState({}, '', url.toString())
    }
}

/**
 * 检测设备类型
 * @returns 设备类型
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent.toLowerCase()
    const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    const isTablet = /tablet|ipad/i.test(userAgent)

    if (isMobile && !isTablet) return 'mobile'
    if (isTablet) return 'tablet'
    return 'desktop'
}

/**
 * 检测是否为移动设备
 * @returns 是否为移动设备
 */
export function isMobile(): boolean {
    return getDeviceType() === 'mobile'
}

/**
 * 检测是否为触摸设备
 * @returns 是否为触摸设备
 */
export function isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * 检测浏览器类型
 * @returns 浏览器信息
 */
export function getBrowserInfo(): {
    name: string
    version: string
    mobile: boolean
} {
    const userAgent = navigator.userAgent
    let name = 'Unknown'
    let version = 'Unknown'

    if (userAgent.includes('Chrome')) {
        name = 'Chrome'
        version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown'
    } else if (userAgent.includes('Firefox')) {
        name = 'Firefox'
        version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown'
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        name = 'Safari'
        version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown'
    } else if (userAgent.includes('Edge')) {
        name = 'Edge'
        version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown'
    }

    return {
        name,
        version,
        mobile: isMobile()
    }
}

/**
 * 获取屏幕方向
 * @returns 屏幕方向
 */
export function getOrientation(): 'portrait' | 'landscape' {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}

/**
 * 监听屏幕方向变化
 * @param callback 回调函数
 * @returns 取消监听的函数
 */
export function onOrientationChange(callback: (orientation: 'portrait' | 'landscape') => void): () => void {
    const handleResize = () => {
        callback(getOrientation())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 是否成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
            return true
        } else {
            // 降级处理
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            textArea.style.top = '-999999px'
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()

            const success = document.execCommand('copy')
            document.body.removeChild(textArea)
            return success
        }
    } catch (error) {
        console.error('复制到剪贴板失败:', error)
        return false
    }
}

/**
 * 下载文件
 * @param data 文件数据
 * @param filename 文件名
 * @param type MIME类型
 */
export function downloadFile(data: string | Blob, filename: string, type = 'text/plain'): void {
    const blob = data instanceof Blob ? data : new Blob([data], { type })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
}

/**
 * 读取文件内容
 * @param file 文件对象
 * @param type 读取类型
 * @returns Promise<string | ArrayBuffer>
 */
export function readFile(
    file: File,
    type: 'text' | 'dataURL' | 'arrayBuffer' = 'text'
): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            resolve(reader.result as string | ArrayBuffer)
        }

        reader.onerror = () => {
            reject(new Error('文件读取失败'))
        }

        switch (type) {
            case 'text':
                reader.readAsText(file)
                break
            case 'dataURL':
                reader.readAsDataURL(file)
                break
            case 'arrayBuffer':
                reader.readAsArrayBuffer(file)
                break
        }
    })
}

/**
 * 获取图片尺寸
 * @param src 图片地址
 * @returns Promise<{width: number, height: number}>
 */
export function getImageSize(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            resolve({
                width: img.naturalWidth,
                height: img.naturalHeight
            })
        }
        img.onerror = () => {
            reject(new Error('图片加载失败'))
        }
        img.src = src
    })
}

/**
 * 颜色转换工具
 */
export const colorUtils = {
    /**
     * 十六进制转RGB
     * @param hex 十六进制颜色值
     * @returns RGB对象
     */
    hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
    },

    /**
     * RGB转十六进制
     * @param r 红色值
     * @param g 绿色值
     * @param b 蓝色值
     * @returns 十六进制颜色值
     */
    rgbToHex(r: number, g: number, b: number): string {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }).join('')
    },

    /**
     * HSL转RGB
     * @param h 色相
     * @param s 饱和度
     * @param l 亮度
     * @returns RGB对象
     */
    hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
        h /= 360
        s /= 100
        l /= 100

        const a = s * Math.min(l, 1 - l)
        const f = (n: number) => {
            const k = (n + h / (1/12)) % 12
            return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        }

        return {
            r: Math.round(f(0) * 255),
            g: Math.round(f(8) * 255),
            b: Math.round(f(4) * 255)
        }
    }
}

/**
 * 性能监测工具
 */
export const performanceUtils = {
    /**
     * 测量函数执行时间
     * @param fn 要测量的函数
     * @param label 标签
     * @returns 函数执行结果
     */
    measure<T>(fn: () => T, label = 'Function'): T {
        const start = performance.now()
        const result = fn()
        const end = performance.now()
        console.log(`${label} 执行时间: ${(end - start).toFixed(2)}ms`)
        return result
    },

    /**
     * 测量异步函数执行时间
     * @param fn 要测量的异步函数
     * @param label 标签
     * @returns Promise<函数执行结果>
     */
    async measureAsync<T>(fn: () => Promise<T>, label = 'Async Function'): Promise<T> {
        const start = performance.now()
        const result = await fn()
        const end = performance.now()
        console.log(`${label} 执行时间: ${(end - start).toFixed(2)}ms`)
        return result
    },

    /**
     * 获取内存使用情况
     * @returns 内存信息对象
     */
    getMemoryInfo(): any {
        return (performance as any).memory || null
    }
}

/**
 * 验证工具
 */
export const validators = {
    /**
     * 验证邮箱格式
     * @param email 邮箱地址
     * @returns 是否有效
     */
    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    },

    /**
     * 验证手机号格式（中国）
     * @param phone 手机号
     * @returns 是否有效
     */
    isValidPhone(phone: string): boolean {
        const phoneRegex = /^1[3-9]\d{9}$/
        return phoneRegex.test(phone)
    },

    /**
     * 验证URL格式
     * @param url URL地址
     * @returns 是否有效
     */
    isValidUrl(url: string): boolean {
        try {
            new URL(url)
            return true
        } catch {
            return false
        }
    },

    /**
     * 验证密码强度
     * @param password 密码
     * @returns 强度等级（1-4）
     */
    getPasswordStrength(password: string): number {
        let strength = 0
        if (password.length >= 8) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^a-zA-Z0-9]/.test(password)) strength++
        return Math.min(strength, 4)
    }
}

/**
 * 错误处理工具
 */
export class ErrorHandler {
    /**
     * 安全执行函数，捕获错误
     * @param fn 要执行的函数
     * @param fallback 发生错误时的回退值
     * @returns 执行结果或回退值
     */
    static safeExecute<T>(fn: () => T, fallback: T): T {
        try {
            return fn()
        } catch (error) {
            console.error('函数执行错误:', error)
            return fallback
        }
    }

    /**
     * 安全执行异步函数
     * @param fn 要执行的异步函数
     * @param fallback 发生错误时的回退值
     * @returns Promise<执行结果或回退值>
     */
    static async safeExecuteAsync<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
        try {
            return await fn()
        } catch (error) {
            console.error('异步函数执行错误:', error)
            return fallback
        }
    }

    /**
     * 重试函数执行
     * @param fn 要重试的函数
     * @param maxRetries 最大重试次数
     * @param delay 重试间隔（毫秒）
     * @returns Promise<执行结果>
     */
    static async retry<T>(
        fn: () => Promise<T>,
        maxRetries = 3,
        delay = 1000
    ): Promise<T> {
        let lastError: Error

        for (let i = 0; i <= maxRetries; i++) {
            try {
                return await fn()
            } catch (error) {
                lastError = error as Error
                if (i < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, delay))
                }
            }
        }

        throw lastError!
    }
}
