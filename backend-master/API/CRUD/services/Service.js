const config = require("../../../config/Config");
const Utilitys = require("../../../utils/Utilitys");
const ConnectionBD = require('../../../config/ConnectionPG');

const ResponseModel = require("../../../Model/ResponseModel");
const DataModel = require("../models/DataModel");


async function Save(req) {
    const objCrud = req.objCrud;
    const table = objCrud.table;
    const columns_show = objCrud.columns_show;
    const usuario = req.usuario;

    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        let objData = new DataModel();
        for (let index = 0; index < columns_show.length; index++) {
            const el = columns_show[index];
            if (el.insert) {
                let valor = parametro[el.nombre];
                if (el.nombre == 'codigo' && (valor == '' || valor == undefined)) {
                    valor = Utilitys.GenerateKey(6);
                }

                if (valor == undefined) {
                    delete objData[el.nombre];
                } else {
                    switch (el.type) {
                        case 'file-pdf':
                            valor = await verificaArchivo(valor);
                            break;

                        case 'file-video':
                            valor = await verificaArchivo(valor);
                            break;

                    }
                    objData[el.nombre] = valor;

                    if (el.only) {
                        await ValidateOnlyContent(table, el.nombre, valor, null);
                    }
                }
            } else {
                delete objData[el.nombre];
            }
        }
        objData.estado = 1;

        let objResult = await ConnectionBD.knex(table).returning("*").insert(objData);

        if (objResult.length != 0) {
            objResponse.status = 201;
            objResult = objResult[0];
            let identificador = objResult.codigo || objResult.dni || objResult.nombre || objResult.id;
            objResponse.message = `Registro con identificador ${identificador} ingresado correctamente.`;
            objResponse.data = objResult;
            Utilitys.CrearLog(usuario.id, 1, `{"idt":"${identificador}", "tab":"${table}"}`);
        }
    } catch (error) {
        console.log("Error al guardar");
        console.log(error);
        objResponse = new ResponseModel(error);

    }
    return objResponse;
}


async function Update(req) {
    const objCrud = req.objCrud;
    const table = objCrud.table;
    const columns_show = objCrud.columns_show;
    const usuario = req.usuario;
    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        let id = parametro.id;
        await ValidarParametros(parametro);

        let objData = new DataModel();
        for (let index = 0; index < columns_show.length; index++) {
            const el = columns_show[index];
            if (el.update) {
                let valor = parametro[el.nombre];
                if (valor == undefined) {
                    delete objData[el.nombre];
                } else {
                    switch (el.type) {
                        case 'file-pdf':
                            valor = await verificaArchivo(valor);
                            break;

                        case 'file-video':
                            valor = await verificaArchivo(valor);
                            break;

                    }
                    objData[el.nombre] = valor;

                    if (el.only) {
                        await ValidateOnlyContent(table, el.nombre, valor, id);
                    }

                }
            } else {
                delete objData[el.nombre];
            }
        }


        objData.updated_at = new Date();
        let objResult = await ConnectionBD.knex(table).returning("*").update(objData).where('id', id);

        if (objResult.length == 0) {
            objResponse.status = 203;
            objResponse.message = `No se encontro registro de ${table}.`;
        } else {
            objResponse.status = 201;
            objResult = objResult[0];
            let identificador = objResult.codigo || objResult.dni || objResult.nombre || objResult.id;
            objResponse.message = `Registro con identificador ${identificador} modificado correctamente.`;
            objResponse.data = objResult;
            Utilitys.CrearLog(usuario.id, 2, `{"idt":"${identificador}", "tab":"${table}"}`);
        }

    } catch (error) {
        console.log("Error al actualizar");
        console.log(error);
        objResponse = new ResponseModel(error);
    }

    return objResponse;

}

