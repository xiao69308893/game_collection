/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
// Generated by unplugin-auto-import
export {}
declare global {
  const DataSyncManager: typeof import('./utils/storage')['DataSyncManager']
  const EffectScope: typeof import('vue')['EffectScope']
  const ErrorHandler: typeof import('./utils/common')['ErrorHandler']
  const EventBus: typeof import('./utils/eventBus')['EventBus']
  const EventLogger: typeof import('./utils/eventBus')['EventLogger']
  const GameDataStorage: typeof import('./utils/storage')['GameDataStorage']
  const GameEventManager: typeof import('./utils/eventBus')['GameEventManager']
  const PWAManager: typeof import('./utils/pwaUtils')['PWAManager']
  const StorageManager: typeof import('./utils/storage')['StorageManager']
  const StorageQuotaManager: typeof import('./utils/storage')['StorageQuotaManager']
  const SystemEventListener: typeof import('./utils/eventBus')['SystemEventListener']
  const acceptHMRUpdate: typeof import('pinia')['acceptHMRUpdate']
  const chunkArray: typeof import('./utils/common')['chunkArray']
  const colorUtils: typeof import('./utils/common')['colorUtils']
  const computed: typeof import('vue')['computed']
  const copyToClipboard: typeof import('./utils/common')['copyToClipboard']
  const createApp: typeof import('vue')['createApp']
  const createPinia: typeof import('pinia')['createPinia']
  const customRef: typeof import('vue')['customRef']
  const debounce: typeof import('./utils/common')['debounce']
  const deepClone: typeof import('./utils/common')['deepClone']
  const deepMerge: typeof import('./utils/common')['deepMerge']
  const defineAsyncComponent: typeof import('vue')['defineAsyncComponent']
  const defineComponent: typeof import('vue')['defineComponent']
  const defineStore: typeof import('pinia')['defineStore']
  const downloadFile: typeof import('./utils/common')['downloadFile']
  const effectScope: typeof import('vue')['effectScope']
  const eventBus: typeof import('./utils/eventBus')['default']
  const formatDate: typeof import('./utils/common')['formatDate']
  const formatDuration: typeof import('./utils/common')['formatDuration']
  const formatFileSize: typeof import('./utils/common')['formatFileSize']
  const formatNumber: typeof import('./utils/common')['formatNumber']
  const gameDataStorage: typeof import('./utils/storage')['gameDataStorage']
  const generateId: typeof import('./utils/common')['generateId']
  const generateUUID: typeof import('./utils/common')['generateUUID']
  const getActivePinia: typeof import('pinia')['getActivePinia']
  const getBrowserInfo: typeof import('./utils/common')['getBrowserInfo']
  const getCurrentInstance: typeof import('vue')['getCurrentInstance']
  const getCurrentScope: typeof import('vue')['getCurrentScope']
  const getDeviceType: typeof import('./utils/common')['getDeviceType']
  const getImageSize: typeof import('./utils/common')['getImageSize']
  const getOrientation: typeof import('./utils/common')['getOrientation']
  const getUrlParam: typeof import('./utils/common')['getUrlParam']
  const h: typeof import('vue')['h']
  const humanizeNumber: typeof import('./utils/common')['humanizeNumber']
  const indexedDBStorage: typeof import('./utils/storage')['indexedDBStorage']
  const inject: typeof import('vue')['inject']
  const isEmpty: typeof import('./utils/common')['isEmpty']
  const isMobile: typeof import('./utils/common')['isMobile']
  const isObject: typeof import('./utils/common')['isObject']
  const isProxy: typeof import('vue')['isProxy']
  const isReactive: typeof import('vue')['isReactive']
  const isReadonly: typeof import('vue')['isReadonly']
  const isRef: typeof import('vue')['isRef']
  const isTouchDevice: typeof import('./utils/common')['isTouchDevice']
  const mapActions: typeof import('pinia')['mapActions']
  const mapGetters: typeof import('pinia')['mapGetters']
  const mapState: typeof import('pinia')['mapState']
  const mapStores: typeof import('pinia')['mapStores']
  const mapWritableState: typeof import('pinia')['mapWritableState']
  const markRaw: typeof import('vue')['markRaw']
  const memoryStorage: typeof import('./utils/storage')['memoryStorage']
  const nextTick: typeof import('vue')['nextTick']
  const onActivated: typeof import('vue')['onActivated']
  const onBeforeMount: typeof import('vue')['onBeforeMount']
  const onBeforeRouteLeave: typeof import('vue-router')['onBeforeRouteLeave']
  const onBeforeRouteUpdate: typeof import('vue-router')['onBeforeRouteUpdate']
  const onBeforeUnmount: typeof import('vue')['onBeforeUnmount']
  const onBeforeUpdate: typeof import('vue')['onBeforeUpdate']
  const onDeactivated: typeof import('vue')['onDeactivated']
  const onErrorCaptured: typeof import('vue')['onErrorCaptured']
  const onMounted: typeof import('vue')['onMounted']
  const onOrientationChange: typeof import('./utils/common')['onOrientationChange']
  const onRenderTracked: typeof import('vue')['onRenderTracked']
  const onRenderTriggered: typeof import('vue')['onRenderTriggered']
  const onScopeDispose: typeof import('vue')['onScopeDispose']
  const onServerPrefetch: typeof import('vue')['onServerPrefetch']
  const onUnmounted: typeof import('vue')['onUnmounted']
  const onUpdated: typeof import('vue')['onUpdated']
  const onWatcherCleanup: typeof import('vue')['onWatcherCleanup']
  const performanceUtils: typeof import('./utils/common')['performanceUtils']
  const provide: typeof import('vue')['provide']
  const pwaManager: typeof import('./utils/pwaUtils')['pwaManager']
  const randomChoice: typeof import('./utils/common')['randomChoice']
  const randomFloat: typeof import('./utils/common')['randomFloat']
  const randomInt: typeof import('./utils/common')['randomInt']
  const reactive: typeof import('vue')['reactive']
  const readFile: typeof import('./utils/common')['readFile']
  const readonly: typeof import('vue')['readonly']
  const ref: typeof import('vue')['ref']
  const resolveComponent: typeof import('vue')['resolveComponent']
  const sessionStorage: typeof import('./utils/storage')['sessionStorage']
  const setActivePinia: typeof import('pinia')['setActivePinia']
  const setMapStoreSuffix: typeof import('pinia')['setMapStoreSuffix']
  const setUrlParams: typeof import('./utils/common')['setUrlParams']
  const shallowReactive: typeof import('vue')['shallowReactive']
  const shallowReadonly: typeof import('vue')['shallowReadonly']
  const shallowRef: typeof import('vue')['shallowRef']
  const shuffleArray: typeof import('./utils/common')['shuffleArray']
  const storage: typeof import('./utils/storage')['storage']
  const storeToRefs: typeof import('pinia')['storeToRefs']
  const throttle: typeof import('./utils/common')['throttle']
  const toRaw: typeof import('vue')['toRaw']
  const toRef: typeof import('vue')['toRef']
  const toRefs: typeof import('vue')['toRefs']
  const toValue: typeof import('vue')['toValue']
  const triggerRef: typeof import('vue')['triggerRef']
  const uniqueArray: typeof import('./utils/common')['uniqueArray']
  const unref: typeof import('vue')['unref']
  const useAttrs: typeof import('vue')['useAttrs']
  const useCssModule: typeof import('vue')['useCssModule']
  const useCssVars: typeof import('vue')['useCssVars']
  const useI18n: typeof import('vue-i18n')['useI18n']
  const useId: typeof import('vue')['useId']
  const useLink: typeof import('vue-router')['useLink']
  const useModel: typeof import('vue')['useModel']
  const usePWA: typeof import('./composables/usePWA')['default']
  const useRoute: typeof import('vue-router')['useRoute']
  const useRouter: typeof import('vue-router')['useRouter']
  const useSlots: typeof import('vue')['useSlots']
  const useTemplateRef: typeof import('vue')['useTemplateRef']
  const validators: typeof import('./utils/common')['validators']
  const watch: typeof import('vue')['watch']
  const watchEffect: typeof import('vue')['watchEffect']
  const watchPostEffect: typeof import('vue')['watchPostEffect']
  const watchSyncEffect: typeof import('vue')['watchSyncEffect']
}
// for type re-export
declare global {
  // @ts-ignore
  export type { Component, ComponentPublicInstance, ComputedRef, DirectiveBinding, ExtractDefaultPropTypes, ExtractPropTypes, ExtractPublicPropTypes, InjectionKey, PropType, Ref, MaybeRef, MaybeRefOrGetter, VNode, WritableComputedRef } from 'vue'
  import('vue')
  // @ts-ignore
  export type { PWAManager } from './utils/pwaUtils'
  import('./utils/pwaUtils')
}
// for vue template auto import
import { UnwrapRef } from 'vue'
declare module 'vue' {
  interface GlobalComponents {}
  interface ComponentCustomProperties {
    readonly EffectScope: UnwrapRef<typeof import('vue')['EffectScope']>
    readonly PWAManager: UnwrapRef<typeof import('./utils/pwaUtils')['PWAManager']>
    readonly acceptHMRUpdate: UnwrapRef<typeof import('pinia')['acceptHMRUpdate']>
    readonly computed: UnwrapRef<typeof import('vue')['computed']>
    readonly createApp: UnwrapRef<typeof import('vue')['createApp']>
    readonly createPinia: UnwrapRef<typeof import('pinia')['createPinia']>
    readonly customRef: UnwrapRef<typeof import('vue')['customRef']>
    readonly defineAsyncComponent: UnwrapRef<typeof import('vue')['defineAsyncComponent']>
    readonly defineComponent: UnwrapRef<typeof import('vue')['defineComponent']>
    readonly defineStore: UnwrapRef<typeof import('pinia')['defineStore']>
    readonly effectScope: UnwrapRef<typeof import('vue')['effectScope']>
    readonly getActivePinia: UnwrapRef<typeof import('pinia')['getActivePinia']>
    readonly getCurrentInstance: UnwrapRef<typeof import('vue')['getCurrentInstance']>
    readonly getCurrentScope: UnwrapRef<typeof import('vue')['getCurrentScope']>
    readonly h: UnwrapRef<typeof import('vue')['h']>
    readonly inject: UnwrapRef<typeof import('vue')['inject']>
    readonly isProxy: UnwrapRef<typeof import('vue')['isProxy']>
    readonly isReactive: UnwrapRef<typeof import('vue')['isReactive']>
    readonly isReadonly: UnwrapRef<typeof import('vue')['isReadonly']>
    readonly isRef: UnwrapRef<typeof import('vue')['isRef']>
    readonly mapActions: UnwrapRef<typeof import('pinia')['mapActions']>
    readonly mapGetters: UnwrapRef<typeof import('pinia')['mapGetters']>
    readonly mapState: UnwrapRef<typeof import('pinia')['mapState']>
    readonly mapStores: UnwrapRef<typeof import('pinia')['mapStores']>
    readonly mapWritableState: UnwrapRef<typeof import('pinia')['mapWritableState']>
    readonly markRaw: UnwrapRef<typeof import('vue')['markRaw']>
    readonly nextTick: UnwrapRef<typeof import('vue')['nextTick']>
    readonly onActivated: UnwrapRef<typeof import('vue')['onActivated']>
    readonly onBeforeMount: UnwrapRef<typeof import('vue')['onBeforeMount']>
    readonly onBeforeRouteLeave: UnwrapRef<typeof import('vue-router')['onBeforeRouteLeave']>
    readonly onBeforeRouteUpdate: UnwrapRef<typeof import('vue-router')['onBeforeRouteUpdate']>
    readonly onBeforeUnmount: UnwrapRef<typeof import('vue')['onBeforeUnmount']>
    readonly onBeforeUpdate: UnwrapRef<typeof import('vue')['onBeforeUpdate']>
    readonly onDeactivated: UnwrapRef<typeof import('vue')['onDeactivated']>
    readonly onErrorCaptured: UnwrapRef<typeof import('vue')['onErrorCaptured']>
    readonly onMounted: UnwrapRef<typeof import('vue')['onMounted']>
    readonly onRenderTracked: UnwrapRef<typeof import('vue')['onRenderTracked']>
    readonly onRenderTriggered: UnwrapRef<typeof import('vue')['onRenderTriggered']>
    readonly onScopeDispose: UnwrapRef<typeof import('vue')['onScopeDispose']>
    readonly onServerPrefetch: UnwrapRef<typeof import('vue')['onServerPrefetch']>
    readonly onUnmounted: UnwrapRef<typeof import('vue')['onUnmounted']>
    readonly onUpdated: UnwrapRef<typeof import('vue')['onUpdated']>
    readonly onWatcherCleanup: UnwrapRef<typeof import('vue')['onWatcherCleanup']>
    readonly provide: UnwrapRef<typeof import('vue')['provide']>
    readonly pwaManager: UnwrapRef<typeof import('./utils/pwaUtils')['pwaManager']>
    readonly reactive: UnwrapRef<typeof import('vue')['reactive']>
    readonly readonly: UnwrapRef<typeof import('vue')['readonly']>
    readonly ref: UnwrapRef<typeof import('vue')['ref']>
    readonly resolveComponent: UnwrapRef<typeof import('vue')['resolveComponent']>
    readonly setActivePinia: UnwrapRef<typeof import('pinia')['setActivePinia']>
    readonly setMapStoreSuffix: UnwrapRef<typeof import('pinia')['setMapStoreSuffix']>
    readonly shallowReactive: UnwrapRef<typeof import('vue')['shallowReactive']>
    readonly shallowReadonly: UnwrapRef<typeof import('vue')['shallowReadonly']>
    readonly shallowRef: UnwrapRef<typeof import('vue')['shallowRef']>
    readonly storeToRefs: UnwrapRef<typeof import('pinia')['storeToRefs']>
    readonly toRaw: UnwrapRef<typeof import('vue')['toRaw']>
    readonly toRef: UnwrapRef<typeof import('vue')['toRef']>
    readonly toRefs: UnwrapRef<typeof import('vue')['toRefs']>
    readonly toValue: UnwrapRef<typeof import('vue')['toValue']>
    readonly triggerRef: UnwrapRef<typeof import('vue')['triggerRef']>
    readonly unref: UnwrapRef<typeof import('vue')['unref']>
    readonly useAttrs: UnwrapRef<typeof import('vue')['useAttrs']>
    readonly useCssModule: UnwrapRef<typeof import('vue')['useCssModule']>
    readonly useCssVars: UnwrapRef<typeof import('vue')['useCssVars']>
    readonly useI18n: UnwrapRef<typeof import('vue-i18n')['useI18n']>
    readonly useId: UnwrapRef<typeof import('vue')['useId']>
    readonly useLink: UnwrapRef<typeof import('vue-router')['useLink']>
    readonly useModel: UnwrapRef<typeof import('vue')['useModel']>
    readonly usePWA: UnwrapRef<typeof import('./composables/usePWA')['default']>
    readonly useRoute: UnwrapRef<typeof import('vue-router')['useRoute']>
    readonly useRouter: UnwrapRef<typeof import('vue-router')['useRouter']>
    readonly useSlots: UnwrapRef<typeof import('vue')['useSlots']>
    readonly useTemplateRef: UnwrapRef<typeof import('vue')['useTemplateRef']>
    readonly watch: UnwrapRef<typeof import('vue')['watch']>
    readonly watchEffect: UnwrapRef<typeof import('vue')['watchEffect']>
    readonly watchPostEffect: UnwrapRef<typeof import('vue')['watchPostEffect']>
    readonly watchSyncEffect: UnwrapRef<typeof import('vue')['watchSyncEffect']>
  }
}
