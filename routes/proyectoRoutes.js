import express from 'express'
import {
  getProyectos,
  getProyectoById,
  createProyecto,
  updateProyecto,
  deleteProyecto,
  buscarColaborador,
  addColaborador,
  deleteColaborador,
} from '../controllers/proyectoController.js'
import verifyToken from '../middlewares/checkAuthJWT.js'

const router = express.Router()

router.get('/', verifyToken, getProyectos)
router.get('/:id', verifyToken, getProyectoById)
router.post('/', verifyToken, createProyecto)
router.put('/:id', verifyToken, updateProyecto)
router.delete('/:id', verifyToken, deleteProyecto)
router.post('/colaboradores', verifyToken, buscarColaborador)
router.post('/colaboradores/:id', verifyToken, addColaborador) // :id -> ID del proyecto
router.post('/eliminar-colaborador/:id', verifyToken, deleteColaborador) // :id -> ID del proyecto

export default router