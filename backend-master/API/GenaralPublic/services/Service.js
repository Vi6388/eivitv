const ConnectionBD = require('../../../config/ConnectionPG');
const ResponseModel = require("../../../Model/ResponseModel");

async function selectorPais(req) {
    const table = "pais";
    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        selector_text = ConnectionBD.knex.raw('nombre as text')
        let objResult = await ConnectionBD.knex(table).select("id", selector_text).where("estado", "=", 1);
        if (objResult.length == 0) {
            objResponse.status = 203;
            objResponse.message = `No se encontro registro de ${table}.`;
        } else {
            objResponse.status = 200;
            objResponse.message = `Se enconto ${objResult.length} registros.`;
            objResponse.data = objResult;

        }
    } catch (error) {
        objResponse.message = error.message;
    }

    return objResponse;
}


async function selectorProvincia(req) {
    const table = "provincia";
    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        let id_pais = parametro.id_pais || 1;
        selector_text = ConnectionBD.knex.raw('nombre as text')
        let objResult = await ConnectionBD.knex(table).select("id", selector_text).where("estado", "=", 1).where("id_pais", "=", id_pais);

        if (objResult.length == 0) {
            objResponse.status = 203;
            objResponse.message = `No se encontro registro de ${table}.`;
        } else {
            objResponse.status = 200;
            objResponse.message = `Se enconto ${objResult.length} registros.`;
            objResponse.data = objResult;

        }
    } catch (error) {
        objResponse.message = error.message;
    }

    return objResponse;
}

async function selectorCanton(req) {
    const table = "canton";
    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        let id_provincia = parametro.id_provincia || 1;
        selector_text = ConnectionBD.knex.raw('nombre as text')
        let objResult = await ConnectionBD.knex(table).select("id", selector_text).where("estado", "=", 1).where("id_provincia", "=", id_provincia);

        if (objResult.length == 0) {
            objResponse.status = 203;
            objResponse.message = `No se encontro registro de ${table}.`;
        } else {
            objResponse.status = 200;
            objResponse.message = `Se enconto ${objResult.length} registros.`;
            objResponse.data = objResult;

        }
    } catch (error) {
        objResponse.message = error.message;
    }
    return objResponse;
}




module.exports = {
    selectorPais,
    selectorProvincia,
    selectorCanton
};
