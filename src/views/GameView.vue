<template>
  <div class="games-view">
    <h1>{{ t('games.title') }}</h1>

    <div class="games-grid">
      <GameCard
          v-for="game in games"
          :key="game.id"
          :game-id="game.id"
          :show-description="true"
          :show-high-score="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import GameCard from '@/components/GameCard.vue'

const { t } = useI18n()

const games = [
  { id: 'tetris' },
  { id: 'snake' },
  { id: 'puzzle' },
  { id: 'memory' }
]
</script>

<style lang="scss" scoped>
.games-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;

  h1 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 40px;
  }
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

@media (max-width: 768px) {
  .games-view {
    padding: 20px;

    h1 {
      font-size: 2rem;
    }
  }

  .games-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
