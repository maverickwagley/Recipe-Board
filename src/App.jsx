import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Board } from './Board.jsx'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Board />
    </QueryClientProvider>
  )
}
