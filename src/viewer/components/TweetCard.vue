<script setup lang="ts">
import type { APITweet } from '../api/fxtwitter'
import MediaGrid from './MediaGrid.vue'
import VideoPlayer from './VideoPlayer.vue'
import QuotedTweet from './QuotedTweet.vue'
import { parseEmoji, escapeAndParseEmoji } from '../utils/twemoji'

defineProps<{
  tweet: APITweet
}>()

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

  // Convert hashtags to links
  const hashtagRegex = /#(\w+)/g
  formatted = formatted.replace(hashtagRegex, '<a href="https://x.com/hashtag/$1" target="_blank" rel="noopener">#$1</a>')

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
  <div class="card tweet-card">
    <div class="card-body">
      <!-- Author Info -->
      <div class="author-info">
        <img
          :src="tweet.author.avatar_url"
          :alt="tweet.author.name"
          class="avatar"
        >
        <div class="author-names">
          <span class="display-name" v-html="formatDisplayName(tweet.author.name)"></span>
          <span class="screen-name">@{{ tweet.author.screen_name }}</span>
        </div>
      </div>

      <!-- Tweet Text -->
      <div class="tweet-text" v-html="formatText(tweet.text)"></div>

      <!-- Media -->
      <div v-if="tweet.media" class="tweet-media">
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
      <div class="tweet-footer">
        <time :datetime="tweet.created_at">{{ formatDate(tweet.created_timestamp) }}</time>
      </div>
    </div>

  </div>
</template>

<style scoped>
.tweet-card {
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-names {
  display: flex;
  flex-direction: column;
}

.display-name {
  font-weight: 700;
  line-height: 1.2;
}

.screen-name {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.tweet-text {
  font-size: 1rem;
  line-height: 1.5;
  word-wrap: break-word;
  margin-bottom: 0.75rem;
}

.tweet-text :deep(a) {
  color: var(--link-color);
  text-decoration: none;
}

.tweet-text :deep(a:hover) {
  text-decoration: underline;
}

.tweet-media {
  margin-bottom: 0.75rem;
}

.tweet-footer {
  margin-top: 0.5rem;
}

.tweet-footer time {
  color: var(--text-secondary);
  font-size: 0.875rem;
}
</style>
