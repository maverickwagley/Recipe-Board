import dotenv from 'dotenv'
dotenv.config()
import { initDatabase } from './db/init.js'
import { app } from './app.js'

const PORT = process.env.PORT || 8080

try {
  await initDatabase()
  app.listen(PORT, () => {
    console.info(`express server running on http://localhost:${PORT}`)
  })
} catch (err) {
  console.error('Failed to start server:', err)
  process.exit(1)
}
