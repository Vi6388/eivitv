const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Enviar un correo electrónico.
 * @param {Object} options - Opciones del correo.
 * @param {string} options.to - Destinatario.
 * @param {string} options.subject - Asunto.
 * @param {string} options.html - Contenido HTML.
 * @returns {Promise<string>} - Resultado.
 */
async function enviarCorreo({ to, subject, html }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  return `Correo enviado: ${info.messageId}`;
}

module.exports = {
  enviarCorreo
};