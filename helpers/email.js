import nodemailer from 'nodemailer'

const emailRegistro = async datos => {
  const { nombre, email, token } = datos

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const info = await transport.sendMail({
    from: '"Uptaks - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: 'Uptask - Confirmar tu cuenta',
    text: 'Comprueba tu cuenta de Uptask y comienza a crear Proyectos',
    html: `
      <h1>Uptask - Confirmar tu cuenta</h1>
      <p>Hola ${nombre},</p>
      <p>Para confirmar tu cuenta de Uptask, haz click en el siguiente enlace:</p>
      <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a>
      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje.</p>
    `
  })
}

const emailForgetPassword = async datos => {
  const { nombre, email, token } = datos

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const info = await transport.sendMail({
    from: '"Uptaks - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: 'Uptask - Restablece tu password',
    text: 'Restablece tu password',
    html: `
      <h1>Uptask - Restablece tu password</h1>
      <p>Hola ${nombre}, has solicitado restablecer tu password</p>
      <p>Para restablecer tu password de Uptask, haz click en el siguiente enlace:</p>
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer</a>
      <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje.</p>
    `
  })
}

export {
  emailRegistro,
  emailForgetPassword
}