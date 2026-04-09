const STORAGE_KEY = 'ts_sessions'

export function getSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function saveSession(sessionData) {
  const sessions = getSessions()
  sessions.push(sessionData)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function clearSessions() {
  localStorage.removeItem(STORAGE_KEY)
}
