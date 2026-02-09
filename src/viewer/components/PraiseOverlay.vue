<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Stats } from '../composables/useStats'

defineProps<{
  show: boolean
  message: string
  stats: Stats
}>()

const { t } = useI18n()

const emojis = ['👏', '🙌', '🎉', '✨', '💯', '🔥', '🌟', '🥳', '👍', '💖']
const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
</script>

<template>
  <Transition name="praise">
    <div v-if="show" class="praise-overlay">
      <span class="praise-emoji display-1">{{ randomEmoji }}</span>
      <span class="praise-text">{{ message }}</span>

      <div class="streak-display mt-4">
        <span class="streak-value text-white">{{ stats.currentStreak }}</span>
        <span class="streak-label">{{ t('stats.currentStreak') }}</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.praise-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.9);
}

.praise-emoji {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.praise-text {
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  text-align: center;
  padding: 0.5rem 1.5rem;
}

.streak-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  opacity: 0.8;
}

.streak-value {
  font-size: 2rem;
  font-weight: bold;
}

.streak-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

.praise-enter-active {
  transition: opacity 0.1s ease-out;
}

.praise-enter-from {
  opacity: 0;
}
</style>
