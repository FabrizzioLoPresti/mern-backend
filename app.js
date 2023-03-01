import express from 'express'
import cors from "cors"
import dotenv from 'dotenv'
import conectarDB from './config/db.js'

import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'

const app = express()
dotenv.config()

const whiteList = [
  process.env.FRONTEND_URL
]
const corsOptions = {
  origin: function(origin, callback) {
    if(whiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Error de Cors'))
    }
  }
}

app.use(cors(corsOptions))
app.use(express.json())
conectarDB()

app.get('/', (req, res) => {
  res.json( {msg: 'Ok'} )
})

// Routing
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)

export default app