import mongoose from "mongoose"

const conectarDB = async () => {
  try {
    const url = process.env.MONGO_URI
    const conn = await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    const seeUrl = `${conn.connection.host}:${conn.connection.port}`
    console.log( `MongoDB Conectado en ${seeUrl}` )
  } catch (error) {
    console.log( `Error: ${error.message}` )
    process.exit(1)
  }
}

export default conectarDB