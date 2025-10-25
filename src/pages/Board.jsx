import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { Header } from '../components/Header.jsx'
import { Helmet } from 'react-helmet-async'
import { PostSorting } from '../components/PostSorting.jsx'
import { useQuery as useGraphQLQuery } from '@apollo/client/react/index.js'
import { GET_POSTS } from '../api/graphql/posts.js'
import { useState } from 'react'

export function Board() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const postsQuery = useGraphQLQuery(GET_POSTS)
  const posts = postsQuery.data?.posts ?? []

  return (
    <div style={{ padding: 8 }}>
      <Helmet>
        <title>Recipe Board</title>
        <meta name='description' content='A site to share recipes.' />
      </Helmet>
      <Header />
      <br />
      <hr />
      <CreatePost />
      <br />
      <hr />
      Filter by:
      <PostFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <PostSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <PostList posts={posts} />
    </div>
  )
}
