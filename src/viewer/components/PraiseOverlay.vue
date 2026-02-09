<script setup lang="ts">
defineProps<{
  show: boolean
  message: string
}>()

const emojis = ['👏', '🙌', '🎉', '✨', '💯', '🔥', '🌟', '🥳', '👍', '💖']

const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]
</script>

<template>
  <Transition name="praise">
    <div v-if="show" class="praise-overlay">
      <span class="praise-text display-1">{{ randomEmoji }} </span>
      <span class="praise-text">{{ message }}</span>
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
  background: rgba(0, 0, 0, 0.75);
}

.praise-text {
  font-size: 2.5rem;
  font-weight: bold;
  color: #fff;
  text-align: center;
  padding: 0.75rem 1.5rem;
}

.praise-enter-active {
  transition: opacity 0.1s ease-out;
}

.praise-enter-from {
  opacity: 0;
}
</style>
