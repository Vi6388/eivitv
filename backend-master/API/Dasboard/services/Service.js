const ConnectionBD = require('../../../config/ConnectionPG');
const ResponseModel = require("../../../Model/ResponseModel");

async function ProductoList(req) {
  let objResponse = new ResponseModel();
  try {
    let parametro = req.body;
    let id_categoria = parametro.id_categoria;
    let canton = parametro.canton;
    let nombre = parametro.nombre;
    let show = ["id", "nombre", "icono"];
    let objResult = ConnectionBD.knex("view_board_productos").select(show).where("estado", "=", 1);

    if (id_categoria) {
      objResult = objResult.where("id_categoria", "=", id_categoria);
    }

    if (canton) {
      objResult = objResult.where("nombre", "like", `%${canton}%`);
    }
    if (nombre) {
      objResult = objResult.whereRaw('UPPER(nombre) LIKE ?', [`%${nombre.toUpperCase()}%`])
    }


    objResult = await objResult;
    if (objResult.length == 0) {
      objResponse.status = 203;
      objResponse.message = `No se encontro registro.`;
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


async function PublicidadList(req) {

  let objResponse = new ResponseModel();
  try {
    let parametro = req.body;
    let show = ["id", "nombre", "imagen"];
    let objResult = await ConnectionBD.knex("publicidad").select(show).where("estado", "=", 1);
    if (objResult.length == 0) {
      objResponse.status = 203;
      objResponse.message = `No se encontro registro.`;
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


async function TipoList(req) {

  let objResponse = new ResponseModel();
  try {
    let parametro = req.body;
    let show = ["id", "nombre", "icono"];
    let objResult = await ConnectionBD.knex("view_board_tipo").select(show).where("estado", "=", 1);
    if (objResult.length == 0) {
      objResponse.status = 203;
      objResponse.message = `No se encontro registro.`;
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

async function CategoriaList(req) {

  let objResponse = new ResponseModel();
  try {
    let parametro = req.body;
    let id_tipo = parametro.id_tipo;
    let show = ["id", "nombre", "icono"];
    let objResult = await ConnectionBD.knex("view_board_categoria").select(show).where("id_tipo", "=", id_tipo).where("estado", "=", 1);
    if (objResult.length == 0) {
      objResponse.status = 203;
      objResponse.message = `No se encontro registro.`;
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


async function FavoritosList(req) {

  let objResponse = new ResponseModel();
  try {
    let parametro = req.body;
    let id_usuario = parametro.id_usuario;
    let show = ["id", "nombre", "icono"];
    let objResult = ConnectionBD.knex("view_board_productos_favoritos").select(show)
    let show_file = [0];

    if (id_usuario) {
      show_file.push(id_usuario);
    }
    objResult = objResult.orWhereIn("id_usuario", show_file);

    objResult = await objResult;
    if (objResult.length == 0) {
      objResponse.status = 203;
      objResponse.message = `No se encontro registro.`;
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

async function ProductoShow(req) {

  let objResponse = new ResponseModel();
  try {
    let parametro = req.body;
    let id_producto = parametro.id_producto;
    let show = "*";
    let objResult = ConnectionBD.knex("view_productos").select(show).where("id", "=", id_producto);

    objResult = await objResult;
    if (objResult.length == 0) {
      objResponse.status = 203;
      objResponse.message = `No se encontro registro.`;
    } else {
      objResponse.status = 200;
      objResponse.message = `Se enconto ${objResult.length} registro.`;
      objResponse.data = objResult[0];

    }
  } catch (error) {
    objResponse.message = error.message;
  }

  return objResponse;
}



module.exports = {
  PublicidadList, 
  ProductoList,
  TipoList,
  CategoriaList,
  FavoritosList,
  ProductoShow
};
