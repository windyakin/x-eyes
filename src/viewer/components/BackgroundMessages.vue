<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { tm, rt } = useI18n()

const messages = computed(() => {
  const allMessages = tm('confirmation.messages') as string[]
  const shuffled = [...allMessages].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 12).map((msg, index) => {
    const duration = 15 + (index % 3) * 5
    const randomStart = Math.random() * duration
    const fontSize = 0.6 + Math.random() * 2.4
    return {
      text: typeof msg === 'string' ? msg : rt(msg),
      style: {
        left: `${-10 + Math.random() * 100}%`,
        animationDelay: `-${randomStart}s`,
        animationDuration: `${duration}s`,
        fontSize: `${fontSize}rem`
      }
    }
  })
})
</script>

<template>
  <div class="background-messages">
    <span
      v-for="(msg, index) in messages"
      :key="index"
      class="background-message"
      :style="msg.style"
    >
      {{ msg.text }}
    </span>
  </div>
</template>

<style scoped>
.background-messages {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.background-message {
  position: absolute;
  font-weight: 500;
  opacity: 0;
  white-space: nowrap;
  animation: floatUp 20s linear infinite;
}

@keyframes floatUp {
  0% {
    transform: translateY(0);
    opacity: 0;
    bottom: -5%;
  }
  10% {
    opacity: 0.1;
  }
  90% {
    opacity: 0.1;
  }
  100% {
    transform: translateY(-100vh);
    opacity: 0;
    bottom: -5%;
  }
}
</style>
