const config = require("../../../config/Config");
const Utilitys = require("../../../utils/Utilitys");
const ConnectionBD = require('../../../config/ConnectionPG');
const constante = require("../../../config/Constantes");
const ServiceParametro = require('../../Parametros/services/Service');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ResponseModel = require('../../../Model/ResponseModel');
const empresa = config.nombre;

const ClaveSecreta = config.tokenSecreto;
const TiempoSesion = config.tokenTimeSeccion;

async function Login(req) {
    let objResponse = new ResponseModel();
    let parametro = req.body;
    let correo = parametro.correo;
    let clave = parametro.clave;
    let direccion_ip = Utilitys.GetIpClient(req);
    try {
        let objResultUsuario = await ConnectionBD.knex('view_usuario_login')
            .select('*')
            .where('estado', 1)
            .where(builder => builder.andWhereRaw("correo = '" + correo + "'"))
            .orderBy('created_at', 'ASC')
            .limit(1);

        if (objResultUsuario.length == 0) {
            objResponse.message = 'El usuario ' + correo + ' no existe.';
            objResponse.status = 403;
        } else {
            objResultUsuario = objResultUsuario[0];
            let has = objResultUsuario.clave;
            if (!bcrypt.compareSync(clave, has)) {
                objResponse.message = 'La clave de acceso es incorrecta.';
                objResponse.status = 403;
            } else {
                var tokenData = { username: objResultUsuario.id };
                var token = jwt.sign(tokenData, ClaveSecreta, {
                    expiresIn: TiempoSesion,
                });
                // token = config.tokenStaticStatus ? config.tokenStatic : token;//AGREGAR TOKEN ESTATICOS PARA PRUEBAS 
                delete objResultUsuario['clave'];
                let ses = app.get('session') || [];
                objResultUsuario = await Utilitys.mapearUrlRoot(objResultUsuario);
                ses[token] = objResultUsuario;
                app.set('session', ses);
                objResponse.data = { token, usuario: objResultUsuario };
                objResponse.message = 'Bienvenido ' + objResultUsuario.nombre + ' ' + objResultUsuario.apellido + '.';
                objResponse.status = 200;
                sendEmailLogin(objResultUsuario, direccion_ip);
                Utilitys.CrearLog(objResultUsuario.id, 5, `{"desc":"${objResponse.message}"}`
                );
            }
        }
    } catch (error) {
        objResponse.status = 500;
        objResponse.message = error.message;
    }
    return objResponse;
}

async function UsuarioRegistrar(req) {
    let objResponse = new ResponseModel();
    let parametro = req.body;
    let nombres = parametro.nombres;
    let apellidos = parametro.apellidos;
    let dni = parametro.dni;
    let correo = parametro.correo;
    let telefono = parametro.telefono;
    let id_canton = parametro.id_canton;
    let id_rol = 3;
    let codigo = await Utilitys.GenerateKey(8);
    let clave_simple = parametro.clave || (await Utilitys.GenerateKey(8));
    let estado = '1';

    try {
        let clave = await Utilitys.hashPassword(clave_simple);
        let direccion_ip = Utilitys.GetIpClient(req);

        let objData = {
            codigo,
            nombres,
            apellidos,
            dni,
            correo,
            clave,
            telefono,
            id_rol,
            estado,
            id_canton
        };
        
        let objResultUsuario = await ConnectionBD.knex('usuario')
            .select('id')
            .where('correo', correo);
            
        if (objResultUsuario.length != 0) {
            objResponse.message = `El correo ${correo} ya existe.`;
        } else {
            objResultUsuario = await ConnectionBD.knex('usuario')
                .returning('*')
                .insert(objData);
                
            if (objResultUsuario.length != 0) {
                objResultUsuario = objResultUsuario[0];
                delete objResultUsuario['clave'];
                
                // Try to send email, but don't fail registration if email fails
                try {
                    await sendEmailRegister(objResultUsuario, direccion_ip, clave_simple);
                    objResponse.message = `Bienvenido sr@ ${objResultUsuario.nombres} ${objResultUsuario.apellidos}. Su clave fue enviada al email ${objResultUsuario.correo}.`;
                } catch (emailError) {
                    console.log('Email sending failed:', emailError);
                    objResponse.message = `Bienvenido sr@ ${objResultUsuario.nombres} ${objResultUsuario.apellidos}. Registro exitoso. Su clave es: ${clave_simple}. (Email no pudo ser enviado)`;
                }
                
                objResponse.status = 201;
                objResponse.data = objResultUsuario;
                Utilitys.CrearLog(objResultUsuario.id, 4, `{"desc":"${objResponse.message}"}`);
            }
        }
    } catch (error) {
        objResponse.status = 500;
        objResponse.message = error.message;
    }
    return objResponse;
}

