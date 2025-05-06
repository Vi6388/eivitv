const Service = require('../services/Service');
const ResponseModel = require('../../../Model/ResponseModel');

async function getCabecera(req, res, next) {
    let objResponse = new ResponseModel();
    try {
        objResponse.data = await Service.getCabecera(req.body);
    } catch (error) {
        objResponse = new ResponseModel(error);
    }
    res.status(objResponse.status).jsonp(objResponse);
}

async function getDetalle(req, res, next) {
    let objResponse = new ResponseModel();
    try {
        objResponse.data = await Service.getDetalle(req.body);
    } catch (error) {
        objResponse = new ResponseModel(error);
    }
    res.status(objResponse.status).jsonp(objResponse);
}

async function getListaDetalle(req, res, next) {
    let objResponse = new ResponseModel();
    try {
        objResponse.data = await Service.getListaDetalle(req.body);
      
    } catch (error) {
        objResponse = new ResponseModel(error);
    }
    res.status(objResponse.status).jsonp(objResponse);
}



module.exports = {
    getCabecera,
    getDetalle,
    getListaDetalle
}