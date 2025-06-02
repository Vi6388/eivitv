const Service = require('../services/Service');


const ResponseModel = require('../../../Model/ResponseModel'); 

const config = require("../../../config/Config");
const Utilitys = require("../../../utils/Utilitys");
const jwt = require('jsonwebtoken');
const ClaveSecreta = config.tokenSecreto;


async function Login(req, res, next) {
    let objResponse = await Service.Login(req);
    res.status(objResponse.status).jsonp(objResponse);
}

async function UsuarioRegistrar(req, res, next) {
    let objResponse = await Service.UsuarioRegistrar(req);
    res.status(objResponse.status).jsonp(objResponse);
}

async function UsuarioCambioClave(req, res, next) {
    let objResponse = await Service.UsuarioCambioClave(req);
    res.status(objResponse.status).jsonp(objResponse);
}

async function GenerarCodigoVerificacion(req, res, next) {
    let objResponse = await Service.GenerarCodigoVerificacion(req);
    res.status(objResponse.status).jsonp(objResponse);
}

async function UsuarioActualizarDatos(req, res, next) {
    let objResponse = await Service.UsuarioActualizarDatos(req);
    res.status(objResponse.status).jsonp(objResponse);
}

async function UsuarioMostrarLog(req, res, next) {
    let objResponse = await Service.UsuarioMostrarLog(req);
    res.status(objResponse.status).jsonp(objResponse);
}

function isLoggedIn(req, res, next) {
    Utilitys.ConsoleInfoDebugger(req);
    if (config.jwt) {
        CheckToken(req, res, next);
    } else {
        return next();
    }
}

function CheckToken(req, res, next) {
    let token = req.headers['token'];
    let objResponse = new ResponseModel();
    objResponse.status = 401;
    if (!token) {
        objResponse.message = 'Es necesario el token de autenticación';
        objResponse.auth = true; //solictar nuevo incio de session
        res.status(objResponse.status).jsonp(objResponse);
    } else {
        token = config.tokenStaticStatus ? config.tokenStatic : token;//AGREGAR TOKEN ESTATICOS PARA PRUEBAS 

        jwt.verify(token, ClaveSecreta, function (err, user) {
            if (err) {
                objResponse.message = err.message || 'Token inválido';
                objResponse.auth = true; //solictar nuevo incio de session
                res.status(objResponse.status).jsonp(objResponse);
            } else {
                return next();
            }
        });
    }
}

function SeccionUsuario(req, res, next) {
    // perimite enviar nos datos de seccion de usuario en el req
    let token = req.headers.token;
    token = config.tokenStaticStatus ? config.tokenStatic : token;//AGREGAR TOKEN ESTATICOS PARA PRUEBAS 
    let objResponse = new ResponseModel();
    if (!token) {
        objResponse.message = 'Es necesario el token de autenticación';
        objResponse.status = 401;
    } else {
        let ip = Utilitys.GetIpClient(req);
        let usuarios = app.get('session') || [];
        let usuario = usuarios[token] || {};
        if (!usuario.id) {
            objResponse.status = 401;
            objResponse.message = 'No se encontro inicio de sesión de usuario';
            objResponse.auth = true;
        } else {
            req.usuario = usuario;
            req.ip = ip;
            return next();
        }
    }
    res.status(objResponse.status).jsonp(objResponse);
}

module.exports = {
    Login,
    UsuarioRegistrar,
    CheckToken,
    isLoggedIn,
    SeccionUsuario,
    UsuarioCambioClave,
    UsuarioActualizarDatos,
    UsuarioMostrarLog,
    GenerarCodigoVerificacion
};