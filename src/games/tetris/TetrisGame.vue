<template>
  <div class="tetris-game">
    <div class="game-header">
      <h2>{{ t('games.tetris') }}</h2>
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
          <h3>{{ t('tetris.linesCleared') }}</h3>
          <div class="lines">{{ gameState.lines }}</div>
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
          <button @click="startNewGame" class="btn-primary">
            {{ t('common.newGame') }}
          </button>
        </div>
      </div>

      <div class="game-sidebar right">
        <div class="info-panel">
          <h3>{{ t('tetris.nextPiece') }}</h3>
          <div ref="nextPieceCanvas" class="preview-canvas"></div>
        </div>
        <div class="info-panel">
          <h3>{{ t('tetris.holdPiece') }}</h3>
          <div ref="holdPieceCanvas" class="preview-canvas"></div>
        </div>
        <div class="controls-panel">
          <h3>{{ t('tetris.controls') }}</h3>
          <ul class="controls-list">
            <li>{{ t('tetris.moveLeft') }}</li>
            <li>{{ t('tetris.moveRight') }}</li>
            <li>{{ t('tetris.rotate') }}</li>
            <li>{{ t('tetris.softDrop') }}</li>
            <li>{{ t('tetris.hardDrop') }}</li>
            <li>{{ t('tetris.pause') }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import Phaser from 'phaser'
import TetrisScene from './TetrisScene'

const { t } = useI18n()
const router = useRouter()
const gameStore = useGameStore()

const gameCanvas = ref<HTMLDivElement>()
const nextPieceCanvas = ref<HTMLDivElement>()
const holdPieceCanvas = ref<HTMLDivElement>()
let game: Phaser.Game | null = null

const gameState = reactive({
  score: 0,
  level: 1,
  lines: 0,
  isPaused: false,
  isGameOver: false
})

const handleBack = () => {
  if (game) {
    game.destroy(true)
  }
  router.push('/games')
}

const startNewGame = () => {
  if (game) {
    const scene = game.scene.getScene('TetrisScene') as TetrisScene
    scene.scene.restart()
  }
  gameState.isGameOver = false
  gameState.isPaused = false
}

const resumeGame = () => {
  if (game) {
    const scene = game.scene.getScene('TetrisScene') as TetrisScene
    scene.resumeGame()
  }
  gameState.isPaused = false
}

onMounted(() => {
  if (!gameCanvas.value) return

  // 记录最近游戏
  gameStore.addRecentGame('tetris')

  // Phaser游戏配置
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: gameCanvas.value,
    width: 300,
    height: 600,
    backgroundColor: '#1a1a1a',
    scene: TetrisScene,
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
        game.registry.set('nextPieceCanvas', nextPieceCanvas.value)
        game.registry.set('holdPieceCanvas', holdPieceCanvas.value)
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
.tetris-game {
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

.info-panel {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  h3 {
    margin: 0 0 8px 0;
    font-size: 1rem;
    color: var(--text-secondary);
  }

  .score, .level, .lines {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-primary);
  }
}

.preview-canvas {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  background: #2a2a2a;
  border-radius: 4px;
}

.controls-panel {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 16px;

  h3 {
    margin: 0 0 12px 0;
    font-size: 1rem;
    color: var(--text-secondary);
  }

  .controls-list {
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 0.875rem;
    color: var(--text-secondary);

    li {
      margin-bottom: 4px;
    }
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
    font-size: 1.5rem;
    margin-bottom: 30px;
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

  .controls-panel {
    display: none;
  }
}
</style>
