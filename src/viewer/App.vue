<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchTweet, type APITweet, type FetchTweetError } from './api/fxtwitter'
import TweetCard from './components/TweetCard.vue'
import ConfirmationScreen from './components/ConfirmationScreen.vue'
import BackgroundMessages from './components/BackgroundMessages.vue'
import PraiseOverlay from './components/PraiseOverlay.vue'

const tweet = ref<APITweet | null>(null)
const error = ref<FetchTweetError | null>(null)
const loading = ref(true)
const originalUrl = ref<string | null>(null)
const confirmed = ref(false)

const { tm, rt } = useI18n()

const showPraise = ref(false)
const praiseMessage = ref('')

function handleClose() {
  const messages = tm('praise.messages')
  const picked = messages[Math.floor(Math.random() * messages.length)]
  praiseMessage.value = typeof picked === 'string' ? picked : rt(picked)
  showPraise.value = true
  setTimeout(() => {
    if (history.length > 1) {
      history.back()
    } else {
      window.close()
    }
  }, 500)
}

function handleConfirm() {
  confirmed.value = true
  // Set page title based on tweet content
  if (tweet.value) {
    const author = tweet.value.author
    const textPreview = tweet.value.text.slice(0, 50) + (tweet.value.text.length > 50 ? '...' : '')
    document.title = `X Eyes - ${author.name} (@${author.screen_name}): "${textPreview}"`
  }
}

function handleCancel() {
  handleClose()
}

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
  } else {
    error.value = result.error
  }

  loading.value = false
})
</script>

<template>
  <div class="container-fluid d-flex flex-column min-vh-100 pt-5 px-3">
    <!-- Background Messages (shown during confirmation) -->
    <BackgroundMessages v-if="tweet && !confirmed" />

    <div class="flex-grow-1 d-flex justify-content-center align-items-center">
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

        <!-- Confirmation Screen -->
        <ConfirmationScreen
          v-else-if="tweet && !confirmed"
          @confirm="handleConfirm"
          @cancel="handleCancel"
        />

        <!-- Tweet Display -->
        <TweetCard v-else-if="tweet && confirmed" :tweet="tweet" @close="handleClose" />
      </div>
    </div>

    <div class="align-self-end small my-3 mt-5">
      <span class="text-body-secondary">
        Made with ❤️ by X Eyes 👀
      </span>
    </div>

    <!-- Praise Overlay -->
    <PraiseOverlay :show="showPraise" :message="praiseMessage" />
  </div>
</template>

<style scoped>
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
