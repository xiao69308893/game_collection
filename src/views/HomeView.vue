<template>
  <div class="home-view">
    <div class="hero-section">
      <h1 class="hero-title">{{ t('home.welcome') }}</h1>
      <p class="hero-description">{{ t('home.description') }}</p>
      <router-link to="/games" class="btn-primary btn-large">
        {{ t('home.startPlaying') }}
      </router-link>
    </div>

    <section v-if="recentGames.length > 0" class="recent-games">
      <h2>{{ t('home.recentlyPlayed') }}</h2>
      <div class="game-grid">
        <GameCard
            v-for="gameId in recentGames"
            :key="gameId"
            :game-id="gameId"
            :show-play-button="true"
        />
      </div>
    </section>

    <section class="popular-games">
      <h2>{{ t('home.popularGames') }}</h2>
      <div class="game-grid">
        <GameCard
            v-for="game in popularGames"
            :key="game.id"
            :game-id="game.id"
            :show-play-button="true"
        />
      </div>
    </section>

    <div class="cta-section">
      <router-link to="/games" class="btn-secondary">
        {{ t('home.viewAllGames') }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useGameStore } from '@/stores/game'
import GameCard from '@/components/GameCard.vue'

const { t } = useI18n()
const gameStore = useGameStore()

const recentGames = computed(() => gameStore.recentGames)

const popularGames = [
  { id: 'tetris' },
  { id: 'snake' },
  { id: 'puzzle' },
  { id: 'memory' }
]
</script>

<style lang="scss" scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero-section {
  text-align: center;
  padding: 60px 20px;
  background: var(--bg-secondary);
  border-radius: 16px;
  margin-bottom: 60px;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 20px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.btn-primary,
.btn-secondary {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--color-primary);
  color: white;

  &:hover {
    background: var(--color-primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &.btn-large {
    padding: 16px 32px;
    font-size: 1.25rem;
  }
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);

  &:hover {
    background: var(--bg-tertiary);
    transform: translateY(-2px);
  }
}

.recent-games,
.popular-games {
  margin-bottom: 60px;

  h2 {
    font-size: 2rem;
    margin-bottom: 30px;
    text-align: center;
  }
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.cta-section {
  text-align: center;
  padding: 40px 0;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .game-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
