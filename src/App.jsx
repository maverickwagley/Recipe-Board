import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Board } from './pages/Board.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: '/',

    element: <Board />,
  },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
