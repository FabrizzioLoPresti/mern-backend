import express from 'express'
import { 
  getUsuarios,
  createUser,
  authUser,
  confirmAccount,
  forgetPassword,
  checkToken,
  savePassword,
  getPerfil
} from '../controllers/usuarioController.js'
import verifyToken from '../middlewares/checkAuthJWT.js'

const router = express.Router()

// Autenticacion, Registro y Confirmacion de Usuarios
router.post('/', createUser)
router.post('/login', authUser)
router.get('/confirmar/:token', confirmAccount)
router.post('/forget-password', forgetPassword)
router.get('/forget-password/:token', checkToken)
router.post('/forget-password/:token', savePassword)
router.get('/perfil', verifyToken, getPerfil)

export default router