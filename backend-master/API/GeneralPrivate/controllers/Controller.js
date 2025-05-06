const Service = require('../services/Service');


async function showMenu(req, res, next) {
    let objResponse = await Service.showMenu(req);
    res.status(objResponse.status).jsonp(objResponse);
}

async function getModulo(req, res, next) {
    let objResponse = await Service.getModuloFull(req);
    res.status(objResponse.status).jsonp(objResponse);
}

async function getDigitalCatalogo(req, res, next) {
    let objResponse = await Service.getDigitalCatalogo(req);
    res.status(objResponse.status).jsonp(objResponse);
}




module.exports = {
    showMenu, 
    getModulo, 
    getDigitalCatalogo
};
