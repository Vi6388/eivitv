const Service = require('../services/Service');

async function Consulta(req, res, next) {
  let objResponse = await Service.Consulta(req);
  res.status(objResponse.status).jsonp(objResponse);
}

async function Pago(req, res, next) {
  let objResponse = await Service.Pago(req);
  res.status(objResponse.status).jsonp(objResponse);
}

async function Recargar(req, res, next) {
  let objResponse = await Service.Recargar(req);
  res.status(objResponse.status).jsonp(objResponse);
}


async function Contratar(req, res, next) {
  let objResponse = await Service.Contratar(req);
  res.status(objResponse.status).jsonp(objResponse);
}


async function Reverso(req, res, next) {
  let objResponse = await Service.Reverso(req);
  res.status(objResponse.status).jsonp(objResponse);
}


//REVISAR
async function ConsultarCupo(req, res, next) {
  let objResponse = await Service.ConsultarCupo(req);
  res.status(objResponse.status).jsonp(objResponse);
}

async function ConsultarEntidadesCI(req, res, next) {
  let objResponse = await Service.ConsultarEntidadesCI(req);
  res.status(objResponse.status).jsonp(objResponse);
}

module.exports = {
  Consulta,
  Pago,
  Recargar, 
  Contratar, 
  Reverso,

  //REVISAR
  ConsultarCupo,
  ConsultarEntidadesCI,
};
