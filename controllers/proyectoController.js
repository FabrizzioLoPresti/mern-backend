import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js"
import Usuario from "../models/Usuario.js"

const getProyectos = async (req, res) => {
  const { _id } = req.usuario
  
  try {
    // const proyectos = await Proyecto.find().where('creador').equals(req.usuario)
    const proyectos = await Proyecto.find({
      '$or': [
        {creador: _id},
        {colaboradores: { $in: _id }}
      ]
    }).select('-tareas')
    res.status(200).json({proyectos})
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al cargar los proyectos'})
  }
}

const getProyectoById = async (req, res) => {
  const { id } = req.params

  try {
    const proyecto = await Proyecto.findById(id)
      // .populate('tareas')
      .populate({path: 'tareas', populate: {path: 'completado', select: 'nombre'}})
      .populate('colaboradores', '_id nombre email')
    
    if(!proyecto) return res.status(404).json({msg: 'Proyecto no encontrado'})
    if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) 
      return res.status(401).json({msg: 'No tienes los permisos'})

    const tareas = await Tarea.find().where('proyecto').equals(id) // Si no tenemos Tareas en el Schema de Proyecto
    const colaboradores = await Usuario.find().where('_id').in(proyecto.colaboradores) // Si no tenemos Colaboradores en el Schema de Proyecto
    const respuesta = {
      ...proyecto._doc,
      tareas,
      colaboradores
    }
    res.status(200).json(proyecto)
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al cargar proyecto'})
  }
}

const createProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body)
  proyecto.creador = req.usuario._id
  
  try {
    const data = await proyecto.save()
    res.status(200).json({data, msg: 'Proyecto creado correctamente'})
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al crear un nuevo proyecto'})
  }
}

const updateProyecto = async (req, res) => {

  const { id } = req.params

  try {
    const proyecto = await Proyecto.findById(id)
    
    if(!proyecto) return res.status(404).json({msg: 'Proyecto no encontrado'})
    if(proyecto.creador.toString() !== req.usuario._id.toString()) return res.status(401).json({msg: 'No tienes los permisos'})

    proyecto.nombre = req.body.nombre ?? proyecto.nombre
    proyecto.descripcion = req.body.descripcion ?? proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega ?? proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente ?? proyecto.cliente

    const proyectoAlmacenado = await proyecto.save()
    res.status(200).json(proyectoAlmacenado)
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al cargar proyecto'})
  }
}

const deleteProyecto = async (req, res) => {
  const { id } = req.params

  try {
    const proyecto = await Proyecto.findById(id)
    
    if(!proyecto) return res.status(404).json({msg: 'Proyecto no encontrado'})
    if(proyecto.creador.toString() !== req.usuario._id.toString()) return res.status(401).json({msg: 'No tienes los permisos'})

    await proyecto.deleteOne()
    res.status(200).json({msg: 'Proyecto eliminado correctamente'})
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al cargar proyecto'})
  }
}

const buscarColaborador = async (req, res) => {
  const { email } = req.body

  try {
    const usuario = await Usuario.findOne({email}).select('_id nombre email')
    if(!usuario) return res.status(404).json({msg: 'Usuario no encontrado'})

    res.status(200).json(usuario)
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al buscar colaborador'})
  }
}

const addColaborador = async (req, res) => {
  const { id } = req.params
  const { email } = req.body
  try {
    const proyecto = await Proyecto.findById(id)
    if(!proyecto) return res.status(404).json({msg: 'Proyecto no encontrado'})

    if(proyecto.creador.toString() !== req.usuario._id.toString()) return res.status(401).json({msg: 'Accion no valida'})

    const usuario = await Usuario.findOne({email}).select('_id nombre email')
    if(!usuario) return res.status(404).json({msg: 'Usuario no encontrado'})

    if(proyecto.creador.toString() === usuario._id.toString()) return res.status(401).json({msg: 'El creador del Proyecto no puede ser colaborador'})

    if(proyecto.colaboradores.includes(usuario._id)) return res.status(404).json({msg: 'El Usuario ya pertenece al Proyecto'})

    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()
    res.status(200).json({msg: 'Colaborador agregado correctamente'})
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al agregar colaborador'})
  }
}

const deleteColaborador = async (req, res) => {
  const { id } = req.params // id del Proyecto
  try {
    const proyecto = await Proyecto.findById(id)
    if(!proyecto) return res.status(404).json({msg: 'Proyecto no encontrado'})

    if(proyecto.creador.toString() !== req.usuario._id.toString()) return res.status(401).json({msg: 'Accion no valida'})

    proyecto.colaboradores.pull(req.body.id) // id del Colaborador
    await proyecto.save()
    res.status(200).json({msg: 'Colaborador eliminado correctamente'})
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al eliminar colaborador'})
  }
}

const getTasks = async (req, res) => {
  const { id } = req.params

  try {
    const proyecto = await Proyecto.findById(id)

    if(!proyecto) return res.status(404).json({msg: 'Proyecto no encontrado'})
    if(proyecto.creador.toString() !== req.usuario._id.toString()) return res.status(401).json({msg: 'No tienes los permisos'})

    const tareas = await Tarea.find().where('proyecto').equals(id)
    res.status(200).json(tareas)
  } catch (error) {
    console.log( error )
    res.status(400).json({msg: 'Error al cargar tareas del proyecto'})
  }
}

export {
  getProyectos,
  getProyectoById,
  createProyecto,
  updateProyecto,
  deleteProyecto,
  buscarColaborador,
  addColaborador,
  deleteColaborador,
}