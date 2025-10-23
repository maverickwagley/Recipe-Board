import {
  getTotalViews,
  getDailyViews,
  getDailyDurations,
  trackEvent,
} from '../services/events.js'
import { getPostById } from '../services/posts.js'

// Route to track an event
export function eventRoutes(app) {
  // Track an event such as starting to view a post
  app.post('/api/v1/events', async (req, res) => {
    try {
      const { postId, session, action } = req.body

      const post = await getPostById(postId)

      if (post === null) return res.status(400).end()

      const event = await trackEvent({ postId, session, action })

      return res.json({ session: event.session })
    } catch (err) {
      console.error('error tracking action', err)

      return res.status(500).end()
    }
  })

  // Get total views for a post
  app.get('/api/v1/events/totalViews/:postId', async (req, res) => {
    try {
      const { postId } = req.params

      const post = await getPostById(postId)

      if (post === null) return res.status(400).end()

      const stats = await getTotalViews(post._id)

      return res.json(stats)
    } catch (err) {
      console.error('error getting stats', err)

      return res.status(500).end()
    }
  })

  // Get daily views for a post
  app.get('/api/v1/events/dailyViews/:postId', async (req, res) => {
    try {
      const { postId } = req.params

      const post = await getPostById(postId)

      if (post === null) return res.status(400).end()

      const stats = await getDailyViews(post._id)

      return res.json(stats)
    } catch (err) {
      console.error('error getting stats', err)

      return res.status(500).end()
    }
  })

  // Get daily durations for a post
  app.get('/api/v1/events/dailyDurations/:postId', async (req, res) => {
    try {
      const { postId } = req.params

      const post = await getPostById(postId)

      if (post === null) return res.status(400).end()

      const stats = await getDailyDurations(post._id)

      return res.json(stats)
    } catch (err) {
      console.error('error getting stats', err)

      return res.status(500).end()
    }
  })
}