async function verificaArchivo(valor) {
    let ruta = null;
    const extension = obtenerExtension(valor);
    const listDocumentos = ["pdf", "pdfa", "pdfx", "pdfe", "pdfua", "webp", "mp4"];
    if (listDocumentos.includes(extension)) {
        ruta = await Utilitys.GuardarArchivoBase64(valor);
    } else {
        ruta = valor;
    }
    return ruta;
}

function obtenerExtension(valor) {
    debugger
    valor = valor || "";
    const partes = valor.split(";");
    const tipo = partes.length > 0 ? partes[0].trim() : "";
    const extension = tipo.split("/")[1];
    return extension ? extension.trim() : null;
}

async function Show(req) {
    const objCrud = req.objCrud;
    const table = objCrud.table;
    const columns_show = objCrud.columns_show;

    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        await ValidarParametros(parametro);
        let identificador = parametro.id;

        let objResult = await ConnectionBD.knex(table).select("*").where('id', identificador);
        if (objResult.length == 0) {
            objResponse.status = 203;
            objResponse.message = `No se encontro registro de ${table}.`;
        } else {
            objResponse.status = 200;
            objResult = objResult[0];
            let identificador = objResult.codigo || objResult.dni || objResult.nombre || objResult.id;
            objResponse.message = `Se enconto el registro con identificador ${identificador}.`;
            objResponse.data = objResult;
            objResponse = await Utilitys.mapearUrlRoot(objResponse);
        }
    } catch (error) {
        console.log("Error al mostrar");
        console.log(error);
        objResponse = new ResponseModel(error);
    }

    return objResponse;

}

async function ShowList(req) {
    const objCrud = req.objCrud;
    const table = objCrud.view || objCrud.table;
    const columns_show = objCrud.columns_show;

    let body = req.body;
    let objResponse = await SelectPagination(body, columns_show, table);
    objResponse = await Utilitys.mapearUrlRoot(objResponse);
    return objResponse;
}



async function SelectPagination(body, columns_show, table) {
    let columns = body.columns || [{ data: 'id' }];
    let draw = body.draw||  '1';
    let length = body.length;
    let order = body.order || [{ column: '0', dir: 'desc' }];
    let search = body.search || { value: '', regex: 'false' };
    let search_value = search.value;
    let start = body.start;
    console.log(body);
    let ordenar = order[0];
    let ordenar_dir = ordenar.dir;
    let ordenar_column = columns[ordenar.column].data;

    let objResponse = new ResponseModel();
    objResponse.objResponse = draw;
    objResponse.recordsTotal = 0;
    objResponse.recordsFiltered = 0;
    objResponse.data = [];

    try {
        //CONSULTA DE PAGINACION
        var data_resume = ConnectionBD.knex(table);
        if (search_value) {
            data_resume.where((builder) => {
                columns_show.forEach(el => {
                    if (el.search) {
                        return builder.orWhereRaw(`UPPER(${el.nombre}) LIKE  UPPER('%${search_value}%')`)
                    }
                });
            });
        }
        data_resume.where("estado", "!=", -1);
        data_resume = await data_resume.count('*');
        let recordsFiltered = data_resume[0].count;


        //CONSULTA DE DATOS
        var data_result = ConnectionBD.knex(table);
        if (search_value) {
            data_result.where((builder) => {
                columns_show.forEach(el => {
                    if (el.search) {
                        return builder.orWhereRaw(`UPPER(${el.nombre}) LIKE  UPPER('%${search_value}%')`)
                    }
                });
            });
        }
        data_result.where("estado", "!=", -1);
        var data_result = await data_result.select("*").limit(length).offset(start).orderBy([{ column: ordenar_column, order: ordenar_dir }]);
        let recordsTotal = data_result.length;

        objResponse.recordsTotal = recordsTotal;
        objResponse.recordsFiltered = recordsFiltered;
        objResponse.data = data_result;
        if (recordsTotal == 0) {
            objResponse.status = 203;
            objResponse.message = `No se encontro registro.`;
        } else {
            objResponse.status = 200;
            objResponse.message = `Se encontaron ${recordsTotal} registros de un total de ${recordsFiltered}.`;
            objResponse = await Utilitys.mapearUrlRoot(objResponse);
        }
    } catch (error) {
        console.log("Error al listar");
        console.log(error);
        objResponse = new ResponseModel(error);
    }
    return objResponse;
}
async function Delete(req) {
    const objCrud = req.objCrud;
    const table = objCrud.table;
    const columns_show = objCrud.columns_show;
    const usuario = req.usuario;
    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        await ValidarParametros(parametro);
        let identificador = parametro.id;

        let objResult = await ConnectionBD.knex(table).returning("*").update({ estado: -1 }).where('id', identificador);
        if (objResult == 0) {
            objResponse.status = 203;
            objResponse.message = `No se encontro registro de ${table}.`;
        } else {
            objResult = objResult[0];
            identificador = objResult.codigo || objResult.dni || objResult.nombre || objResult.id;
            objResponse.status = 200;
            objResponse.message = `Registro con identificador ${identificador} eliminado correctamente`;
            objResponse.data = objResult;
            Utilitys.CrearLog(usuario.id, 3, `{"idt":"${identificador}", "tab":"${table}"}`);
        }
    } catch (error) {
        console.log("Error al eliminar");
        console.log(error);
        objResponse = new ResponseModel(error);
    }
    return objResponse;
}
async function ValidarParametros(parametro) {
    if (!parametro.id) {
        throw new Error("El campo id es requerido.");
    }
}

