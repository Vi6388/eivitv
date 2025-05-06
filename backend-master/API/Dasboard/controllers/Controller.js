const Service = require('../services/Service');

async function ProductoList(req, res, next) {
  let objResponse = await Service.ProductoList(req);
  res.status(objResponse.status).jsonp(objResponse);
}

async function PublicidadList(req, res, next) {
  let objResponse = await Service.PublicidadList(req);
  res.status(objResponse.status).jsonp(objResponse);
}


async function TipoList(req, res, next) {
  let objResponse = await Service.TipoList(req);
  res.status(objResponse.status).jsonp(objResponse);
}

async function CategoriaList(req, res, next) {
  let objResponse = await Service.CategoriaList(req);
  res.status(objResponse.status).jsonp(objResponse);
}


async function FavoritosList(req, res, next) {
  let objResponse = await Service.FavoritosList(req);
  res.status(objResponse.status).jsonp(objResponse);
}

async function ProductoShow(req, res, next) {
  let objResponse = await Service.ProductoShow(req);
  res.status(objResponse.status).jsonp(objResponse);
}



module.exports = {
  PublicidadList, 
  ProductoList,
  TipoList,
  CategoriaList,
  FavoritosList,
  ProductoShow
};
