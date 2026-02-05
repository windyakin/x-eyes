<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { APIPhoto } from '../api/fxtwitter'

const props = defineProps<{
  photos: APIPhoto[]
}>()

const lightboxOpen = ref(false)
const currentIndex = ref(0)
const loadedImages = ref<Set<number>>(new Set())

function onImageLoad(index: number) {
  loadedImages.value.add(index)
}

function openLightbox(index: number) {
  currentIndex.value = index
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}

function prevImage() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = props.photos.length - 1
  }
}

function nextImage() {
  if (currentIndex.value < props.photos.length - 1) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return

  switch (e.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      prevImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    class="media-grid"
    :class="{
      'single': photos.length === 1,
      'double': photos.length === 2,
      'triple': photos.length === 3,
      'quad': photos.length >= 4
    }"
  >
    <button
      v-for="(photo, index) in photos.slice(0, 4)"
      :key="index"
      type="button"
      class="media-item"
      @click="openLightbox(index)"
    >
      <div v-if="!loadedImages.has(index)" class="media-spinner">
        <div class="spinner"></div>
      </div>
      <img
        :src="photo.url"
        :alt="photo.altText || 'Image'"
        :class="{ 'loaded': loadedImages.has(index) }"
        @load="onImageLoad(index)"
      >
    </button>
  </div>

  <!-- Lightbox -->
  <Teleport to="body">
    <div
      v-if="lightboxOpen"
      class="lightbox-overlay"
      @click.self="closeLightbox"
    >
      <button
        type="button"
        class="lightbox-close"
        aria-label="Close"
        @click="closeLightbox"
      >
        &times;
      </button>

      <button
        v-if="photos.length > 1"
        type="button"
        class="lightbox-nav lightbox-prev"
        aria-label="Previous image"
        @click="prevImage"
      ></button>

      <img
        :src="photos[currentIndex].url"
        :alt="photos[currentIndex].altText || 'Image'"
        class="lightbox-image"
      >

      <button
        v-if="photos.length > 1"
        type="button"
        class="lightbox-nav lightbox-next"
        aria-label="Next image"
        @click="nextImage"
      ></button>

      <div v-if="photos.length > 1" class="lightbox-counter">
        {{ currentIndex + 1 }} / {{ photos.length }}
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.media-grid {
  display: grid;
  gap: 4px;
  border-radius: 12px;
  overflow: hidden;
}

.media-grid.single {
  grid-template-columns: 1fr;
}

.media-grid.double {
  grid-template-columns: 1fr 1fr;
}

.media-grid.double .media-item {
  aspect-ratio: 4 / 5;
}

.media-grid.triple {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.media-grid.triple .media-item:first-child {
  grid-row: span 2;
}

.media-grid.quad {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.media-item {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  padding: 0;
  border: none;
  background: var(--bs-secondary-bg);
  cursor: pointer;
}

.media-grid.single .media-item {
  aspect-ratio: 16 / 9;
}

.media-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease, opacity 0.3s ease;
  opacity: 0;
}

.media-item img.loaded {
  opacity: 1;
}

.media-item:hover img.loaded {
  transform: scale(1.02);
}

.media-spinner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--bs-border-color);
  border-top-color: var(--bs-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Lightbox styles */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.lightbox-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.lightbox-close:hover {
  opacity: 1;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.1);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 32px 32px;
  border: none;
  cursor: pointer;
  width: 56px;
  height: 56px;
  opacity: 0.8;
  transition: opacity 0.2s, background-color 0.2s;
  border-radius: 4px;
}

.lightbox-nav:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.2);
}

.lightbox-prev {
  left: 1rem;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iMTUgMTggOSAxMiAxNSA2Ii8+PC9zdmc+");
}

.lightbox-next {
  right: 1rem;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iOSAxOCAxNSAxMiA5IDYiLz48L3N2Zz4=");
}

.lightbox-counter {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 4px;
}
</style>
