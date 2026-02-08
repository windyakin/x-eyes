<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const { t, tm, rt } = useI18n()

const randomMessage = computed(() => {
  const messages = tm('confirmation.messages')
  const picked = messages[Math.floor(Math.random() * messages.length)]
  return typeof picked === 'string' ? picked : rt(picked)
})

function handleConfirm() {
  emit('confirm')
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

      <div class="d-flex flex-column flex-sm-row gap-3 mt-5">
        <button
          type="button"
          class="btn btn-outline-primary btn-lg w-50 flex-fill"
          style="opacity: 0.5"
          @click="handleConfirm"
        >
          {{ t('confirmation.confirm') }}
        </button>
        <button
          type="button"
          class="btn btn-secondary btn-lg w-50 flex-fill"
          @click="handleCancel"
        >
          {{ t('confirmation.cancel') }}
        </button>
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
