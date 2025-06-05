import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
    appId: 'com.gameCollection.app',
    appName: 'Game Collection',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        App: {
            launchShowDuration: 2000
        },
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: true,
            backgroundColor: '#3b82f6',
            androidSplashResourceName: 'splash',
            androidScaleType: 'CENTER_CROP',
            showSpinner: false,
            iosSpinnerStyle: 'small',
            spinnerColor: '#ffffff'
        },
        StatusBar: {
            style: 'DEFAULT',
            backgroundColor: '#3b82f6'
        },
        Keyboard: {
            resize: 'body',
            style: 'DARK',
            resizeOnFullScreen: true
        },
        Haptics: {},
        LocalNotifications: {
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#3b82f6',
            sound: 'beep.wav'
        },
        PushNotifications: {
            presentationOptions: ['badge', 'sound', 'alert']
        }
    },
    android: {
        allowMixedContent: true,
        captureInput: true,
        webContentsDebuggingEnabled: false,
        appendUserAgent: 'GameCollection/1.0.0',
        backgroundColor: '#3b82f6',
        loggingBehavior: 'none'
    },
    ios: {
        scheme: 'GameCollection',
        contentInset: 'automatic',
        scrollEnabled: true,
        backgroundColor: '#3b82f6',
        preferredContentMode: 'mobile',
        presentationStyle: 'fullscreen'
    }
}

export default config
