import Phaser from 'phaser'
import { useGameStore } from '@/stores/game'

export abstract class BaseGameScene extends Phaser.Scene {
    protected gameStore = useGameStore()
    protected score: number = 0
    protected level: number = 1
    protected isPaused: boolean = false
    protected isGameOver: boolean = false
    protected gameId: string = ''

    constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
        super(config)
    }

    // 初始化游戏
    init(data?: any): void {
        this.score = 0
        this.level = 1
        this.isPaused = false
        this.isGameOver = false
    }

    // 创建游戏场景
    create(): void {
        this.setupControls()
        this.setupAudio()
        this.createGameElements()
    }

    // 更新游戏逻辑
    update(time: number, delta: number): void {
        if (!this.isPaused && !this.isGameOver) {
            this.updateGame(time, delta)
        }
    }

    // 设置控制
    protected setupControls(): void {
        // ESC 或 P 键暂停
        this.input.keyboard?.on('keydown-ESC', () => this.togglePause())
        this.input.keyboard?.on('keydown-P', () => this.togglePause())
    }

    // 设置音频
    protected setupAudio(): void {
        // 子类实现具体音效
    }

    // 播放音效
    protected playSound(key: string, volume?: number): void {
        if (this.gameStore.settings.soundEnabled) {
            const finalVolume = (volume ?? 1) * this.gameStore.settings.volume
            this.sound.play(key, { volume: finalVolume })
        }
    }

    // 播放背景音乐
    protected playMusic(key: string): void {
        if (this.gameStore.settings.musicEnabled) {
            this.sound.play(key, {
                volume: this.gameStore.settings.volume * 0.3,
                loop: true
            })
        }
    }

    // 切换暂停
    protected togglePause(): void {
        this.isPaused = !this.isPaused
        if (this.isPaused) {
            this.onPause()
        } else {
            this.onResume()
        }
    }

    // 游戏结束
    protected gameOver(): void {
        this.isGameOver = true
        this.onGameOver()

        // 保存高分
        this.gameStore.addHighScore(this.gameId, {
            game: this.gameId,
            score: this.score,
            date: new Date().toISOString(),
            level: this.level
        })
    }

    // 增加分数
    protected addScore(points: number): void {
        this.score += points
        this.onScoreUpdate(this.score)
    }

    // 提升等级
    protected levelUp(): void {
        this.level++
        this.onLevelUp(this.level)
    }

    // 抽象方法，子类必须实现
    protected abstract createGameElements(): void
    protected abstract updateGame(time: number, delta: number): void
    protected abstract onPause(): void
    protected abstract onResume(): void
    protected abstract onGameOver(): void
    protected abstract onScoreUpdate(score: number): void
    protected abstract onLevelUp(level: number): void
}
