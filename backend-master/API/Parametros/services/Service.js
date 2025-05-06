
const Utilitys = require("../../../utils/Utilitys");
const ConnectionBD = require('../../../config/ConnectionPG');
const ResponseModel = require('../../../Model/ResponseModel');
const CabeceraResponseModel = require("../models/CabeceraResponseModel");
const CabeceraRequestModel = require("../models/CabeceraRequestModel");
const DetalleResponseModel = require("../models/DetalleResponseModel");
const DetalleRequestModel = require("../models/DetalleRequestModel");



/**
 * Obtener la cabecera de parametro
 * @param {CabeceraRequestModel} request 
 * @returns {ResponseModel}  
 * @author Jefferson Carrillo
 * @since 2023-07-08
 * @version 1.0.0
 * 
 */
async function getCabecera(request) {
    let dataCabecera = new CabeceraResponseModel;
    request.estado = 1;
    request = new CabeceraRequestModel(request);
    let objCabecera = await ConnectionBD.knex('parametro_cabecera')
        .select(['id', 'codigo', 'nombre', 'descripcion'])
        .where(request)
        .first();
    if (objCabecera) {
        dataCabecera = objCabecera;
    } else {
        throw new Error("No existe cabecera de parametro " + (request.codigo || request.nombre || '') + ".");
    }
    return dataCabecera;
}


/**
 * Obtener la detalle de parametro
 * @param {DetalleRequestModel} request 
 * @returns {ResponseModel}  
 * @author Jefferson Carrillo
 * @since 2023-07-08
 * @version 1.0.0
 * 
 */
async function getDetalle(request) {
    let dataDetalle = new DetalleResponseModel;
    request.estado = 1;
    request = new DetalleRequestModel(request);
    let objDetalle = await ConnectionBD.knex('parametro_detalle')
        .select(['id', 'codigo', 'valor', 'descripcion'])
        .where(request)
        .first();

    if (objDetalle) {
        dataDetalle = objDetalle;
    } else {
        throw new Error("No existe detalle de parametro " + (request.codigo || request.descripcion || '') + ".");
    }
    return dataDetalle;
}




/**
 * Obtener la detalle de parametro
 * @param {DetalleRequestModel} request 
 * @returns {ResponseModel}  
 * @author Jefferson Carrillo
 * @since 2023-07-08
 * @version 1.0.0
 * 
 */
async function getListaDetalle(request) {
    let dataDetalle = [];
    request.estado = 1;
    request = new DetalleRequestModel(request);
    let objDetalle = await ConnectionBD.knex('parametro_detalle')
        .select(['id', 'codigo', 'valor', 'descripcion'])
        .where(request);
    if (objDetalle.length != 0) {
        dataDetalle = objDetalle;
    } else {
        throw new Error("No existe detalle de parametro " + (request.codigo || request.descripcion || '') + ".");
    }
    return dataDetalle;
}



module.exports = {
    getCabecera,
    getDetalle,
    getListaDetalle
};


