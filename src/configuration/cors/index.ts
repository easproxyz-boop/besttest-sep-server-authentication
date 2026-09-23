const defaultOrigins = [
  // Tauri production
  true,
  "Origin: unifyph://",
  "Origin: unifyph://localhost",
  "Origin: http://tauri.localhost",
  "Origin: https://tauri.localhost",
  "unifyph://",
  "unifyph://localhost",
  "http://tauri.localhost",
  "https://tauri.localhost",

  // Vite dev server (mula sa devUrl mo)
  "http://localhost:1420",
  "http://127.0.0.1:1420",
]
export const allowedOrigins: string[] = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : defaultOrigins

  