async function UsuarioCambioClave(req) {

    let objResponse = new ResponseModel();
    let parametro = req.body;
    let clave_simple = parametro.clave;
    let codigo_verificacion = parametro.codigo_verificacion;
    try {

        let objDataParametro = await ServiceParametro.getDetalle({ id_parametro_cab: constante.idParametroAcesso, codigo: constante.tiempoExpiraCodigo });
        let tiempo_expira_codigo = objDataParametro.valor;

        let objResultCodigoVerifica = await ConnectionBD.knex('codigo_verificacion')
            .returning('*')
            .update({ estado: 0 })
            .where('valor', codigo_verificacion)
            .where('estado', 1);
        if (objResultCodigoVerifica.length != 0) {
            objResultCodigoVerifica = objResultCodigoVerifica[0];
            let id_usuario = objResultCodigoVerifica.id_usuario;
            let created_at = objResultCodigoVerifica.created_at; // validar tiempo limite de codigo 15 minutos
            let fecha_sistema = new Date();
            let minutos = await Utilitys.CalcularMinutosEntreFechas(
                created_at,
                fecha_sistema
            );
            if (minutos <= tiempo_expira_codigo) {
                let clave = await Utilitys.hashPassword(clave_simple);
                let direccion_ip = Utilitys.GetIpClient(req);

                let objData = { clave };
                let objResultUsuario = await ConnectionBD.knex('usuario')
                    .update(objData)
                    .returning('*')
                    .where('id', id_usuario);
                if (objResultUsuario.length == 0) {
                    objResponse.message = `No se puedo hacer el cambio de contraseña.`;
                } else {
                    objResponse.status = 201;
                    objResultUsuario = objResultUsuario[0];
                    delete objResultUsuario['clave'];
                    let identificador =
                        objResultUsuario.dni ||
                        objResultUsuario.nombre ||
                        objResultUsuario.codigo ||
                        objResultUsuario.id;
                    objResponse.message = `Cambio de contraseña de usuario con identificador ${identificador} realizado correctamente.`;
                    objResponse.data = objResultUsuario;
                    objResponse.auth = true; //volver a inicar session
                    sendEmailCambioClave(objResultUsuario, direccion_ip);
                    Utilitys.CrearLog(
                        objResultUsuario.id,
                        6,
                        `{"desc":"${objResponse.message}"}`
                    );
                }
            } else {
                objResponse.status = 403;
                objResponse.message = `El codigo de verificacion ha superados los ${tiempo_expira_codigo} minutos permitidos.`;
            }
        } else {
            objResponse.status = 403;
            objResponse.message = `El codigo de verificacion ingresado es incorrecto.`;
        }
    } catch (error) {
        objResponse.status = 500;
        objResponse.message = error.message;
    }
    return objResponse;
}

