const Service = require('../services/Service');

async function CuentaList(req, res, next) {
    let objResponse = await Service.ListarCuenta(req);
    res.status(objResponse.status).jsonp(objResponse);
}

async function CanalPagoList(req, res, next) {
    let objResponse = await Service.ListarCanalPago(req);
    res.status(objResponse.status).jsonp(objResponse);
}

async function PagoGuardar(req, res, next) {
    let objResponse = await Service.GuardarSolicitudPago(req);
    res.status(objResponse.status).jsonp(objResponse);
}

async function RecargaSaldoVerificar(req, res, next) {
    let objResponse = await Service.RecargaSaldoVerificar(req);
    res.status(objResponse.status).jsonp(objResponse);
}

async function RecargaSaldoRechazar(req, res, next) {
    let objResponse = await Service.RecargaSaldoRechazar(req);
    res.status(objResponse.status).jsonp(objResponse);
}

async function RecargaSaldoAprobar(req, res, next) {
    let objResponse = await Service.RecargaSaldoAprobar(req);
    res.status(objResponse.status).jsonp(objResponse);
}



module.exports = {
    CuentaList,
    CanalPagoList,
    PagoGuardar,
    RecargaSaldoVerificar,
    RecargaSaldoRechazar,
    RecargaSaldoAprobar
};