<template>
  <div class="game-card">
    <div class="game-icon">
      <component :is="gameIcon" />
    </div>

    <h3 class="game-title">{{ t(`games.${gameId}`) }}</h3>

    <p v-if="showDescription" class="game-description">
      {{ t(`games.${gameId}Desc`) }}
    </p>

    <div v-if="showHighScore && highScore > 0" class="game-stats">
      <span class="stat-label">{{ t('common.highScore') }}:</span>
      <span class="stat-value">{{ highScore.toLocaleString() }}</span>
    </div>

    <router-link
        v-if="showPlayButton"
        :to="`/games/${gameId}`"
        class="play-button"
    >
      {{ t('common.play') }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameStore } from '@/stores/game'

interface Props {
  gameId: string
  showDescription?: boolean
  showHighScore?: boolean
  showPlayButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showDescription: false,
  showHighScore: false,
  showPlayButton: true
})

const { t } = useI18n()
const gameStore = useGameStore()

const highScore = computed(() => gameStore.getHighScore(props.gameId))

// 游戏图标映射
const gameIcon = computed(() => {
  const icons: Record<string, string> = {
    tetris: 'TetrisIcon',
    snake: 'SnakeIcon',
    puzzle: 'PuzzleIcon',
    memory: 'MemoryIcon'
  }
  return icons[props.gameId] || 'DefaultIcon'
})
</script>

<style lang="scss" scoped>
.game-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    border-color: var(--color-primary);
  }
}

.game-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border-radius: 20px;
  font-size: 40px;
  color: var(--color-primary);
}

.game-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.game-description {
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.6;
}

.game-stats {
  margin-bottom: 20px;
  padding: 10px;
  background: var(--bg-tertiary);
  border-radius: 8px;

  .stat-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .stat-value {
    color: var(--color-primary);
    font-weight: bold;
    margin-left: 8px;
    font-size: 1.1rem;
  }
}

.play-button {
  display: inline-block;
  padding: 10px 24px;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: var(--color-primary-dark);
    transform: scale(1.05);
  }
}

// 简单的游戏图标
.TetrisIcon::before {
  content: '⬛';
}

.SnakeIcon::before {
  content: '🐍';
}

.PuzzleIcon::before {
  content: '🧩';
}

.MemoryIcon::before {
  content: '🎴';
}

.DefaultIcon::before {
  content: '🎮';
}
</style>
