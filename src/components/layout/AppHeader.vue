<template>
  <header class="app-header">
    <div class="header-container">
      <router-link to="/" class="logo">
        <span class="logo-icon">🎮</span>
        <span class="logo-text">Game Collection</span>
      </router-link>

      <nav class="nav-menu" :class="{ active: isMenuOpen }">
        <router-link to="/" class="nav-link" @click="closeMenu">
          {{ t('home.title') }}
        </router-link>
        <router-link to="/games" class="nav-link" @click="closeMenu">
          {{ t('games.title') }}
        </router-link>
        <router-link to="/settings" class="nav-link" @click="closeMenu">
          {{ t('settings.title') }}
        </router-link>
      </nav>

      <div class="header-actions">
        <button @click="toggleTheme" class="theme-toggle" :title="t('common.theme')">
          <span v-if="actualTheme === 'dark'">🌙</span>
          <span v-else>☀️</span>
        </button>

        <div class="language-selector">
          <select v-model="currentLocale" @change="changeLanguage" class="lang-select">
            <option value="zh-CN">中文</option>
            <option value="en-US">EN</option>
            <option value="de-DE">DE</option>
            <option value="fr-FR">FR</option>
            <option value="ar-SA">AR</option>
          </select>
        </div>

        <button @click="toggleMenu" class="menu-toggle">
          <span class="menu-icon"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'

const { t, locale } = useI18n()
const themeStore = useThemeStore()

const isMenuOpen = ref(false)
const currentLocale = ref(locale.value)
const actualTheme = computed(() => themeStore.actualTheme)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const toggleTheme = () => {
  const newTheme = actualTheme.value === 'dark' ? 'light' : 'dark'
  themeStore.setTheme(newTheme)
}

const changeLanguage = () => {
  locale.value = currentLocale.value
  localStorage.setItem('locale', currentLocale.value)
}
</script>

<style lang="scss" scoped>
.app-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;

  .logo-icon {
    font-size: 1.5rem;
    margin-right: 10px;
  }
}

.nav-menu {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;

  &:hover {
    color: var(--color-primary);
  }

  &.router-link-active {
    color: var(--color-primary);

    &::after {
      content: '';
      position: absolute;
      bottom: -20px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--color-primary);
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;

  &:hover {
    background: var(--bg-tertiary);
  }
}

.lang-select {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;

  .menu-icon {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--text-primary);
    position: relative;
    transition: background 0.3s;

    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--text-primary);
      transition: transform 0.3s;
    }

    &::before {
      top: -8px;
    }

    &::after {
      bottom: -8px;
    }
  }
}

@media (max-width: 768px) {
  .nav-menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: var(--bg-secondary);
    flex-direction: column;
    padding: 20px;
    gap: 20px;
    border-bottom: 1px solid var(--border-color);
    transform: translateY(-100%);
    opacity: 0;
    transition: transform 0.3s, opacity 0.3s;

    &.active {
      transform: translateY(0);
      opacity: 1;
    }

    .nav-link.router-link-active::after {
      display: none;
    }
  }

  .menu-toggle {
    display: block;
  }
}
</style>
