<template>
  <footer class="app-footer">
    <div class="footer-container">
      <p class="footer-text">
        © 2024 Game Collection. {{ t('common.allRightsReserved') }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.app-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
  padding: 20px 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.footer-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}
</style>
