import { Server } from "socket.io"
import app from "./app.js"

const port = process.env.PORT || 4000
const servidor = app.listen(port, () => {
  console.log( `Servidor Corriendo en el Puerto http://localhost:${port}` )
})

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL
  }
})
io.on('connection', (socket) => {
  // console.log( 'Conectado a Socket.io' )

  // Definir los Eventos de Socket.io
  socket.on('abrir proyecto', (proyecto) => {
    socket.join(proyecto)
  })

  socket.on('nueva tarea', tarea => {
    socket.to(tarea.proyecto).emit('tarea agregada', tarea)
  })

  socket.on('eliminar tarea', tarea => {
    socket.to(tarea.proyecto._id).emit('tarea eliminada', tarea)
  })

  socket.on('actualizar tarea', tarea => {
    socket.to(tarea.proyecto._id).emit('tarea actualizada', tarea)
  })

  socket.on('cambiar estado', tarea => {
    socket.to(tarea.proyecto._id).emit('nuevo estado', tarea)
  })
})