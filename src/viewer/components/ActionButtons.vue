<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  isConfirmEnabled: boolean
  confirmButtonText: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const { t, tm, rt } = useI18n()

const alternativeActions = computed(() => {
  const actions = tm('alternatives.actions') as string[]
  const shuffled = [...actions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 2).map(a => typeof a === 'string' ? a : rt(a))
})

function handleConfirm() {
  if (props.isConfirmEnabled) {
    emit('confirm')
  }
}

function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <div class="action-buttons">
    <p class="text-body-secondary small mb-3 text-center">{{ t('alternatives.title') }}</p>
    <div class="button-grid">
      <!-- Alternative Actions (top row) -->
      <button
        v-for="(action, index) in alternativeActions"
        :key="index"
        type="button"
        class="btn btn-success"
        @click="handleCancel"
      >
        {{ action }}
      </button>

      <!-- Confirm Button -->
      <button
        type="button"
        class="btn btn-outline-secondary"
        :disabled="!isConfirmEnabled"
        :style="{ opacity: isConfirmEnabled ? 0.7 : 0.4 }"
        @click="handleConfirm"
      >
        {{ confirmButtonText }}
      </button>

      <!-- Cancel Button -->
      <button
        type="button"
        class="btn btn-primary"
        @click="handleCancel"
      >
        {{ t('confirmation.cancel') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.button-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.button-grid .btn {
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
}

@media (max-width: 480px) {
  .button-grid {
    grid-template-columns: 1fr;
  }
}
</style>
