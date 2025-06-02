
const config = require("../config/Config");
const dateFormat = require("dateformat");
const fs = require("fs");
const bcrypt = require('bcryptjs');
const EmailController = require('../utils/Email');
const ip = require("ip").address();
const constante = require("../config/Constantes");
const ServiceParametro = require('./../API/Parametros/services/Service');

const ConsolColors = {
    reset: "\033[0m",
    //text color
    black: "\033[30m",
    red: "\033[31m",
    green: "\033[32m",
    yellow: "\033[33m",
    blue: "\033[34m",
    magenta: "\033[35m",
    cyan: "\033[36m",
    white: "\033[37m",
    //background color
    blackBg: "\033[40m",
    redBg: "\033[41m",
    greenBg: "\033[42m",
    yellowBg: "\033[43m",
    blueBg: "\033[44m",
    magentaBg: "\033[45m",
    cyanBg: "\033[46m",
    whiteBg: "\033[47m",
    // cierre de color
    Reset: "\x1b[0m",
};
let cont = "";

function ConsoleInfo(data) {
    let color = ConsolColors[data.color];
    let rest = ConsolColors.Reset;
    let text = data.text;
    console.log(color + text + rest);
}

function ConsoleInfoDebugger(req) {
    if (config.console_debugger) {
        let color = ConsolColors.cyan;
        let rest = ConsolColors.Reset;
        let cliente = req.headers["user-agent"];
        let ruta = req.originalUrl;
        let now = new Date();
        let fecha = dateFormat(now, "mm-dd-yyyy  h:MM:ss:l");
        let s = "______________________________________________";
        console.log(color + s);
        console.log("Date: " + fecha);
        console.log("Route: " + ruta);
        console.log("Client: " + cliente);
        console.log(s + rest);
    }
}

function ConsoleTabInfo(data) {
    let now = new Date();
    let fecha = dateFormat(now, "mm-dd-yyyy  h:MM:ss:l");
    // https://misc.flogisoft.com/bash/tip_colors_and_formatting
    if (config.console_info || data.break == true) {
        let color = ConsolColors[data.color];
        let rest = ConsolColors.Reset;

        let titulo = data.title;
        let grafi = "===================";
        console.log(color + cont + fecha + " [" + titulo + "]" + grafi + rest);
        cont = cont + " ";
        let O = data.obj;
        if (O != undefined) {
            let text = JSON.stringify(O);
            console.log(cont + text);
        }
        let C = data.childre;
        if (C != undefined) {
            data.childre(C);
            cont = "";
        }
        let t = titulo.length + 3 + fecha.length;
        for (let index = 0; index < t; index++) {
            grafi = grafi + "=";
        }
        console.log(color + cont + grafi + rest);
    }
}

async function hashPassword(data) {
    let saltRounds = 10;
    return promise = new Promise((resolve, reject) => {
        bcrypt.hash(data, saltRounds)
            .then(function (hash) {
                resolve(hash);
            })
            .catch(function (error) {
                reject(error);
            });
    });
}

function GenerateKey(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

async function CalcularMinutosEntreFechas(fecha1, fecha2) {
    var newYear1 = new Date(fecha1);
    var newYear2 = new Date(fecha2);
    var dif = (newYear2 - newYear1);
    var dif = Math.round((dif / 1000) / 60);
    return dif;
}

async function CrearLog(id_usuario, id_tipo, valor) {
    let dataLog = { id_usuario, id_tipo, valor, estado: 1 };
    const ConnectionBD = require("../config/ConnectionPG");
    let objResultLog = await ConnectionBD.knex("log_detalle").returning("id").insert(dataLog);
    return objResultLog;
}

async function ModificarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}

function GetDataUsuario(req) {
    let sessionID = req.session.id;
    let usuarios = app.get('session') || [];
    let usuario = usuarios[sessionID];
    return usuario;
}

function SetDataUsuario(token, usuario) {
    let ses = app.get('session') || [];
    ses[token] = usuario;
    app.set('session', ses);
}

