<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ActionButtons from './ActionButtons.vue'

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const { t, tm, rt } = useI18n()

const COUNTDOWN_SECONDS = 5
const countdown = ref(COUNTDOWN_SECONDS)
const isButtonEnabled = ref(false)
let intervalId: number | null = null

const randomMessage = computed(() => {
  const messages = tm('confirmation.messages')
  const picked = messages[Math.floor(Math.random() * messages.length)]
  return typeof picked === 'string' ? picked : rt(picked)
})

const buttonText = computed(() => {
  if (isButtonEnabled.value) {
    return t('confirmation.confirm')
  }
  return t('confirmation.confirmWait', { seconds: countdown.value })
})

onMounted(() => {
  intervalId = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      isButtonEnabled.value = true
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  }, 1000)
})

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId)
  }
})

function handleConfirm() {
  if (isButtonEnabled.value) {
    emit('confirm')
  }
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <div class="confirmation-card card rounded-4 shadow">
    <div class="card-body text-center pt-5 pb-4">
      <div class="icon-container mb-4">
        <span class="display-1">👀</span>
      </div>

      <h2 class="card-title h4 mb-3">{{ randomMessage }}</h2>
      <p class="card-text text-body-secondary mb-4">{{ t('confirmation.title') }}</p>

      <!-- Action Buttons (2x2 grid) -->
      <div class="mt-5">
        <ActionButtons
          :is-confirm-enabled="isButtonEnabled"
          :confirm-button-text="buttonText"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirmation-card {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}

.icon-container {
  line-height: 1;
}
</style>
