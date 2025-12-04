const nodemailer = require('nodemailer');

// Configurar el transporter (usa Gmail, SendGrid, etc.)
const transporter = nodemailer.createTransporter({
  service: 'gmail', // o tu proveedor
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Alternativa con SendGrid (recomendado)
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailController {
  async sendEmail(req, res) {
    try {
      const { to, subject, html, template } = req.body;

      // Opción con Nodemailer
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html
      };

      await transporter.sendMail(mailOptions);

      // O con SendGrid (descomenta si usas SendGrid)
      // await sgMail.send({
      //   to,
      //   from: process.env.EMAIL_FROM,
      //   subject,
      //   html
      // });

      res.json({ success: true, message: 'Correo enviado exitosamente' });
    } catch (error) {
      console.error('Error enviando email:', error);
      res.status(500).json({ success: false, error: 'Error enviando correo' });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      // Buscar usuario en tu base de datos
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({ success: true, message: 'Si el email existe, se enviará la contraseña' });
      }

      // Plantilla de recuperación
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; background: white; padding: 30px; border-radius: 10px; }
            .header { background: #8557FB; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 20px; }
            .password { background: #f8f9fa; padding: 15px; border-radius: 5px; font-size: 18px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Recuperación de Contraseña</h1>
            </div>
            <div class="content">
              <p>Hola,</p>
              <p>Has solicitado recuperar tu contraseña para el usuario: <strong>${user.username}</strong></p>
              <div class="password">
                Tu contraseña es: <strong>${user.password}</strong>
              </div>
              <p>Te recomendamos cambiar esta contraseña después de iniciar sesión.</p>
              <br>
              <p>Saludos,<br>Equipo de Sistema de Inventario</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Recuperación de contraseña - Sistema de Inventario',
        html
      });

      res.json({ success: true, message: 'Correo enviado exitosamente' });
    } catch (error) {
      console.error('Error en recuperación:', error);
      res.json({ success: true, message: 'Si el email existe, se enviará la contraseña' });
    }
  }
}

module.exports = new EmailController();