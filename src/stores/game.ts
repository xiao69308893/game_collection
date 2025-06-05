import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface GameScore {
    game: string
    score: number
    date: string
    level?: number
    time?: number
}

export interface GameSettings {
    soundEnabled: boolean
    musicEnabled: boolean
    volume: number
}

export const useGameStore = defineStore('game', () => {
    // 游戏设置
    const settings = ref<GameSettings>({
        soundEnabled: true,
        musicEnabled: true,
        volume: 0.5
    })

    // 高分记录
    const highScores = ref<Record<string, GameScore[]>>({})

    // 最近游戏
    const recentGames = ref<string[]>([])

    // 添加高分
    const addHighScore = (gameId: string, score: GameScore) => {
        if (!highScores.value[gameId]) {
            highScores.value[gameId] = []
        }

        highScores.value[gameId].push(score)
        highScores.value[gameId].sort((a, b) => b.score - a.score)
        highScores.value[gameId] = highScores.value[gameId].slice(0, 10) // 保留前10名

        saveHighScores()
    }

    // 获取游戏最高分
    const getHighScore = (gameId: string): number => {
        const scores = highScores.value[gameId]
        return scores && scores.length > 0 ? scores[0].score : 0
    }

    // 添加最近游戏
    const addRecentGame = (gameId: string) => {
        const index = recentGames.value.indexOf(gameId)
        if (index > -1) {
            recentGames.value.splice(index, 1)
        }
        recentGames.value.unshift(gameId)
        recentGames.value = recentGames.value.slice(0, 6) // 保留最近6个
        saveRecentGames()
    }

    // 保存设置
    const saveSettings = () => {
        localStorage.setItem('gameSettings', JSON.stringify(settings.value))
    }

    // 保存高分
    const saveHighScores = () => {
        localStorage.setItem('highScores', JSON.stringify(highScores.value))
    }

    // 保存最近游戏
    const saveRecentGames = () => {
        localStorage.setItem('recentGames', JSON.stringify(recentGames.value))
    }

    // 加载数据
    const loadData = () => {
        const savedSettings = localStorage.getItem('gameSettings')
        if (savedSettings) {
            settings.value = JSON.parse(savedSettings)
        }

        const savedHighScores = localStorage.getItem('highScores')
        if (savedHighScores) {
            highScores.value = JSON.parse(savedHighScores)
        }

        const savedRecentGames = localStorage.getItem('recentGames')
        if (savedRecentGames) {
            recentGames.value = JSON.parse(savedRecentGames)
        }
    }

    // 重置设置
    const resetSettings = () => {
        settings.value = {
            soundEnabled: true,
            musicEnabled: true,
            volume: 0.5
        }
        saveSettings()
    }

    // 初始化
    loadData()

    return {
        settings,
        highScores,
        recentGames,
        addHighScore,
        getHighScore,
        addRecentGame,
        saveSettings,
        resetSettings
    }
})
