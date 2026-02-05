<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { APIPhoto } from '../api/fxtwitter'

const props = defineProps<{
  photos: APIPhoto[]
}>()

const lightboxOpen = ref(false)
const currentIndex = ref(0)

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
      <img
        :src="photo.url"
        :alt="photo.altText || 'Image'"
        loading="lazy"
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
      >
        &#8249;
      </button>

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
      >
        &#8250;
      </button>

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
  display: block;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
}

.media-grid.single .media-item {
  aspect-ratio: auto;
  max-height: 500px;
}

.media-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.media-item:hover img {
  transform: scale(1.02);
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
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 3rem;
  cursor: pointer;
  padding: 1rem 1.5rem;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.2s, background 0.2s;
  border-radius: 4px;
}

.lightbox-nav:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-prev {
  left: 1rem;
}

.lightbox-next {
  right: 1rem;
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
