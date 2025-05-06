const Service = require('../services/Service');

async function selectorPais(req, res, next) {
    let objResponse = await Service.selectorPais(req);
    res.status(objResponse.status).jsonp(objResponse);
}


async function selectorProvincia(req, res, next) {
    let objResponse = await Service.selectorProvincia(req);
    res.status(objResponse.status).jsonp(objResponse);
}

async function selectorCanton(req, res, next) {
    let objResponse = await Service.selectorCanton(req);
    res.status(objResponse.status).jsonp(objResponse);
}




module.exports = {
    selectorPais,
    selectorProvincia,
    selectorCanton
};