async function GenerarCodigoVerificacion(req) {

    let objResponse = new ResponseModel();
    let parametro = req.body;

    try {
        let objDataParametro = await ServiceParametro.getDetalle({ id_parametro_cab: constante.idParametroAcesso, codigo: constante.tiempoExpiraCodigo });
        let tiempo_expira_codigo = objDataParametro.valor;
        let codigo_veificacion = await Utilitys.GenerateKey(8);
        let correo = parametro.correo;

        let direccion_ip = Utilitys.GetIpClient(req);
        let objResultUsuario = await ConnectionBD.knex('usuario').select('*')
            .where('correo', correo);
        if (objResultUsuario.length == 0) {
            objResponse.message = `El correo ${correo} no existe en nuestro sistema.`;
        } else {
            objResultUsuario = objResultUsuario[0];

            let objDataCodVer = {
                id_usuario: objResultUsuario.id,
                valor: codigo_veificacion,
                estado: 1,
            };
            let objResultCodigoVerifica = await ConnectionBD.knex('codigo_verificacion')
                .returning('id')
                .insert(objDataCodVer);
            objResponse.status = 201;
            objResponse.message = `Ingrese el codigo verificación que hemos enviado al correo ${correo}.`;
            sendEmailCodigoVerificacion(objResultUsuario, direccion_ip, codigo_veificacion, tiempo_expira_codigo);
            Utilitys.CrearLog(objResultUsuario.id, 7, `{"desc":"${objResponse.message}"}`);
        }
    } catch (error) {
        objResponse.status = 500;
        objResponse.message = error.message;
    }
    return objResponse;
}

async function UsuarioActualizarDatos(req) {
    let objResponse = new ResponseModel();
    let parametro = req.body;
    let usuario = req.usuario;

    let foto_img = parametro.foto_img;
    let fondo_img = parametro.fondo_img;
    let nombres = parametro.nombres;
    let apellidos = parametro.apellidos;
    let dni = parametro.dni;
    let correo = parametro.correo;
    let fecha_nacimiento = parametro.fecha_nacimiento;
    let telefono = parametro.telefono;
    let direccion = parametro.direccion;
    let id_canton = parametro.id_canton;
    try {
        let direccion_ip = Utilitys.GetIpClient(req);
        let objData = {
            nombres,
            apellidos,
            dni,
            correo,
            fecha_nacimiento,
            telefono,
            direccion,
            id_canton
        };

        let objResultUsuario = await ConnectionBD.knex('usuario')
            .select('id')
            .where('correo', correo)
            .where('id', '!=', usuario.id);
        if (objResultUsuario.length != 0) {
            objResponse.message = `El email ${correo} ya existe, no puede ser utilizado por otro usuario.`;
        } else {

            if (foto_img) {
                objData.foto_img = await Utilitys.GuardarArchivoBase64(foto_img);
            }
            if (fondo_img) {
                objData.fondo_img = await Utilitys.GuardarArchivoBase64(fondo_img);
            }

            objResultUsuario = await ConnectionBD.knex('usuario')
                .update(objData)
                .returning('*')
                .where('id', usuario.id);
            if (objResultUsuario.length != 0) {
                objResponse.status = 201;
                objResultUsuario = objResultUsuario[0];
                delete objResultUsuario['clave'];
                let identificador =
                    objResultUsuario.codigo ||
                    objResultUsuario.dni ||
                    objResultUsuario.nombre ||
                    objResultUsuario.id;
                objResponse.message = `Datos de usuario con identificador ${identificador} actualizados correctamente.`;
                objResponse.data = objResultUsuario;
                objResponse.auth = true; //volver a inicar session
                sendEmailActualizacionDatos(objResultUsuario, direccion_ip);
                Utilitys.CrearLog(  objResultUsuario.id, 8,`{"desc":"${objResponse.message}"}`);
            }
        }
    } catch (error) {
        objResponse.status = 500;
        objResponse.message = error.message;
    }
    return objResponse;
}

