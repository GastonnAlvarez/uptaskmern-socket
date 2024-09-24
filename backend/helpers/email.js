import nodemailer from 'nodemailer'

export const emailRegistro = async (datos) => {
    const { email, nombre, token } = datos

    let transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

    const info = await transport.sendMail({
        from:"Cuentas Administrador de Proyectos - UpTask",
        to:email,
        subject:"UpTaks - Comprueba tu cuenta",
        text:"Comprueba tu cuenta en UpTask",
        html:`
            <p>Hola ${nombre}, comprueba tu cuenta con el siguiente enlace</p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>
        `
    })
}

export const emailOlvidePassword = async (datos) => {
  const { email, nombre, token } = datos

  let transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

  const info = await transport.sendMail({
      from:"Cuentas Administrador de Proyectos - UpTask",
      to:email,
      subject:"UpTaks - Olvide Password",
      text:"Presiona el enlace para restablecer tu password",
      html:`
          <p>Hola ${nombre},  restablece el password con el siguiente link</p>
          <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer</a>
      `
  })
}