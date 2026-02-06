<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Tooltip } from 'bootstrap'
import type { APITweet } from '../api/fxtwitter'
import MediaGrid from './MediaGrid.vue'
import VideoPlayer from './VideoPlayer.vue'
import QuotedTweet from './QuotedTweet.vue'
import { parseEmoji, escapeAndParseEmoji } from '../utils/twemoji'
import { formatHashtags } from '../utils/hashtag'

const props = defineProps<{
  tweet: APITweet
}>()

const emit = defineEmits<{
  close: []
}>()

const timestampRef = ref<HTMLElement | null>(null)
let tooltipInstance: Tooltip | null = null

onMounted(() => {
  if (timestampRef.value) {
    tooltipInstance = new Tooltip(timestampRef.value, {
      title: '✓ URL Copied!',
      placement: 'top',
      trigger: 'manual'
    })
  }
})

onBeforeUnmount(() => {
  tooltipInstance?.dispose()
})

function closeWindow() {
  emit('close')
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.tweet.url)
    tooltipInstance?.show()
    setTimeout(() => {
      tooltipInstance?.hide()
    }, 1500)
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
  <div class="card rounded-4 shadow position-relative">
    <!-- Close Button -->
    <button
      type="button"
      class="btn-close position-absolute top-0 end-0 m-3"
      aria-label="Close"
      @click="closeWindow"
    ></button>

    <div class="card-body">
      <!-- Author Info -->
      <div class="d-flex align-items-center gap-2 mb-3">
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
      <div class="tweet-footer d-flex align-items-center gap-1 mt-2">
        <a
          ref="timestampRef"
          :href="tweet.url"
          class="text-body-secondary text-decoration-none"
          @click.prevent="copyLink"
        >
          <time :datetime="tweet.created_at">{{ formatDate(tweet.created_timestamp) }}</time>
        </a>
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

.tweet-footer {
  font-size: 0.875rem;
}

</style>
