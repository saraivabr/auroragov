const RATE_LIMIT_KEY = 'auth_rate_limit'
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000

interface RateLimitData {
  attempts: number
  lockedUntil: number | null
}

export function getRateLimitData(): RateLimitData {
  const data = localStorage.getItem(RATE_LIMIT_KEY)
  if (!data) {
    return { attempts: 0, lockedUntil: null }
  }
  return JSON.parse(data)
}

export function incrementAttempts(): void {
  const data = getRateLimitData()
  data.attempts += 1

  if (data.attempts >= MAX_ATTEMPTS) {
    data.lockedUntil = Date.now() + LOCKOUT_DURATION
  }

  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data))
}

export function resetAttempts(): void {
  localStorage.removeItem(RATE_LIMIT_KEY)
}

export function isRateLimited(): { limited: boolean; remainingTime?: number } {
  const data = getRateLimitData()

  if (data.lockedUntil && data.lockedUntil > Date.now()) {
    const remainingTime = Math.ceil((data.lockedUntil - Date.now()) / 1000 / 60)
    return { limited: true, remainingTime }
  }

  if (data.lockedUntil && data.lockedUntil <= Date.now()) {
    resetAttempts()
  }

  return { limited: false }
}

export function getRemainingAttempts(): number {
  const data = getRateLimitData()
  return Math.max(0, MAX_ATTEMPTS - data.attempts)
}
