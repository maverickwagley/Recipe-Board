export const getPosts = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
      new URLSearchParams(queryParams),
  )

  return await res.json()
}

export const createPost = async (post) => {
  // Always send tags, default to empty array if not provided
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...post, tags: post.tags ?? [] }),
  })

  return await res.json()
}
