import PropTypes from 'prop-types'
import { User } from './User.jsx'
export function Post({ title, contents, author, imageUrl }) {
  return (
    <article>
      <h3>{title}</h3>
      {imageUrl && (
        <div style={{ margin: '1em 0' }}>
          <img
            src={imageUrl}
            alt={title}
            style={{ maxWidth: '100%', maxHeight: 300 }}
          />
        </div>
      )}
      <div>{contents}</div>
      {author && (
        <em>
          <br />
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
  imageUrl: PropTypes.string,
}
