// The logic that connects to IndexedDB (from your system design)
// to save the user's parsed data locally so it survives a page refresh.
// A robust, lightweight IndexedDB wrapper for local financial caching
const DB_NAME = 'CapitalGuardDB'
const STORE_NAME = 'AuditCache'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = (event) => resolve(event.target.result)
    request.onerror = (event) => reject(event.target.error)
  })
}

export const storage = {
  // Save backend analysis results to index cache
  async saveAnalysis(key, data) {
    try {
      const db = await openDB()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const request = store.put(data, key)

        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (err) {
      console.error('IndexedDB storage save failed:', err)
      return false
    }
  },

  // Load cached audit results
  async loadAnalysis(key) {
    try {
      const db = await openDB()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const request = store.get(key)

        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(request.error)
      })
    } catch (err) {
      console.error('IndexedDB storage retrieve failed:', err)
      return null
    }
  },

  // Flush cached financial files safely
  async clearAll() {
    try {
      const db = await openDB()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const request = store.clear()

        request.onsuccess = () => resolve(true)
        request.onerror = () => reject(request.error)
      })
    } catch (err) {
      console.error('IndexedDB cache clear failed:', err)
      return false
    }
  }
}

// Double-export as default to prevent any import errors!
export default storage;