<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { APIPhoto, APIVideo } from '../api/fxtwitter'

export type MediaItem =
  | { type: 'photo'; data: APIPhoto }
  | { type: 'video'; data: APIVideo }

const props = defineProps<{
  photos?: APIPhoto[]
  videos?: APIVideo[]
  disableHover?: boolean
}>()

// Combine photos and videos into a unified media list
const mediaItems = computed<MediaItem[]>(() => {
  const items: MediaItem[] = []

  // Add photos first
  if (props.photos) {
    for (const photo of props.photos) {
      items.push({ type: 'photo', data: photo })
    }
  }

  // Add videos
  if (props.videos) {
    for (const video of props.videos) {
      items.push({ type: 'video', data: video })
    }
  }

  return items
})

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const loadedMedia = ref<Set<number>>(new Set())

function onMediaLoad(index: number) {
  loadedMedia.value.add(index)
}

function openLightbox(index: number) {
  if (props.disableHover) return
  lightboxIndex.value = index
  lightboxOpen.value = true
}

function closeLightbox() {
  lightboxOpen.value = false
}

function prevMedia() {
  if (lightboxIndex.value > 0) {
    lightboxIndex.value--
  } else {
    lightboxIndex.value = mediaItems.value.length - 1
  }
}

function nextMedia() {
  if (lightboxIndex.value < mediaItems.value.length - 1) {
    lightboxIndex.value++
  } else {
    lightboxIndex.value = 0
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return

  switch (e.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      prevMedia()
      break
    case 'ArrowRight':
      nextMedia()
      break
  }
}

const currentLightboxItem = computed(() => mediaItems.value[lightboxIndex.value])

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
      'single': mediaItems.length === 1,
      'double': mediaItems.length === 2,
      'triple': mediaItems.length === 3,
      'quad': mediaItems.length >= 4,
      'no-hover': disableHover
    }"
  >
    <template v-for="(item, index) in mediaItems.slice(0, 4)" :key="index">
      <!-- Photo item -->
      <component
        :is="disableHover ? 'div' : 'button'"
        v-if="item.type === 'photo'"
        :type="disableHover ? undefined : 'button'"
        class="media-item"
        :style="mediaItems.length === 1 ? { aspectRatio: `${item.data.width} / ${item.data.height}` } : undefined"
        @click="openLightbox(index)"
      >
        <div v-if="!loadedMedia.has(index)" class="media-spinner">
          <div class="spinner"></div>
        </div>
        <img
          :src="item.data.url"
          :alt="item.data.altText || 'Image'"
          :class="{ 'loaded': loadedMedia.has(index) }"
          @load="onMediaLoad(index)"
        >
      </component>

      <!-- Video item (thumbnail with play icon) -->
      <component
        :is="disableHover ? 'div' : 'button'"
        v-else
        :type="disableHover ? undefined : 'button'"
        class="media-item video-item"
        :style="mediaItems.length === 1 ? { aspectRatio: `${item.data.width} / ${item.data.height}` } : undefined"
        @click="openLightbox(index)"
      >
        <div v-if="!loadedMedia.has(index)" class="media-spinner">
          <div class="spinner"></div>
        </div>
        <img
          :src="item.data.thumbnail_url"
          alt="Video thumbnail"
          :class="{ 'loaded': loadedMedia.has(index) }"
          @load="onMediaLoad(index)"
        >
        <div class="play-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </component>
    </template>
  </div>

  <!-- Lightbox -->
  <Teleport to="body">
    <div
      v-if="lightboxOpen && currentLightboxItem"
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
        v-if="mediaItems.length > 1"
        type="button"
        class="lightbox-nav lightbox-prev"
        aria-label="Previous"
        @click="prevMedia"
      ></button>

      <!-- Photo in lightbox -->
      <img
        v-if="currentLightboxItem.type === 'photo'"
        :src="currentLightboxItem.data.url"
        :alt="currentLightboxItem.data.altText || 'Image'"
        class="lightbox-image"
      >

      <!-- Video in lightbox -->
      <video
        v-else
        :key="lightboxIndex"
        :src="currentLightboxItem.data.url"
        :poster="currentLightboxItem.data.thumbnail_url"
        class="lightbox-video"
        controls
        autoplay
        playsinline
      >
        Your browser does not support the video tag.
      </video>

      <button
        v-if="mediaItems.length > 1"
        type="button"
        class="lightbox-nav lightbox-next"
        aria-label="Next"
        @click="nextMedia"
      ></button>

      <div v-if="mediaItems.length > 1" class="lightbox-counter">
        {{ lightboxIndex + 1 }} / {{ mediaItems.length }}
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
  aspect-ratio: auto;
}

.media-grid.single .media-item img {
  object-fit: contain;
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

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64px;
  height: 64px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: background-color 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}

.play-icon svg {
  width: 32px;
  height: 32px;
  margin-left: 2px;
}

.media-item.video-item {
  background: #000;
}

.media-item.video-item img {
  object-fit: contain;
}

.media-item.video-item:hover .play-icon {
  background: rgba(0, 0, 0, 0.8);
  transform: translate(-50%, -50%) scale(1.1);
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

.no-hover .media-item {
  cursor: default;
}

.no-hover .media-item:hover img.loaded {
  transform: none;
}

.no-hover .media-item.video-item:hover .play-icon {
  background: rgba(0, 0, 0, 0.6);
  transform: translate(-50%, -50%);
}

/* Lightbox styles */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.lightbox-image,
.lightbox-video {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
}

.lightbox-video {
  background: #000;
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
