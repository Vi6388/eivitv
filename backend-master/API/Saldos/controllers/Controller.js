const Service = require('../services/Service');

async function visualizarCupos(req, res, next) {
    let objResponse = await Service.visualizarCupos(req); 
    res.status(objResponse.status).jsonp(objResponse);
}


module.exports = {
    visualizarCupos
};