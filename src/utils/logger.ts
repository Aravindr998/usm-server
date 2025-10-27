export const logger = {
  info: (message: string) => console.log(`ℹ️ ${message}`),
  success: (message: string) => console.log(`✅ ${message}`),
  error: (message: string, err?: any) => console.error(`❌ ${message}`, err || ""),
}
