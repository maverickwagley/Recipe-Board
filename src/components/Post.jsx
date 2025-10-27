import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'
import slug from 'slug'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likePost } from '../api/posts.js'

export function Post({
  title,
  contents,
  author,
  id,
  fullPost = false,
  imageUrl,
  likes = 0,
}) {
  const placeholder = 'https://via.placeholder.com/600x400?text=No+Image'

  const handleImageError = (e) => {
    if (e.target.src !== placeholder) e.target.src = placeholder
  }
  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: () => likePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      queryClient.invalidateQueries(['post', id])
    },
  })
  return (
    <article>
      {fullPost ? (
        <h3>{title}</h3>
      ) : (
        <Link to={`/posts/${id}/${slug(title)}`}>
          <h3>{title}</h3>
        </Link>
      )}

      {imageUrl && (
        <div style={{ margin: '1em 0' }}>
          {fullPost ? (
            <img
              className='post-image post-image--full'
              src={imageUrl}
              alt={title}
              onError={handleImageError}
            />
          ) : (
            <Link to={`/posts/${id}`}>
              <img
                className='post-image post-image--thumb'
                src={imageUrl}
                alt={title}
                onError={handleImageError}
              />
            </Link>
          )}
        </div>
      )}

      {fullPost && <div>{contents}</div>}
      <div style={{ marginTop: 8 }}>
        <strong>{likes}</strong> {likes === 1 ? 'like' : 'likes'}
        <button
          type='button'
          style={{ marginLeft: 8 }}
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isLoading}
        >
          {likeMutation.isLoading ? 'Liking...' : 'Like'}
        </button>
      </div>
      {author && (
        <em>
          {fullPost && <br />}
          Written by <User {...author} />
        </em>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.shape(User.propTypes),
  id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
  imageUrl: PropTypes.string,
  likes: PropTypes.number,
}
