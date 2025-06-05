<template>
  <div class="snake-game">
    <div class="game-header">
      <h2>{{ t('games.snake') }}</h2>
      <button @click="handleBack" class="btn-back">
        {{ t('common.back') }}
      </button>
    </div>

    <div class="game-container">
      <div class="game-sidebar left">
        <div class="info-panel">
          <h3>{{ t('common.score') }}</h3>
          <div class="score">{{ gameState.score }}</div>
        </div>
        <div class="info-panel">
          <h3>{{ t('common.level') }}</h3>
          <div class="level">{{ gameState.level }}</div>
        </div>
        <div class="info-panel">
          <h3>{{ t('snake.length') }}</h3>
          <div class="length">{{ snakeLength }}</div>
        </div>
      </div>

      <div class="game-canvas-wrapper">
        <div ref="gameCanvas" class="game-canvas"></div>
        <div v-if="gameState.isPaused" class="pause-overlay">
          <h2>{{ t('common.pause') }}</h2>
          <button @click="resumeGame" class="btn-primary">
            {{ t('common.resume') }}
          </button>
        </div>
        <div v-if="gameState.isGameOver" class="gameover-overlay">
          <h2>{{ t('common.gameOver') }}</h2>
          <p>{{ t('common.score') }}: {{ gameState.score }}</p>
          <p>{{ t('snake.finalLength') }}: {{ snakeLength }}</p>
          <button @click="startNewGame" class="btn-primary">
            {{ t('common.newGame') }}
          </button>
        </div>
      </div>

      <div class="game-sidebar right">
        <div class="controls-panel">
          <h3>{{ t('snake.controls') }}</h3>
          <ul class="controls-list">
            <li>{{ t('snake.moveUp') }}: ↑ / W</li>
            <li>{{ t('snake.moveDown') }}: ↓ / S</li>
            <li>{{ t('snake.moveLeft') }}: ← / A</li>
            <li>{{ t('snake.moveRight') }}: → / D</li>
            <li>{{ t('snake.pause') }}: P / ESC</li>
          </ul>
        </div>
        <div class="tips-panel">
          <h3>{{ t('snake.tips') }}</h3>
          <ul class="tips-list">
            <li>{{ t('snake.tip1') }}</li>
            <li>{{ t('snake.tip2') }}</li>
            <li>{{ t('snake.tip3') }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 移动端虚拟按钮 -->
    <div class="mobile-controls" v-if="isMobile">
      <div class="d-pad">
        <button @touchstart="moveUp" class="btn-direction btn-up">↑</button>
        <div class="middle-row">
          <button @touchstart="moveLeft" class="btn-direction btn-left">←</button>
          <button @touchstart="moveRight" class="btn-direction btn-right">→</button>
        </div>
        <button @touchstart="moveDown" class="btn-direction btn-down">↓</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import Phaser from 'phaser'
import SnakeScene from './SnakeGame'

const { t } = useI18n()
const router = useRouter()
const gameStore = useGameStore()

const gameCanvas = ref<HTMLDivElement>()
let game: Phaser.Game | null = null

const gameState = reactive({
  score: 0,
  level: 1,
  isPaused: false,
  isGameOver: false
})

const snakeLength = ref(3)

// 检测是否为移动设备
const isMobile = computed(() => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})

const handleBack = () => {
  if (game) {
    game.destroy(true)
  }
  router.push('/games')
}

const startNewGame = () => {
  if (game) {
    const scene = game.scene.getScene('SnakeScene') as SnakeScene
    scene.scene.restart()
  }
  gameState.isGameOver = false
  gameState.isPaused = false
  snakeLength.value = 3
}

const resumeGame = () => {
  if (game) {
    const scene = game.scene.getScene('SnakeScene') as SnakeScene
    scene.resumeGame()
  }
  gameState.isPaused = false
}

// 移动端控制方法
const moveUp = () => {
  if (game) {
    const scene = game.scene.getScene('SnakeScene') as SnakeScene
    scene.setDirection(0, -1)
  }
}

const moveDown = () => {
  if (game) {
    const scene = game.scene.getScene('SnakeScene') as SnakeScene
    scene.setDirection(0, 1)
  }
}

const moveLeft = () => {
  if (game) {
    const scene = game.scene.getScene('SnakeScene') as SnakeScene
    scene.setDirection(-1, 0)
  }
}

const moveRight = () => {
  if (game) {
    const scene = game.scene.getScene('SnakeScene') as SnakeScene
    scene.setDirection(1, 0)
  }
}

onMounted(() => {
  if (!gameCanvas.value) return

  // 记录最近游戏
  gameStore.addRecentGame('snake')

  // Phaser游戏配置
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: gameCanvas.value,
    width: 400,
    height: 400,
    backgroundColor: '#1a1a1a',
    scene: SnakeScene,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
    callbacks: {
      preBoot: (game) => {
        // 传递Vue组件的响应式状态给Phaser场景
        game.registry.set('vueState', gameState)
        game.registry.set('updateSnakeLength', (length: number) => {
          snakeLength.value = length
        })
      }
    }
  }

  game = new Phaser.Game(config)
})

onUnmounted(() => {
  if (game) {
    game.destroy(true)
  }
})
</script>

<style lang="scss" scoped>
.snake-game {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 2rem;
    color: var(--color-primary);
  }

  .btn-back {
    padding: 8px 16px;
    background: var(--color-secondary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: var(--color-secondary-dark);
    }
  }
}

.game-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: flex-start;
}

.game-sidebar {
  width: 200px;

  &.left {
    text-align: right;
  }

  &.right {
    text-align: left;
  }
}

.info-panel, .controls-panel, .tips-panel {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  h3 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    color: var(--text-secondary);
  }

  .score, .level, .length {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-primary);
  }
}

.controls-list, .tips-list {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.875rem;
  color: var(--text-secondary);

  li {
    margin-bottom: 4px;
  }
}

.game-canvas-wrapper {
  position: relative;
  background: #0a0a0a;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.game-canvas {
  display: block;
}

.pause-overlay,
.gameover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;

  h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }

  .btn-primary {
    padding: 12px 24px;
    font-size: 1.2rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: var(--color-primary-dark);
    }
  }
}

.mobile-controls {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.d-pad {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 5px;
  width: 150px;
  height: 150px;

  .btn-direction {
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;

    &:active {
      background: var(--color-primary);
      color: white;
      transform: scale(0.95);
    }
  }

  .btn-up {
    grid-column: 2;
    grid-row: 1;
  }

  .middle-row {
    grid-column: 1 / -1;
    grid-row: 2;
    display: flex;
    gap: 5px;
  }

  .btn-left {
    flex: 1;
  }

  .btn-right {
    flex: 1;
  }

  .btn-down {
    grid-column: 2;
    grid-row: 3;
  }
}

@media (max-width: 768px) {
  .game-container {
    flex-direction: column;
    align-items: center;
  }

  .game-sidebar {
    width: 100%;
    display: flex;
    gap: 16px;
    justify-content: center;

    &.left, &.right {
      text-align: center;
    }
  }

  .info-panel {
    flex: 1;
  }

  .controls-panel, .tips-panel {
    display: none;
  }

  .mobile-controls {
    display: block;
  }
}

@media (min-width: 769px) {
  .mobile-controls {
    display: none;
  }
}
</style>
