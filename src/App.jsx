import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { HelmetProvider } from 'react-helmet-async'
import { ApolloProvider } from '@apollo/client/react/index.js'
import { ApolloClient, InMemoryCache } from '@apollo/client/core/index.js'
import { io } from 'socket.io-client'

const socketHost = import.meta.env.VITE_SOCKET_HOST
console.log('Connecting to socket host:', socketHost)

const socket = io(socketHost, {
  transports: ['websocket', 'polling'],
  reconnection: true,
})

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
    const notification = new Notification('New Recipe Posted!', {
      body: `"${postData.title}" has been added to the board`,
      icon: '/favicon.ico',
      tag: 'new-post',
    })

    // Navigate to the post when notification is clicked
    notification.onclick = () => {
      window.focus()
      window.location.href = `/posts/${postData.id}`
      notification.close()
    }
  } else {
    // Fallback: show custom toast notification
    showToast(postData)
  }
})

// Custom toast notification function
function showToast(postData) {
  const toast = document.createElement('div')

  //Styling
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    color: black;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    cursor: pointer;
    max-width: 350px;
    animation: slideIn 0.3s ease-out;
  `
  toast.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 4px;">New Recipe Posted!</div>
    <div style="font-size: 14px; opacity: 0.9;">"${postData.title}" has been added</div>
    <div style="font-size: 12px; opacity: 0.7; margin-top: 8px;">Click to view</div>
  `

  // Add animation
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `
  document.head.appendChild(style)

  //When Clicked, navigate to the post
  toast.onclick = () => {
    window.location.href = `/posts/${postData.id}`
  }

  document.body.appendChild(toast)

  // Auto-remove after 5 seconds
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease-out reverse'
    setTimeout(() => toast.remove(), 300)
  }, 5000)
}

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