async function UsuarioMostrarLog(req) {

    let objResponse = new ResponseModel();
    let usuario = req.usuario;

    try {

        let objDataParametro = await ServiceParametro.getDetalle({ id_parametro_cab: constante.idParametroLog, codigo: constante.visualizacionUltimosDias });
        let ultimo_dias = objDataParametro.valor;
        let fecha = new Date();
        fecha = await Utilitys.ModificarDias(fecha, -ultimo_dias);
        let direccion_ip = Utilitys.GetIpClient(req);
        let select = ['icono', 'nombre', 'esquema', 'codigo', 'descripcion', 'fecha'];

        let data_log = await ConnectionBD.knex('view_log_detalle')
            .select('*')
            .where('estado', 1)
            .where('id_usuario', usuario.id)
            .where('fecha', '>=', fecha)
            .orderBy('fecha', 'DESC')
            .limit(1000);

        if (data_log.length == 0) {
            objResponse.message =
                'El no se encontraron actividades recientes del usuario en el sistema.';
            objResponse.status = 403;
        } else {
            data_log.forEach(el => {
                let json = JSON.parse(el.valor || '{}');
                for (var key in json) {
                    el.esquema = el.esquema.replace(`{${key}}`, json[key]);
                }
                delete json['valor'];
                delete json['estado'];
            });

            let log_detalle = data_log;
            objResponse.data = { log_detalle };
            let template = 'El usuario contiene [cant] actividades desde la fecha [desde].';
            template = Utilitys.replaceText(template, '[cant]', log_detalle.length);
            template = Utilitys.replaceText(template, '[desde]', fecha);
            objResponse.message = template;
            objResponse.status = 200;
        }
    } catch (error) {
        objResponse.status = 500;
        objResponse.message = error.message;
    }
    return objResponse;
}

async function sendEmailRegister(objUsuario, direccion_ip, clave) {
    let cliente = objUsuario.nombres + ' ' + objUsuario.apellidos;
    let correos = [objUsuario.correo];
    let fecha_sistema = new Date();
    let asunto = 'Bienvenidos a ' + empresa;

    let html = `
    <tr>
        <td style="font-size:22px; line-height:100%; font-weight:normal; color:#333; padding-bottom:0px; padding-top:18px; text-align:center">
            Estimad@ ${cliente}
        </td>
    </tr>
    <tr>
        <td style="font-size:14px!important; padding-bottom:20px; padding-top:10px; text-align:center; max-width:500px!important">
            <blockquote>
            <p>Bienvenido a ${empresa} ingrese con la siguiente clave de acceso.</p>
            <br>
            <h2><small>Clave de Acceso</small></h2>
            <h1><small><cite title="${clave}">${clave}</cite></small></h1>
            <br>
            <small>Fecha de Registro: <cite title="${fecha_sistema}">${fecha_sistema}</cite></small>
            <br>
            <small>Dirección IP: <cite title="${direccion_ip}">${direccion_ip}</cite></small>    
            <br>  
            </blockquote>
        </td>
    </tr>
    `;

    Utilitys.SendEmailGeneral(correos, asunto, html);
}

async function sendEmailLogin(objUsuario, direccion_ip) {
    let cliente = objUsuario.nombres + ' ' + objUsuario.apellidos;
    let correos = [objUsuario.correo];
    let fecha_sistema = new Date();
    let asunto = 'Inicio de sesión ' + empresa;

    let html = `
    <tr>
        <td style="font-size:22px; line-height:100%; font-weight:normal; color:#333; padding-bottom:0px; padding-top:18px; text-align:center">
            Estimad@ ${cliente}
        </td>
    </tr>
    <tr>
        <td style="font-size:14px!important; padding-bottom:20px; padding-top:10px; text-align:center; max-width:500px!important">
          <blockquote>
            <p>Se ha realizado un inicio de sesion con sus crenciales.</p>
            <br>
            <small>Fecha de Ingreso: <cite title="${fecha_sistema}">${fecha_sistema}</cite></small>
            <br>
            <small>Dirección IP: <cite title="${direccion_ip}">${direccion_ip}</cite></small>    
            <br>
          </blockquote>
        </td>
    </tr>
    `;

    Utilitys.SendEmailGeneral(correos, asunto, html);
}

