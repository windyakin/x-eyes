// fxtwitter API client and type definitions

export interface APIResponse {
  code: number
  message: string
  tweet: APITweet
}

export interface APITweet {
  id: string
  url: string
  text: string
  created_at: string
  created_timestamp: number
  author: APIAuthor
  likes: number
  retweets: number
  replies: number
  views: number
  media?: APIMedia
  quote?: APITweet
  poll?: APIPoll
}

export interface APIAuthor {
  id: string
  name: string
  screen_name: string
  avatar_url: string
  avatar_color?: string
  banner_url?: string
  description?: string
  followers?: number
  following?: number
}

export interface APIMedia {
  photos?: APIPhoto[]
  videos?: APIVideo[]
  external?: APIExternalMedia
  mosaic?: APIMosaicPhoto
}

export interface APIPhoto {
  url: string
  width: number
  height: number
  altText?: string
}

export interface APIVideo {
  url: string
  thumbnail_url: string
  width: number
  height: number
  duration: number
  format?: string
}

export interface APIExternalMedia {
  type: string
  url: string
  title?: string
  description?: string
  thumbnail_url?: string
}

export interface APIMosaicPhoto {
  type: string
  formats: {
    webp: string
    jpeg: string
  }
}

export interface APIPoll {
  choices: APIPollChoice[]
  total_votes: number
  ends_at: string
  time_left_en: string
}

export interface APIPollChoice {
  label: string
  count: number
  percentage: number
}

export interface FetchTweetError {
  type: 'network' | 'api' | 'parse'
  message: string
  status?: number
}

export type FetchTweetResult =
  | { success: true; tweet: APITweet }
  | { success: false; error: FetchTweetError }

/**
 * Parse tweet URL to extract user and status ID
 */
export function parseTweetUrl(url: string): { user: string; statusId: string } | null {
  const match = url.match(/(?:x|twitter)\.com\/([^/]+)\/status\/(\d+)/)
  if (!match) return null
  return {
    user: match[1],
    statusId: match[2]
  }
}

/**
 * Fetch tweet data from fxtwitter API
 */
export async function fetchTweet(tweetUrl: string): Promise<FetchTweetResult> {
  const parsed = parseTweetUrl(tweetUrl)
  if (!parsed) {
    return {
      success: false,
      error: {
        type: 'parse',
        message: 'Invalid tweet URL format'
      }
    }
  }

  const apiUrl = `https://api.fxtwitter.com/${parsed.user}/status/${parsed.statusId}`

  try {
    const response = await fetch(apiUrl)

    if (!response.ok) {
      return {
        success: false,
        error: {
          type: 'api',
          message: `API returned status ${response.status}`,
          status: response.status
        }
      }
    }

    const data: APIResponse = await response.json()

    if (data.code !== 200) {
      return {
        success: false,
        error: {
          type: 'api',
          message: data.message || 'Unknown API error',
          status: data.code
        }
      }
    }

    return {
      success: true,
      tweet: data.tweet
    }
  } catch (e) {
    return {
      success: false,
      error: {
        type: 'network',
        message: e instanceof Error ? e.message : 'Network error'
      }
    }
  }
}
