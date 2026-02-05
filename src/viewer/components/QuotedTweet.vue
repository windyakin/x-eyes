<script setup lang="ts">
import type { APITweet } from '../api/fxtwitter'
import MediaGrid from './MediaGrid.vue'
import VideoPlayer from './VideoPlayer.vue'
import { escapeAndParseEmoji } from '../utils/twemoji'

defineProps<{
  tweet: APITweet
}>()

function formatDisplayName(name: string): string {
  return escapeAndParseEmoji(name)
}

function formatQuotedText(text: string, maxLength: number = 280): string {
  const truncated = text.length <= maxLength ? text : text.slice(0, maxLength) + '...'
  return escapeAndParseEmoji(truncated)
}
</script>

<template>
  <a
    :href="tweet.url"
    target="_blank"
    rel="noopener"
    class="quoted-tweet d-block border rounded-3 p-3 text-decoration-none"
  >
    <div class="d-flex align-items-center gap-2 mb-2">
      <img
        :src="tweet.author.avatar_url"
        :alt="tweet.author.name"
        class="quoted-avatar rounded-circle"
      >
      <small class="quoted-name fw-bold" v-html="formatDisplayName(tweet.author.name)"></small>
      <small class="text-body-secondary">@{{ tweet.author.screen_name }}</small>
    </div>

    <small class="d-block quoted-text" v-html="formatQuotedText(tweet.text)"></small>

    <!-- Media in quoted tweet -->
    <div v-if="tweet.media" class="mt-2">
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
  color: inherit;
  transition: background-color 0.2s ease;
}

.quoted-tweet:hover {
  background-color: var(--hover-bg);
}

.quoted-avatar {
  width: 20px;
  height: 20px;
}

.quoted-text {
  word-wrap: break-word;
}
</style>
