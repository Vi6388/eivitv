var nodemailer = require('nodemailer');
const { google } = require("googleapis");
const constante = require("../config/Constantes");
const ServiceParametro = require('./../API/Parametros/services/Service');
const OAuth2 = google.auth.OAuth2;

const mail_rover = async (dataEmail, callback) => {

  const oauth2Client = new OAuth2(dataEmail.clientId, dataEmail.clientSecret, dataEmail.api);
  oauth2Client.setCredentials({ refresh_token: dataEmail.refreshToken, tls: { rejectUnauthorized: true } });
  oauth2Client.getAccessToken((err, token) => {
    if (err) return console.log(err);
    dataEmail.refreshToken = token;

    let accountTransport = {
      "service": dataEmail.service,
      "api": dataEmail.api,
      "auth": {
        "type": dataEmail.type,
        "user": dataEmail.email,
        "clientId": dataEmail.clientId,
        "clientSecret": dataEmail.clientSecret,
        "refreshToken": dataEmail.refreshToken
      }
    }

    callback(nodemailer.createTransport(accountTransport));
  });
};

async function EnviarEmail(data) {

  let obj = { status: 403, msj: "Operación incorrecta." };
  let id_parametro_cab = constante.idParametroEmail;
  
  try {
    let objDataParametro1 = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: constante.status });
    let status = objDataParametro1.valor;
    
    if (status == constante.statusActivo) {
      let objDataParametro2 = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: constante.email });
      let objDataParametro3 = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: constante.clientId });
      let objDataParametro4 = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: constante.clientSecret });
      let objDataParametro5 = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: constante.refreshToken });

      let email = objDataParametro2.valor;
      let clientId = objDataParametro3.valor;
      let clientSecret = objDataParametro4.valor;
      let refreshToken = objDataParametro5.valor;
      
      // Validate email configuration
      if (!email || !clientId || !clientSecret || !refreshToken) {
        throw new Error('Email configuration incomplete. Please check email parameters.');
      }
      
      let api = constante.authEmail.api;
      let service = constante.authEmail.service;
      let type = constante.authEmail.type;

      let dataEmail = { api, service, type, email, clientId, clientSecret, refreshToken };

      let asunto = data.asunto;
      console.log("Enviando correo => " + asunto);
      let para = data.para || [];
      let texto = data.texto;
      let html = data.html;
      let attachments = data.attachments;
      
      var mailOptions = {
        from: email,
        to: para,
        subject: asunto,
        text: texto,
        html: html,
        attachments,
      };

      return new Promise((resolve, reject) => {
        mail_rover(dataEmail, async function (transporter) {
          transporter.sendMail(mailOptions, async function (error, response) {
            if (error) {
              obj.status = 403;
              obj.msj = error.message;
              obj.data = error;
              console.log("Error enviando correo => " + obj.msj);
              console.log(obj);
              reject(obj);
            } else {
              obj.status = 200;
              obj.msj = "Correo enviado exitosamente!!";
              obj.data = response;
              console.log("Envio de correo => " + obj.msj);
              resolve(obj);
            }
          });
        });
      });
    } else {
      throw new Error("Servicio de correo desactivado: " + status);
    }
  } catch (error) {
    obj.status = 500;
    obj.msj = "Error en configuración de email: " + error.message;
    obj.data = error;
    console.log("Error email service => " + obj.msj);
    throw obj;
  }
}

