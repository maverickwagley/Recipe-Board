import PropTypes from 'prop-types'
import { User } from './User.jsx'
import { Link } from 'react-router-dom'
import slug from 'slug'

export function Post({
  title,
  contents,
  author,
  id,
  fullPost = false,
  imageUrl,
}) {
  const placeholder = 'https://via.placeholder.com/600x400?text=No+Image'

  const handleImageError = (e) => {
    if (e.target.src !== placeholder) e.target.src = placeholder
  }
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
      {author && (
        <em>
          {fullPost && <br />}
          Written by <User id={author} />
        </em>
      )}
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
  id: PropTypes.string.isRequired,
  fullPost: PropTypes.bool,
  imageUrl: PropTypes.string,
}
