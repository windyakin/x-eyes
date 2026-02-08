import { ref, computed, onMounted } from 'vue'

export interface Stats {
  totalViewed: number
  totalSkipped: number
  currentStreak: number
  bestStreak: number
  todayViewed: number
  todaySkipped: number
  lastDate: string
  satisfiedCount: number
  unsatisfiedCount: number
}

function getDefaultStats(): Stats {
  return {
    totalViewed: 0,
    totalSkipped: 0,
    currentStreak: 0,
    bestStreak: 0,
    todayViewed: 0,
    todaySkipped: 0,
    lastDate: new Date().toISOString().split('T')[0],
    satisfiedCount: 0,
    unsatisfiedCount: 0,
  }
}

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function useStats() {
  const stats = ref<Stats>(getDefaultStats())
  const isLoaded = ref(false)

  const satisfactionRate = computed(() => {
    const total = stats.value.satisfiedCount + stats.value.unsatisfiedCount
    if (total === 0) return null
    return stats.value.satisfiedCount / total
  })

  async function loadStats() {
    try {
      const response = await browser.runtime.sendMessage({ type: 'getStats' })
      if (response?.stats) {
        const stored = response.stats as Partial<Stats>
        stats.value = { ...getDefaultStats(), ...stored }
        const today = getTodayDate()
        if (stats.value.lastDate !== today) {
          stats.value.todayViewed = 0
          stats.value.todaySkipped = 0
          stats.value.lastDate = today
        }
      }
    } catch (e) {
      console.warn('Failed to load stats from storage', e)
    }
    isLoaded.value = true
  }

  async function saveStats() {
    try {
      // Convert Proxy to plain object for sendMessage
      const plainStats = JSON.parse(JSON.stringify(stats.value))
      console.log('[X Eyes] Saving stats:', plainStats)
      const response = await browser.runtime.sendMessage({ type: 'setStats', stats: plainStats })
      console.log('[X Eyes] Save response:', response)
    } catch (e) {
      console.warn('Failed to save stats to storage', e)
    }
  }

  async function recordView() {
    stats.value.totalViewed++
    stats.value.todayViewed++
    stats.value.currentStreak = 0
    stats.value.lastDate = getTodayDate()
    await saveStats()
  }

  async function recordSkip() {
    stats.value.totalSkipped++
    stats.value.todaySkipped++
    stats.value.currentStreak++
    if (stats.value.currentStreak > stats.value.bestStreak) {
      stats.value.bestStreak = stats.value.currentStreak
    }
    stats.value.lastDate = getTodayDate()
    await saveStats()
  }

  async function recordSatisfaction(satisfied: boolean) {
    if (satisfied) {
      stats.value.satisfiedCount++
    } else {
      stats.value.unsatisfiedCount++
    }
    await saveStats()
  }

  onMounted(loadStats)

  return {
    stats,
    isLoaded,
    satisfactionRate,
    recordView,
    recordSkip,
    recordSatisfaction,
  }
}
