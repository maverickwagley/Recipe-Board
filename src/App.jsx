import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { HelmetProvider } from 'react-helmet-async'
import { ApolloProvider } from '@apollo/client/react/index.js'
import { ApolloClient, InMemoryCache } from '@apollo/client/core/index.js'
import { io } from 'socket.io-client'
const socket = io(import.meta.env.VITE_SOCKET_HOST)
import PropTypes from 'prop-types'

const queryClient = new QueryClient()

const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL,
  cache: new InMemoryCache(),
})
socket.on('connect', () => {
  console.log('connected to socket.io as', socket.id)
  socket.emit('chat.message', 'hello from client')

  // Request notification permission on connect (if not already decided)
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      console.log('Notification permission:', permission)
    })
  }
})

socket.on('connect_error', (err) => {
  console.error('socket.io connect error:', err)
})
socket.on('chat.message', (msg) => {
  console.log(`${msg.username}: ${msg.message}`)
})

// Listen for new post notifications
socket.on('newPost', (postData) => {
  console.log('New post created:', postData)

  // Show browser notification if permission granted
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('New Recipe Posted! 🍳', {
      body: `"${postData.title}" has been added to the board`,
      icon: '/favicon.ico',
      tag: 'new-post',
    })
  } else {
    // Fallback: show alert popup
    alert(`New post created: "${postData.title}"`)
  }
})

export function App({ children }) {
  return (
    <HelmetProvider>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </HelmetProvider>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
}
