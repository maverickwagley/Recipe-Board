import {
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
} from '../services/posts.js'
import { requireAuth } from '../middleware/jwt.js'

export function postsRoutes(app, io) {
  //App Get Posts
  app.get('/api/v1/posts', async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query

    const options = { sortBy, sortOrder }

    try {
      if (author && tag) {
        return res

          .status(400)

          .json({ error: 'query by either author or tag, not both' })
      } else if (author) {
        return res.json(await listPostsByAuthor(author, options))
      } else if (tag) {
        return res.json(await listPostsByTag(tag, options))
      } else {
        return res.json(await listAllPosts(options))
      }
    } catch (err) {
      console.error('error listing posts', err)

      return res.status(500).end()
    }
  })

  //App Get Post by ID
  app.get('/api/v1/posts/:id', async (req, res) => {
    const { id } = req.params

    try {
      const post = await getPostById(id)

      if (post === null) return res.status(404).end()

      return res.json(post)
    } catch (err) {
      console.error('error getting post', err)

      return res.status(500).end()
    }
  })

  //App Create Post
  app.post('/api/v1/posts', requireAuth, async (req, res) => {
    try {
      const post = await createPost(req.auth.sub, req.body)

      // Notify all connected clients about the new post
      console.log('Emitting newPost event:', {
        id: post._id,
        title: post.title,
        author: req.auth.sub,
      })
      io.emit('newPost', {
        id: post._id,
        title: post.title,
        author: req.auth.sub,
      })

      return res.json(post)
    } catch (err) {
      console.error('error creating post', err)

      return res.status(500).end()
    }
  })

  //App Update Post
  app.patch('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const post = await updatePost(req.auth.sub, req.params.id, req.body)

      return res.json(post)
    } catch (err) {
      console.error('error updating post', err)

      return res.status(500).end()
    }
  })

  //App Delete Post
  app.delete('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const { deletedCount } = await deletePost(req.auth.sub, req.params.id)

      if (deletedCount === 0) return res.sendStatus(404)

      return res.status(204).end()
    } catch (err) {
      console.error('error deleting post', err)

      return res.status(500).end()
    }
  })

  //App Like Post
  app.post('/api/v1/posts/:id/like', async (req, res) => {
    try {
      const post = await likePost(req.params.id)

      return res.json(post)
    } catch (err) {
      console.error('error liking post', err)

      return res.status(500).end()
    }
  })
}
