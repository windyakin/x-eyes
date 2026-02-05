<script setup lang="ts">
import type { APIVideo } from '../api/fxtwitter'

defineProps<{
  videos: APIVideo[]
}>()
</script>

<template>
  <div class="video-container" v-for="(video, index) in videos" :key="index">
    <video
      :src="video.url"
      :poster="video.thumbnail_url"
      controls
      preload="metadata"
      playsinline
    >
      Your browser does not support the video tag.
    </video>
  </div>
</template>

<style scoped>
.video-container {
  border-radius: 12px;
  overflow: hidden;
  background: #000;
}

.video-container video {
  width: 100%;
  max-height: 500px;
  display: block;
}
</style>
