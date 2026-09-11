import PocketBase from 'pocketbase'

const pocketBaseUrl =
  import.meta.env.VITE_POCKETBASE_URL ?? 'https://senti-pb.cloud.hochform.net'

export const pb = new PocketBase(pocketBaseUrl)

// Für eine SPA/PWA wollen wir den aktuellen Auth-Zustand
// auch nach einem Reload wiederherstellen.
pb.autoCancellation(false)

export default pb
