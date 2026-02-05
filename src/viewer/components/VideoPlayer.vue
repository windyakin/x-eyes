<script setup lang="ts">
import type { APIVideo } from '../api/fxtwitter'

defineProps<{
  videos: APIVideo[]
}>()
</script>

<template>
  <div class="rounded-3 overflow-hidden bg-black" v-for="(video, index) in videos" :key="index">
    <video
      class="d-block w-100 video"
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
.video {
  max-height: 500px;
}
</style>
