<script setup lang="ts">
import type { APITweet } from '../api/fxtwitter'
import MediaGrid from './MediaGrid.vue'
import VideoPlayer from './VideoPlayer.vue'

defineProps<{
  tweet: APITweet
}>()

function truncateText(text: string, maxLength: number = 280): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
</script>

<template>
  <a
    :href="tweet.url"
    target="_blank"
    rel="noopener"
    class="quoted-tweet"
  >
    <div class="quoted-header">
      <img
        :src="tweet.author.avatar_url"
        :alt="tweet.author.name"
        class="quoted-avatar"
      >
      <span class="quoted-name">{{ tweet.author.name }}</span>
      <span class="quoted-screen-name">@{{ tweet.author.screen_name }}</span>
    </div>

    <div class="quoted-text">{{ truncateText(tweet.text) }}</div>

    <!-- Media in quoted tweet -->
    <div v-if="tweet.media" class="quoted-media">
      <MediaGrid
        v-if="tweet.media.photos && tweet.media.photos.length > 0"
        :photos="tweet.media.photos"
      />
      <VideoPlayer
        v-if="tweet.media.videos && tweet.media.videos.length > 0"
        :videos="tweet.media.videos"
      />
    </div>
  </a>
</template>

<style scoped>
.quoted-tweet {
  display: block;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s ease;
}

.quoted-tweet:hover {
  background-color: var(--hover-bg);
}

.quoted-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.quoted-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.quoted-name {
  font-weight: 700;
  font-size: 0.875rem;
}

.quoted-screen-name {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.quoted-text {
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.quoted-media {
  margin-top: 0.5rem;
}
</style>
