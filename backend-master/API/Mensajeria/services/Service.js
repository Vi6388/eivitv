
const Utilitys = require("../../../utils/Utilitys");
const ConnectionBD = require('../../../config/ConnectionPG');
const ResponseModel = require('../../../Model/ResponseModel');
const NotificarWhatsAppResponseModel = require("../models/NotificarWhatsAppResponseModel");
const NotificarWhatsAppRequestModel = require("../models/NotificarWhatsAppRequestModel");
const ServiceParametro = require('../../Parametros/services/Service');



/**
 * Obtener la NotificarWhatsApp de parametro
 * @param {NotificarWhatsAppRequestModel} request 
 * @returns {ResponseModel}  
 * @author Jefferson Carrillo
 * @since 2023-07-08
 * @version 1.0.0
 * 
 */
async function notificarWhatsApp(request) {
    let dataResponse = new NotificarWhatsAppResponseModel(null);
    request = new NotificarWhatsAppRequestModel(request);

    let objCabeceraParametro = await ServiceParametro.getCabecera({ nombre: "CONFIG_NOTIFICA_WHATSAPP" });
    let id_parametro_cab = objCabeceraParametro.id;
    let objUrl = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: "url_base" });
    let objPlantilla = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: "plantilla_base" });
    let text =request.text;
    let numeroTelefono = request.phone;
    let nuevoNumero = numeroTelefono;
    if (numeroTelefono.startsWith("09") && numeroTelefono.length === 10) {
        nuevoNumero = "593" + numeroTelefono.slice(1);
        console.log("Número de teléfono modificado:", nuevoNumero);
    } else {
        console.log("El número de teléfono no cumple con el formato esperado.");
    }

    let url = objUrl.valor + `phone=${nuevoNumero}&text=${text}&type=phone_number&app_absent=0`;
    dataResponse.setUrl(url);


    // throw new Error("No existe NotificarWhatsApp de parametro " + (request.codigo || request.nombre || '') + ".");
    return dataResponse;
}



module.exports = {
    notificarWhatsApp
};


