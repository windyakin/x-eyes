// X Eyes - Background Script
// Handles URL redirects for x.com/twitter.com tweet URLs

const TWEET_URL_PATTERN = /^https?:\/\/(x|twitter)\.com\/([^/]+)\/status\/(\d+)/

// Register dynamic rules for redirecting tweet URLs
async function setupRedirectRules(): Promise<void> {
  const extensionUrl = browser.runtime.getURL('src/viewer/x-eyes.html')

  // Remove existing rules first
  const existingRules = await browser.declarativeNetRequest.getDynamicRules()
  const existingRuleIds = existingRules.map(rule => rule.id)

  if (existingRuleIds.length > 0) {
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingRuleIds
    })
  }

  // Add redirect rules for x.com and twitter.com
  await browser.declarativeNetRequest.updateDynamicRules({
    addRules: [
      {
        id: 1,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            regexSubstitution: `${extensionUrl}?url=\\0`
          }
        },
        condition: {
          regexFilter: '^https?://(x|twitter)\\.com/[^/]+/status/\\d+',
          resourceTypes: ['main_frame']
        }
      }
    ]
  })

  console.log('[X Eyes] Redirect rules configured')
}

// Initialize on extension load
browser.runtime.onInstalled.addListener(() => {
  setupRedirectRules()
})

// Also setup on browser startup
setupRedirectRules()