async function FormatoEstandarHTML(params) {
  const {
    empresa,
    content,
    link_backend,
    link_facebook,
    link_frontend,
    logo_estandar,
    logo_facebook } = params;


  let HTML = ` 
 <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#f1f1f1">
  <tbody>
    <tr>
      <td align="center" valign="top" class="x_toppadding" style="padding:22px 0 40px 0">
        <table width="600" border="0" align="center" cellpadding="0" cellspacing="0" class="x_main">
          <tbody>
            <tr>
              <td height="5" style="background-color:#F8963C"></td>
            </tr>
            <tr>
              <td align="left" valign="top">
                <table width="600" border="0" align="center" cellpadding="0" cellspacing="0"
                  class="x_main" style="width:100%!important">
                  <tbody>
                    <tr>
                      <td align="center" valign="middle" bgcolor="#ffffff"
                        style="padding:10px 25px 10px 20px">
                        <table border="0" align="left" cellpadding="0" cellspacing="0"
                          width="100%">
                          <tbody>
                            <tr>
                              <td align="center" valign="top">
                                  <a href="${link_frontend}"
                                  target="_blank">
                                    <img style= "display:block; margin:0px auto;width: 550;height: 100px;"
                                    data-imagetype="External"
                                    src="${logo_estandar}"
                                    alt="${empresa}" title="${empresa}"
                                    style="margin:0px auto;"
                                    class="CToWUd">
                                </a>

                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table border="0" align="right" cellpadding="0" cellspacing="0"
                          style="padding:20px 0 0 0">
                          <tbody>
                            <tr>
                              <td align="right"></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" valign="top"
                                                  style="border-bottom:1px solid #ececec!important">
                        <img data-imagetype="External"
                          src="https://static.locanto.com.ec/images/border.png" border="0"
                          class="x_border-img" width="600" height="17" alt=""
                          style="display:block; width:100%!important; height:1px">
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table width="600" border="0" align="center" cellpadding="0" cellspacing="0"
                  class="x_main">
                  <tbody>
                    <tr>
                      <td align="left" valign="top" style="background:#ffffff; padding:0px">
                        <table class="x_sidepadding" border="0" align="center"
                          cellpadding="0" cellspacing="0"
                          style="background-color:#FFFFFF; border-bottom:1px solid #eeeeee; border-top:5px solid #fbfbfb; width:100%">
                          <tbody>
                            <tr>
                              <td>
                                <table cellpadding="0" cellspacing="0"
                                  align="center">
                                  <tbody> 
                                   ${content}                                   
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table class="x_sidepadding" border="0" align="center"
                          cellpadding="0" cellspacing="0"
                          style="background-color:#325884; border-bottom:1px solid #cccccc; width:100%; min-width:325px; color:#fff; padding-bottom:20px">
                          <tbody>
                            <tr>
                              <td align="center"
                                style="font-size:14px; padding-top:26px; padding-left:10px; padding-right:10px">
                                Para mas información ingrese a nuestro portal aquí:
                              </td>
                            </tr>
                            <tr>
                              <td align="center">
                                <table align="center" width="200"
                                  style="border-bottom:3px solid #1d326f; border-right:3px solid #1d326f; width:272px; background-color:#fff; border-radius:10px; margin-top:20px; margin-bottom:10px; width:auto">
                                  <tbody>
                                    <tr>
                                      <td align="center"
                                        style="padding:5px 10px">
                                        <a href="${link_frontend}"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          data-auth="NotApplicable"
                                          style="text-decoration:none; color:#325884; font-weight:bold; font-size:16px">PORTAL AQUÍ</a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table> 
                      </td>
                    </tr>                    
                    <tr>
                      <td align="center" valign="top" style="background:#ffffff">
                        <table width="100%" border="0" align="center" cellpadding="0"
                          cellspacing="0" class="x_main" style="width:100%!important">
                          <tbody>
                            <tr>
                              <td
                                style="padding:20px;color:#8b8b8b;text-align:center">
                                <a href="${link_facebook}"
                                  target="_blank">
                                                                      <img style= "display:block; margin:0px auto;width: 550;height: 100px;"
                                                                      data-imagetype="External" src= "${logo_facebook}"
                                                                      alt="Facebook" title="Facebook"
                                    style="width: 200px;margin:0px auto;"
                                    class="CToWUd">
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td align="center" valign="top"
                                style="color:#777; background:#fff; padding:10px 8px 10px 13px">
                                No respondas a este
                                correo, ya que no se
                                encuentra habilitado
                                para recibir mensajes.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table width="100%" border="0" align="center" cellpadding="0"
                          cellspacing="0">
                          <tbody>
                            <tr>
                              <td align="center" valign="top"
                                style="font-size:11px; color:#777!important">
                                Copyright © 2022  "${empresa}™. Todos los derechos reservados.
                              </td>
                            </tr>
                          </tbody>
                        </table>

                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table> 
`;
  return HTML;
}

module.exports = {
  EnviarEmail,
  FormatoEstandarHTML,
};