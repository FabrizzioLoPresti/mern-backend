import mongoose from "mongoose"
import bcrypt from 'bcrypt'

const usuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  token: {
    type: String
  },
  confirmado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

usuarioSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next() // Si el password no ha sido modificado, no se ejecuta el siguiente código, si estamos Editando el Password si se ejecuta el resto del Codigo
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt) // this hace referencia al Objeto de usuario.save() del Controller que se pasa al Modelo previniendo el save() para Encriptar Password
})

usuarioSchema.methods.matchPassword = async function(passwordFormulario) {
  return await bcrypt.compare(passwordFormulario, this.password)
}

const Usuario = mongoose.model('Usuario', usuarioSchema)
export default Usuario