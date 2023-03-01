import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js"
import generarJWT from "../helpers/generarJWT.js"
import { emailRegistro, emailForgetPassword } from "../helpers/email.js"

const getUsuarios = (req, res) => {
  res.json({msg: 'Ok'})
}

const createUser = async (req, res) => {
  const { email } = req.body

  try {
    const existeUsuario = await Usuario.findOne({ email })
    if(existeUsuario) return res.status(400).json({msg: 'Usuario ya existente'})

    const usuario = new Usuario(req.body)
    usuario.token = generarId()
    const data = await usuario.save()
    emailRegistro({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token
    })
    res.status(200).json({data, msg: 'Usuario Creado Correctamente'})
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al Crear Usuario'})
  }
}

const authUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const usuario = await Usuario.findOne({ email })
    if(!usuario) return res.status(400).json({msg: 'Usuario no existe'})
    
    if(!usuario.confirmado) return res.status(403).json({msg: 'Tu cuenta no ha sido confirmada'})

    if(!await usuario.matchPassword(password)) return res.status(400).json({msg: 'El Password es Incorrecto'})
  
    return res.status(200).json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id)
    })
  } catch (error) {
    res.status(400).json({msg: 'Error al Autenticar Usuario'})
  }
}

const confirmAccount = async (req, res) => {
  const { token } = req.params
  
  try {
    const usuarioConfirmar = await Usuario.findOne({token})
    if(!usuarioConfirmar) return res.status(400).json({msg: 'Token no valido'})

    usuarioConfirmar.confirmado = true
    usuarioConfirmar.token = ''
    await usuarioConfirmar.save()
    res.status(200).json({msg: 'Usuario Confirmado Correctamente'})
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al Confirmar Cuenta'})
  }
}

const forgetPassword = async (req, res) => {
  const { email } = req.body

  try {
    const usuario = await Usuario.findOne({ email })
    if(!usuario) return res.status(400).json({msg: 'Usuario no existe'})

    if(!usuario.confirmado) return res.status(400).json({msg: 'La cuenta no esta confirmada'})

    usuario.token = generarId()
    await usuario.save()

    emailForgetPassword({
      email: usuario.email,
      nombre: usuario.nombre,
      token: usuario.token
    })

    res.status(200).json({msg: 'Hemos enviado un correo con las instrucciones'})
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al recuperar password'})
  }
}

const checkToken = async (req, res) => {
  const { token } = req.params

  try {
    const tokenValido = await Usuario.findOne({token})
    if(!tokenValido) return res.status(400).json({msg: 'Token no valido'})
    res.status(200).json({msg: 'Token Valido'})
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al chequear token'})
  }
}

const savePassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  try {
    const usuario = await Usuario.findOne({token})
    if(!usuario) return res.status(400).json({msg: 'Token no valido'})

    usuario.password = password
    usuario.token = ''
    await usuario.save()
    res.status(200).json({msg: 'Password actualizado correctamente'})
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al guardar nuevo password'})
  }
}

const getPerfil = async (req, res) => {
  const { usuario } = req
  res.status(200).json(usuario)
}

export {
  getUsuarios,
  createUser,
  authUser,
  confirmAccount,
  forgetPassword,
  checkToken,
  savePassword,
  getPerfil
}