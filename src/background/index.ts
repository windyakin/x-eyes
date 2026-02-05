// X Eyes - Background Script
// Handles URL redirects for x.com/twitter.com tweet URLs

const TWEET_URL_PATTERN = /^https?:\/\/(x|twitter)\.com\/([^/]+)\/status\/(\d+)/

// Track tabs that are being redirected to avoid infinite loops
const redirectingTabs = new Set<number>()

// Use webRequest to cancel the original request and tabs.update to navigate to viewer
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Only handle main frame navigation
    if (details.type !== 'main_frame') {
      return {}
    }

    // Check if URL matches tweet pattern
    if (!TWEET_URL_PATTERN.test(details.url)) {
      return {}
    }

    // Skip if this tab is already being redirected
    if (details.tabId !== -1 && redirectingTabs.has(details.tabId)) {
      return {}
    }

    // Build redirect URL to viewer page
    const viewerUrl = browser.runtime.getURL('x-eyes.html')
    const redirectUrl = `${viewerUrl}?url=${encodeURIComponent(details.url)}`

    console.log('[X Eyes] Intercepting:', details.url)

    // Mark this tab as being redirected
    if (details.tabId !== -1) {
      redirectingTabs.add(details.tabId)

      // Use tabs.update to navigate to the viewer page
      browser.tabs.update(details.tabId, { url: redirectUrl }).then(() => {
        console.log('[X Eyes] Redirected tab', details.tabId, 'to viewer')
        // Remove from tracking after a short delay
        setTimeout(() => redirectingTabs.delete(details.tabId), 1000)
      }).catch((err) => {
        console.error('[X Eyes] Failed to redirect:', err)
        redirectingTabs.delete(details.tabId)
      })
    }

    // Cancel the original request
    return { cancel: true }
  },
  {
    urls: ['*://x.com/*/status/*', '*://twitter.com/*/status/*']
  },
  ['blocking']
)

console.log('[X Eyes] Background script loaded')