function GetDataUsuario(req) {
    let sessionID = req.session.id;
    let usuarios = app.get('session') || [];
    let usuario = usuarios[sessionID];
    return usuario;
}

async function ConvertirBase64File(path, name, base64Str) {
    let ruta = "";
    try {
        let base64Image = base64Str.split(';base64,').pop();
        let save = path + name;
        let root = __dirname + '/../';
        fs.writeFileSync(root + save, base64Image, { encoding: 'base64' });
        ruta = '{url}' + save;
    } catch (error) {
        console.log(error);
    }
    return ruta;

}

async function GuardarArchivoBase64(base64Str) {
    let ruta = "";
    try {
        let fileName = await GenerateKey(50);
        let path = "/archivos/";
        let type = base64Str.split(';')[0].split('/')[1];
        let name = fileName + "." + type;
        ruta = await ConvertirBase64File(path, name, base64Str);
    } catch (error) {
        console.log(error);
    }
    return ruta;
}


async function SendEmailGeneral(correos, asunto, content) {
    try {
        let id_parametro_cab = constante.idParametroGeneral;
        let objDataParametro1 = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: constante.linkBackend });
        let objDataParametro2 = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: constante.linkFacebook });
        let objDataParametro3 = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: constante.linkFrontend });
        let objDataParametro4 = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: constante.logoEstandar });
        let objDataParametro5 = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: constante.logoFacebook });

        let dataParameter = {
            empresa: config.nombre,
            content,
            link_backend: objDataParametro1.valor,
            link_facebook: objDataParametro2.valor,
            link_frontend: objDataParametro3.valor,
            logo_estandar: objDataParametro4.valor,
            logo_facebook: objDataParametro5.valor,
        };

        let operator_html = await EmailController.FormatoEstandarHTML(dataParameter);
        await EmailController.EnviarEmail({
            asunto: asunto,
            para: correos,
            html: operator_html,
            attachments: [],
        });

    } catch (error) {
        console.log(error);
    }
}

async function mapearUrlRoot(objResult) {
    try {

        let id_parametro_cab = constante.idParametroGeneral;
        let objDataParametro1 = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: constante.linkBackend });
        let host = objDataParametro1.valor;
        objResult = JSON.stringify(objResult);
        objResult = objResult.replace(/{url}/g, host);
        objResult = JSON.parse(objResult);
        return objResult;
    } catch (error) {
        throw new Error(error.message);
    }
}

function GetPuerto() {
    let CHTTP = config.local.CONNECTION_HTTP;
    let port = process.env.PORT || CHTTP.puerto;
    return port;
}

function GetIP() {
    return ip;
}

function GetIpClient(req) {
    //let ip = req.header('x-forwarded-for') || req.connection.remoteAddress
    let ip = req.ip.toString();
    let res = config.IpClienteDefault;
    ip = ip.split(":");
    if (ip.length == 4) {
        res = ip[3];
    }
    return res;
}

function replaceText(text, key, value) {
    let response = text.replaceAll(key, value);
    return response;
}

let objTiposDuracion = {
    1: "dia",
    2: "mes",
    3: "año"
};

function getTipoDuracion(idTipoDuracion, cantDuracion) {
        let tipoDuracion = objTiposDuracion[idTipoDuracion]; 
        if (cantDuracion > 1) {
            tipoDuracion = tipoDuracion + (idTipoDuracion == 2 ? 'es' : 's');
        }      
        return  tipoDuracion 
}



module.exports = {
    replaceText,
    ConsoleTabInfo,
    ConsoleInfo,
    ConsoleInfoDebugger,
    GetIP,
    GetPuerto,
    GetIpClient,
    hashPassword,
    CalcularMinutosEntreFechas,
    CrearLog,
    ModificarDias,
    GenerateKey,
    GetDataUsuario,
    SetDataUsuario,
    ConvertirBase64File,
    GuardarArchivoBase64,
    SendEmailGeneral,
    mapearUrlRoot,
    getTipoDuracion
};

