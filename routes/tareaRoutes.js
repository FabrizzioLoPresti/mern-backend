import express from 'express'
import {
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  changeState
} from '../controllers/tareaController.js'
import verifyToken from '../middlewares/checkAuthJWT.js'

const router = express.Router()

router.post('/', verifyToken, createTask)
router.route('/:id')
  .get(verifyToken, getTaskById)
  .put(verifyToken, updateTask)
  .delete(verifyToken, deleteTask)
router.post('/estado/:id', verifyToken, changeState)

export default router