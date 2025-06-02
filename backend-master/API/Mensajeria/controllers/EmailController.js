const EmailService = require("../services/emailService");
const ResponseModel = require("../../../Model/ResponseModel");

async function enviarCorreo(req, res) {
  let objResponse = new ResponseModel();
  try {
    const { to, subject, html } = req.body;
    const resultado = await EmailService.enviarCorreo({ to, subject, html });
    objResponse.data = resultado;
  } catch (error) {
    objResponse = new ResponseModel(error);
  }
  res.status(objResponse.status).jsonp(objResponse);
}

module.exports = {
  enviarCorreo
};