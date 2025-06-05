<template>
  <div class="not-found">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-message">{{ t('error.notFound') }}</h2>
      <p class="error-description">
        {{ t('error.pageNotFoundDesc') }}
      </p>
      <router-link to="/" class="btn-home">
        {{ t('error.backToHome') }}
      </router-link>
    </div>
    <div class="game-animation">
      <span class="floating-block">🎮</span>
      <span class="floating-block">🎯</span>
      <span class="floating-block">🎲</span>
      <span class="floating-block">🃏</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.not-found {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.error-content {
  text-align: center;
  z-index: 2;
  position: relative;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-message {
  font-size: 2rem;
  margin: 20px 0;
  color: var(--text-primary);
}

.error-description {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.btn-home {
  display: inline-block;
  padding: 12px 32px;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    background: var(--color-primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

.game-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-block {
  position: absolute;
  font-size: 3rem;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;

  &:nth-child(1) {
    top: 20%;
    left: 10%;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    top: 60%;
    right: 15%;
    animation-delay: 5s;
  }

  &:nth-child(3) {
    bottom: 20%;
    left: 20%;
    animation-delay: 10s;
  }

  &:nth-child(4) {
    top: 40%;
    right: 30%;
    animation-delay: 15s;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(90deg);
  }
  50% {
    transform: translateY(0) rotate(180deg);
  }
  75% {
    transform: translateY(20px) rotate(270deg);
  }
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }

  .error-message {
    font-size: 1.5rem;
  }

  .error-description {
    font-size: 1rem;
    padding: 0 20px;
  }
}
</style>
