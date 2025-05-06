const Service = require('../services/Service');
const ResponseModel = require('../../../Model/ResponseModel');

async function notificarWhatsApp(req, res, next) {
    let objResponse = new ResponseModel();
    try {
        objResponse.data = await Service.notificarWhatsApp(req.body);
    } catch (error) {
        objResponse = new ResponseModel(error);
    }
    res.status(objResponse.status).jsonp(objResponse);
}
 


module.exports = {
notificarWhatsApp
}