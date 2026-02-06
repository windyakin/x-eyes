<script setup lang="ts">
import { ref } from 'vue'
import type { APITweet } from '../api/fxtwitter'
import MediaGrid from './MediaGrid.vue'
import VideoPlayer from './VideoPlayer.vue'
import QuotedTweet from './QuotedTweet.vue'
import { parseEmoji, escapeAndParseEmoji } from '../utils/twemoji'
import { formatHashtags } from '../utils/hashtag'

const props = defineProps<{
  tweet: APITweet
}>()

const copied = ref(false)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.tweet.url)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return date.toLocaleString(undefined, options)
}

function formatText(text: string): string {
  // Convert URLs to links
  const urlRegex = /(https?:\/\/[^\s]+)/g
  let formatted = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener">$1</a>')

  // Convert @mentions to links
  const mentionRegex = /@(\w+)/g
  formatted = formatted.replace(mentionRegex, '<a href="https://x.com/$1" target="_blank" rel="noopener">@$1</a>')

  // Convert hashtags to styled spans (not links)
  formatted = formatHashtags(formatted)

  // Convert newlines to <br>
  formatted = formatted.replace(/\n/g, '<br>')

  // Convert emoji to twemoji
  return parseEmoji(formatted)
}

function formatDisplayName(name: string): string {
  return escapeAndParseEmoji(name)
}
</script>

<template>
  <div class="card rounded-4 shadow-sm">
    <div class="card-body">
      <!-- Author Info -->
      <div class="d-flex align-items-center gap-3 mb-3">
        <img
          :src="tweet.author.avatar_url"
          :alt="tweet.author.name"
          class="avatar rounded-circle"
        >
        <div class="d-flex flex-column">
          <span class="display-name fw-bold lh-sm" v-html="formatDisplayName(tweet.author.name)"></span>
          <small class="text-body-secondary">@{{ tweet.author.screen_name }}</small>
        </div>
      </div>

      <!-- Tweet Text -->
      <div class="tweet-text mb-3" v-html="formatText(tweet.text)"></div>

      <!-- Media -->
      <div v-if="tweet.media" class="mb-3">
        <!-- Photos -->
        <MediaGrid
          v-if="tweet.media.photos && tweet.media.photos.length > 0"
          :photos="tweet.media.photos"
        />

        <!-- Videos -->
        <VideoPlayer
          v-if="tweet.media.videos && tweet.media.videos.length > 0"
          :videos="tweet.media.videos"
        />
      </div>

      <!-- Quoted Tweet -->
      <QuotedTweet
        v-if="tweet.quote"
        :tweet="tweet.quote"
      />

      <!-- Footer with timestamp -->
      <div class="d-flex justify-content-between align-items-center mt-2">
        <small class="text-body-secondary">
          <time :datetime="tweet.created_at">{{ formatDate(tweet.created_timestamp) }}</time>
        </small>
        <button
          type="button"
          class="btn btn-sm btn-link p-0 text-secondary text-decoration-none"
          @click="copyLink"
        >
          {{ copied ? '✓ Copied!' : 'Copy Link' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar {
  width: 48px;
  height: 48px;
  object-fit: cover;
}

.tweet-text {
  word-wrap: break-word;
}

.tweet-text :deep(a) {
  text-decoration: none;
}

.tweet-text :deep(a:hover) {
  text-decoration: underline;
}

.tweet-text :deep(.hashtag) {
  color: rgb(29, 155, 240);
}

.tweet-text :deep(.hashtag:hover) {
  text-decoration: underline;
  cursor: pointer;
}
</style>