async function sendEmailCambioClave(objUsuario, direccion_ip) {
    let cliente = objUsuario.nombres + ' ' + objUsuario.apellidos;
    let correos = [objUsuario.correo];
    let fecha_sistema = new Date();
    let asunto = 'Cambio de clave exito';

    let html = ` 
    <tr>
        <td style="font-size:22px; line-height:100%; font-weight:normal; color:#333; padding-bottom:0px; padding-top:18px; text-align:center">
            Estimad @ ${cliente}
        </td>
    </tr>
    <tr>
        <td style="font-size:14px!important; padding-bottom:20px; padding-top:10px; text-align:center; max-width:500px!important">
            <blockquote>
                <p> Se ha realizado el cambio de contraseña. </p>
                <br>
                <small> Fecha de Cambio:
                    <cite title="${fecha_sistema}"> ${fecha_sistema} </cite>
                </small>
                <br>
                <small> Dirección IP:
                    <cite title="${direccion_ip}"> ${direccion_ip} </cite>
                </small>
                <br>
            </blockquote>
        </td>
    </tr>
    `;

    Utilitys.SendEmailGeneral(correos, asunto, html);
}

async function sendEmailCodigoVerificacion(objUsuario, direccion_ip, codigo_verificacion, tiempo_expira_codigo) {
    let cliente = objUsuario.nombres + ' ' + objUsuario.apellidos;
    let correos = [objUsuario.correo];
    let asunto = 'Codigo de verificación';
    let fecha_sistema = new Date();

    let html = ` 
        <tr>
            <td style="font-size:22px; line-height:100%; font-weight:normal; color:#333; padding-bottom:0px; padding-top:18px; text-align:center">
                Estimad @ ${cliente}
            </td>
        </tr>
        <tr>
            <td style="font-size:14px!important; padding-bottom:20px; padding-top:10px; text-align:center; max-width:500px!important">
                <blockquote>
                    <p> Se ha realizado una solicitud de cambio de contraseña.
                    </p>
                    <br>
                    <h2>
                        <small> Codigo Verificación
                        </small>
                    </h2>
                    <h1>
                        <small>
                            <cite title="${codigo_verificacion}"> ${codigo_verificacion}
                            </cite>
                        </small>
                    </h1>
                    <br>
                    <h6>
                        <small> Este codigo expira en ${tiempo_expira_codigo} minutos
                        </small>
                    </h6>
                    <br>
                    <br>
                    <small> Fecha de Solicitud:
                        <cite title="${fecha_sistema}">
                            ${fecha_sistema}
                        </cite>
                    </small>
                    <br>
                    <small>
                        Dirección IP:
                        <cite title="${direccion_ip}">
                            ${direccion_ip}
                        </cite>
                    </small>
                    <br>
                </blockquote>
            </td>
        </tr>
    `;

    Utilitys.SendEmailGeneral(correos, asunto, html);
}

async function sendEmailActualizacionDatos(objUsuario, direccion_ip) {
    let cliente = objUsuario.nombres + ' ' + objUsuario.apellidos;
    let correos = [objUsuario.correo];
    let fecha_sistema = new Date();
    let asunto = 'Actualizacion de datos exito';

    let html = ` 
    <tr>
        <td style="font-size:22px; line-height:100%; font-weight:normal; color:#333; padding-bottom:0px; padding-top:18px; text-align:center">
            Estimad @ ${cliente}
        </td>
    </tr>
    <tr>
        <td style="font-size:14px!important; padding-bottom:20px; padding-top:10px; text-align:center; max-width:500px!important">
            <blockquote>
                <p> Se ha realizado la actualizacion de datos de manera correcta.
                </p>
                <br>
                <small> Fecha de Cambio:
                    <cite title="${fecha_sistema}"> ${fecha_sistema} </cite>
                </small>
                <br>
                <small> Dirección IP:
                    <cite title="${direccion_ip}"> ${direccion_ip} </cite>
                </small>
                <br>
            </blockquote>
        </td>
    </tr>
    `;

    Utilitys.SendEmailGeneral(correos, asunto, html);
}



module.exports = {
    Login,
    UsuarioRegistrar,
    UsuarioCambioClave,
    UsuarioActualizarDatos,
    UsuarioMostrarLog,
    GenerarCodigoVerificacion,
};