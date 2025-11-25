export function handleSocket(io) {
  io.on('connection', (socket) => {
    console.log('user connected:', socket.id)
    console.log('Total connected clients:', io.engine.clientsCount)

    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id)
      console.log('Total connected clients:', io.engine.clientsCount)
    })

    socket.on('chat.message', (message) => {
      console.log(`${socket.id}: ${message}`)
      io.emit('chat.message', { username: socket.id, message })
    })
  })
}
