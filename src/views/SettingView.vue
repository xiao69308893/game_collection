<template>
  <div class="settings-view">
    <h1>{{ t('settings.title') }}</h1>

    <div class="settings-container">
      <!-- 外观设置 -->
      <section class="settings-section">
        <h2>{{ t('settings.appearance') }}</h2>

        <div class="setting-item">
          <label>{{ t('settings.theme') }}</label>
          <div class="theme-options">
            <button
                v-for="theme in themes"
                :key="theme.value"
                @click="setTheme('auto')"
                :class="['theme-option', { active: currentTheme === theme.value }]"
            >
              <component :is="theme.icon" class="icon" />
              {{ t(theme.label) }}
            </button>
          </div>
        </div>

        <div class="setting-item">
          <label>{{ t('settings.language') }}</label>
          <select v-model="currentLocale" @change="changeLanguage" class="select-input">
            <option value="zh-CN">简体中文</option>
            <option value="en-US">English</option>
            <option value="de-DE">Deutsch</option>
            <option value="fr-FR">Français</option>
            <option value="ar-SA">العربية</option>
          </select>
        </div>
      </section>

      <!-- 音频设置 -->
      <section class="settings-section">
        <h2>{{ t('settings.audio') }}</h2>

        <div class="setting-item">
          <label>{{ t('settings.soundEffects') }}</label>
          <div class="toggle-switch">
            <input
                type="checkbox"
                id="sound-toggle"
                v-model="settings.soundEnabled"
                @change="updateSettings"
            />
            <label for="sound-toggle" class="toggle-label"></label>
          </div>
        </div>

        <div class="setting-item">
          <label>{{ t('settings.backgroundMusic') }}</label>
          <div class="toggle-switch">
            <input
                type="checkbox"
                id="music-toggle"
                v-model="settings.musicEnabled"
                @change="updateSettings"
            />
            <label for="music-toggle" class="toggle-label"></label>
          </div>
        </div>

        <div class="setting-item">
          <label>{{ t('settings.volume') }}</label>
          <input
              type="range"
              min="0"
              max="100"
              v-model.number="volumePercent"
              @input="updateVolume"
              class="volume-slider"
          />
          <span class="volume-value">{{ volumePercent }}%</span>
        </div>
      </section>

      <!-- 关于 -->
      <section class="settings-section">
        <h2>{{ t('settings.about') }}</h2>
        <div class="about-info">
          <p>{{ t('settings.version') }}: 1.0.0</p>
          <p>© 2024 Game Collection</p>
        </div>
      </section>

      <!-- 重置设置 -->
      <div class="settings-actions">
        <button @click="confirmReset" class="btn-danger">
          {{ t('settings.reset') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'
import { useGameStore } from '@/stores/game'

const { t, locale } = useI18n()
const themeStore = useThemeStore()
const gameStore = useGameStore()

const currentTheme = computed(() => themeStore.theme)
const currentLocale = ref(locale.value)
const settings = ref({ ...gameStore.settings })
const volumePercent = ref(Math.round(settings.value.volume * 100))

const themes = [
  { value: 'light', label: 'settings.lightTheme', icon: 'sun-icon' },
  { value: 'dark', label: 'settings.darkTheme', icon: 'moon-icon' },
  { value: 'auto', label: 'settings.autoTheme', icon: 'auto-icon' }
]

const setTheme = (theme: 'light' | 'dark' | 'auto') => {
  themeStore.setTheme(theme)
}

const changeLanguage = () => {
  locale.value = currentLocale.value
  localStorage.setItem('locale', currentLocale.value)
}

const updateSettings = () => {
  gameStore.settings = { ...settings.value }
  gameStore.saveSettings()
}

const updateVolume = () => {
  settings.value.volume = volumePercent.value / 100
  updateSettings()
}

const confirmReset = () => {
  if (confirm(t('settings.resetConfirm'))) {
    gameStore.resetSettings()
    settings.value = { ...gameStore.settings }
    volumePercent.value = Math.round(settings.value.volume * 100)
  }
}
</script>

<style lang="scss" scoped>
.settings-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 40px;
    text-align: center;
  }
}

.settings-container {
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 30px;
}

.settings-section {
  margin-bottom: 40px;

  &:last-child {
    margin-bottom: 0;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: var(--text-primary);
  }
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  label {
    font-size: 1rem;
    color: var(--text-secondary);
  }
}

.theme-options {
  display: flex;
  gap: 10px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--color-primary);
  }

  &.active {
    border-color: var(--color-primary);
    background: var(--color-primary);
    color: white;
  }

  .icon {
    width: 20px;
    height: 20px;
  }
}

.select-input {
  padding: 8px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
}

.toggle-switch {
  position: relative;
  width: 60px;
  height: 30px;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .toggle-label {
      background-color: var(--color-primary);

      &:before {
        transform: translateX(30px);
      }
    }
  }

  .toggle-label {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--border-color);
    transition: 0.4s;
    border-radius: 30px;

    &:before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }
}

.volume-slider {
  width: 150px;
  height: 6px;
  border-radius: 3px;
  background: var(--border-color);
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--color-primary);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--color-primary);
    cursor: pointer;
    border: none;
  }
}

.volume-value {
  margin-left: 10px;
  font-size: 0.9rem;
  color: var(--text-secondary);
  min-width: 40px;
  text-align: right;
}

.about-info {
  color: var(--text-secondary);
  line-height: 1.6;
}

.settings-actions {
  margin-top: 40px;
  text-align: center;
}

.btn-danger {
  padding: 12px 24px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #c82333;
  }
}

@media (max-width: 768px) {
  .settings-view {
    padding: 20px;

    h1 {
      font-size: 2rem;
    }
  }

  .settings-container {
    padding: 20px;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .theme-options {
    width: 100%;
    flex-wrap: wrap;
  }

  .volume-slider {
    width: 100%;
  }
}

// 图标组件（简化版）
.sun-icon,
.moon-icon,
.auto-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-size: contain;
}

.sun-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v6h-2V1zM11 17h2v6h-2v-6zM3.515 4.929l1.414-1.414L9.5 8.086 8.086 9.5 3.515 4.929zM16.5 15.914l1.414-1.414 4.571 4.571-1.414 1.414-4.571-4.571zM1 11h6v2H1v-2zM17 11h6v2h-6v-2zM3.515 19.071L8.086 14.5 9.5 15.914 4.929 20.485 3.515 19.071zM14.5 8.086L19.071 3.515l1.414 1.414L15.914 9.5 14.5 8.086z'/%3E%3C/svg%3E");
}

.moon-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z'/%3E%3C/svg%3E");
}

.auto-icon {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v6h-2V1zM3.515 4.929l1.414-1.414L9.5 8.086 8.086 9.5 3.515 4.929zM1 11h6v2H1v-2zM3.515 19.071L8.086 14.5 9.5 15.914 4.929 20.485 3.515 19.071z'/%3E%3C/svg%3E");
}
</style>
