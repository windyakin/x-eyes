<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchTweet, type APITweet, type FetchTweetError } from './api/fxtwitter'
import TweetCard from './components/TweetCard.vue'

const tweet = ref<APITweet | null>(null)
const error = ref<FetchTweetError | null>(null)
const loading = ref(true)
const originalUrl = ref<string | null>(null)

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const url = params.get('url')

  if (!url) {
    error.value = {
      type: 'parse',
      message: 'No URL provided'
    }
    loading.value = false
    return
  }

  originalUrl.value = url
  const result = await fetchTweet(url)

  if (result.success) {
    tweet.value = result.tweet
    // Set page title based on tweet content
    const author = result.tweet.author
    const textPreview = result.tweet.text.slice(0, 50) + (result.tweet.text.length > 50 ? '...' : '')
    document.title = `X Eyes - ${author.name} (@${author.screen_name}): "${textPreview}"`
  } else {
    error.value = result.error
  }

  loading.value = false
})
</script>

<template>
  <div class="container">
    <div class="tweet-wrapper">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Loading tweet...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="alert alert-danger" role="alert">
          <h4 class="alert-heading">Failed to load tweet</h4>
          <p>{{ error.message }}</p>
          <hr>
          <p class="mb-0">
            <a v-if="originalUrl" :href="originalUrl" class="alert-link">
              View on X.com
            </a>
          </p>
        </div>
      </div>

      <!-- Tweet Display -->
      <TweetCard v-else-if="tweet" :tweet="tweet" />
    </div>
  </div>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.tweet-wrapper {
  width: 100%;
  max-width: 600px;
}

.loading-container {
  text-align: center;
  padding: 3rem;
}

.error-container {
  padding: 1rem;
}
</style>