async function ShowSelector(req) {
    const objCrud = req.objCrud;
    const table = objCrud.table;

    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        let selector_text = parametro.selector_text || "nombre";

        selector_text = ConnectionBD.knex.raw(selector_text + ' as text')
        let objResult = await ConnectionBD.knex(table).select("id", selector_text) //.where("estado", "=", 1);
        if (objResult.length == 0) {
            objResponse.status = 203;
            objResponse.message = `No se encontro registro de ${table}.`;
        } else {
            objResponse.status = 200;
            objResponse.message = `Se enconto ${objResult.length} registros.`;
            objResponse.data = objResult;
            objResponse = await Utilitys.mapearUrlRoot(objResponse);

        }
    } catch (error) {
        console.log("Error en selector");
        console.log(error);
        objResponse = new ResponseModel(error);
    }

    return objResponse;
}


async function ShowContent(req) {
    const objCrud = req.objCrud;

    const columns_show = objCrud.columns_show || [];

    const show_content = objCrud.show_content;
    const select_show = show_content.select;
    const table = show_content.view || objCrud.table;

    let parametro = req.body;

    let objResponse = new ResponseModel();
    try {

        let objResult = ConnectionBD.knex(table);

        if (parametro) {
            objResult.where(parametro);
        }
        objResult.where("estado", "=", 1);

        objResult = await objResult.select(select_show);
        if (objResult.length == 0) {
            objResponse.status = 203;
            objResponse.message = `No se encontro registro de ${table}.`;
        } else {
            objResponse.status = 200;
            objResponse.message = `${objResult.length} registros encontrados.`;
        }
        objResponse.data = objResult;
        objResponse = await Utilitys.mapearUrlRoot(objResponse);
    } catch (error) {
        console.log("Error en contenido");
        console.log(error);
        objResponse = new ResponseModel(error);
    }
    return objResponse;
}





async function ValidateOnlyContent(table, campo, valor, id) {
    let objResult = ConnectionBD.knex(table).where('estado', 1).where(campo, valor);

    if (id) {
        objResult = objResult.where('id', '<>', id);
    }

    objResult = await objResult.select("id");

    if (objResult.length != 0) {
        throw new Error("Ya existe un registro con el " + campo + " " + valor);
    }
}

module.exports = {
    Save,
    Update,
    Delete,
    Show,
    ShowList,
    ShowContent,
    ShowSelector,
    ValidateOnlyContent
};


