import { Board } from './pages/Board.jsx'

import { Signup } from './pages/Signup.jsx'

import { Login } from './pages/Login.jsx'

export const routes = [
  {
    path: '/',

    element: <Board />,
  },

  {
    path: '/signup',

    element: <Signup />,
  },

  {
    path: '/login',

    element: <Login />,
  },
]
