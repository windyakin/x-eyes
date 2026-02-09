<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { tm, rt } = useI18n()

const MESSAGE_COUNT = 12

const messages = computed(() => {
  const allMessages = tm('confirmation.messages') as string[]
  const shuffled = [...allMessages].sort(() => Math.random() - 0.5)
  const slotWidth = 100 / MESSAGE_COUNT
  const baseDuration = 20
  const timeSlot = baseDuration / MESSAGE_COUNT
  const timeSlots = [...Array(MESSAGE_COUNT).keys()].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, MESSAGE_COUNT).map((msg, index) => {
    const duration = 15 + (index % 3) * 5
    const baseDelay = timeSlot * timeSlots[index]
    const delayOffset = (Math.random() - 0.5) * timeSlot * 0.6
    const fontSize = 0.8 + Math.random() * 1.8
    const baseLeft = -15 + slotWidth * index
    const leftOffset = (Math.random() - 0.5) * slotWidth * 0.6
    return {
      text: typeof msg === 'string' ? msg : rt(msg),
      style: {
        left: `${baseLeft + leftOffset}%`,
        animationDelay: `-${baseDelay + delayOffset}s`,
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
