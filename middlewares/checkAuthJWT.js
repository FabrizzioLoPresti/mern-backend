import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']
  if(!token) return res.status(400).json({msg: 'Token no valido'})

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { id, iat, exp } = decoded

    const usuario = await Usuario.findById(id).select('-password -confirmado -token -createdAt -updatedAt -__v')
    if(!usuario) return res.status(400).json({msg: 'Usuario no encontrado'})
    
    req.usuario = usuario
    return next()
  } catch (error) {
    console.log( error )
    return res.status(400).json({msg: 'Error al obtener token'})
  }
}

export default verifyToken