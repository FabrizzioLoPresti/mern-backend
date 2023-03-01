import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js"

const getTaskById = async (req, res) => {
  const { id } = req.params

  try {
    const tarea = await Tarea.findById(id).populate('proyecto')
    if(!tarea) return res.status(404).json({msg: 'Tarea no encontrada'})
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) return res.status(401).json({msg: 'No tienes los permisos'}) 
 
    res.status(200).json(tarea)
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al obtener tarea'})
  }
}

const createTask = async (req, res) => {
  const { proyecto: idProyecto } = req.body
  // const tarea = new Tarea(req.body)

  try {
    const proyecto = await Proyecto.findById(idProyecto)
    if(!proyecto) return res.status(404).json({msg: 'No existe el proyecto'})
    if(proyecto.creador.toString() !== req.usuario._id.toString()) return res.status(401).json({msg: 'No tienes los permisos'}) 

    // const data = await tarea.save()
    const data = await Tarea.create(req.body)
    proyecto.tareas.push(data._id) // Spread Operator
    await proyecto.save()
    res.status(200).json(data)
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al crear tarea'})
  }
}

const updateTask = async (req, res) => {
  const { id } = req.params

  try {
    const tarea = await Tarea.findById(id).populate('proyecto')
    if(!tarea) return res.status(404).json({msg: 'Tarea no encontrada'})
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) return res.status(401).json({msg: 'No tienes los permisos'}) 
 
    tarea.nombre = req.body.nombre ?? tarea.nombre
    tarea.descripcion = req.body.descripcion ?? tarea.descripcion
    tarea.prioridad = req.body.prioridad ?? tarea.prioridad
    tarea.fechaEntrega = req.body.fechaEntrega ?? tarea.fechaEntrega

    const data = await tarea.save()
    res.status(200).json(data)
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al actualizar tarea'})
  }
}

const deleteTask = async (req, res) => {
  const { id } = req.params

  try {
    const tarea = await Tarea.findById(id).populate('proyecto')
    if(!tarea) return res.status(404).json({msg: 'Tarea no encontrada'})
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) return res.status(401).json({msg: 'No tienes los permisos'}) 
 
    const proyecto = await Proyecto.findById(tarea.proyecto._id)
    proyecto.tareas.pull(tarea._id)
    await proyecto.save()
    const data = await tarea.deleteOne()
    // await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])
    res.status(200).json({data, msg: 'Tarea eliminada correctamente'})
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al eliminar tarea'})
  } 
}

const changeState = async (req, res) => {
  const { id } = req.params

  try {
    const tarea = await Tarea.findById(id).populate('proyecto')
    if(!tarea) return res.status(404).json({msg: 'Tarea no encontrada'})
    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) 
      return res.status(401).json({msg: 'No tienes los permisos'})
 
    tarea.estado = req.body.estado ?? !tarea.estado
    tarea.completado = req.usuario._id
    const data = await tarea.save()

    const tareaAlmacenada = await Tarea.findById(id).populate('proyecto').populate('completado')
    res.status(200).json(tareaAlmacenada)
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al eliminar tarea'})
  } 
}

export {
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  changeState
}