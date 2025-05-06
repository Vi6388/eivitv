const ConnectionBD = require('../../../config/ConnectionPG');
const ResponseModel = require("../../../Model/ResponseModel");
const Utilitys = require("../../../utils/Utilitys");


async function showMenu(req) {

    let objResponse = new ResponseModel();
    try {
        let usuario = req.usuario;
        let id_usuario = usuario.id;
        let id_rol = usuario.id_rol;
        let objResult = await ConnectionBD.knex.raw('SELECT * FROM fun_menu(:id_usuario)', { id_usuario });
        objResult = objResult.rows;

        if (objResult.length == 0) {
            objResponse.status = 203;
            objResponse.message = `No se encontro registro de menu.`;
        } else {

            //Crear recursividad de menu y obtener menu padres
            let menusHijos = objResult;
            let listMenu = [];
            for (let index = 0; index < menusHijos.length; index++) {
                let el = menusHijos[index];
                listMenu = await getMenuPadre(listMenu, el.id_menu);
                listMenu.push(el);
            }
            //Organizar Jeraquia
            let objMenu = await getJerrarquiaMenu(listMenu, 1)


            objResponse.status = 200;
            objResponse.message = `Se enconto ${listMenu.length} registros.`;
            objResponse.data = objMenu;

        }
    } catch (error) {
        objResponse.message = error.message;
    }
    return objResponse;
}


async function getMenuPadre(listMenu, id_menu) {
    let idMenus = listMenu.map((e) => { return e.id });
    let objResult = await ConnectionBD.knex("menu")
        .select([
            "id",
            "nombre",
            "descripcion",
            "icono",
            "id_modulo",
            "id_menu",
            ConnectionBD.knex.raw("coalesce (link ,'#') link")
        ])
        .andWhere("estado", "=", 1)
        .whereNotNull('id_menu')
        .where({ id: id_menu })
        .whereNotIn('id', idMenus);
    if (objResult.length != 0) {
        let objItem = objResult[0];
        let id_menu = objItem.id_menu;
        if (id_menu) {
            listMenu = await getMenuPadre(listMenu, id_menu);
        }

        listMenu.push(objItem);
    }

    return listMenu;

}

async function getJerrarquiaMenu(listMenu, init) {
    let listRoot = listMenu.filter(e => e.id_menu == init);
    let objMenu = [];
    for (let index = 0; index < listRoot.length; index++) {
        let el = listRoot[index];
        el.subMenus = await getJerrarquiaMenu(listMenu, el.id)
        objMenu.push(el);
    }
    return objMenu;
}



async function getModuloFull(req) {

    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        let usuario = req.usuario;
        let id_usuario = usuario.id_usuario;
        let id_perfil = parametro.id_perfil;
        let id_modulo = parametro.id_modulo;
        let arrayModulo = await ConnectionBD.knex("modulo")
            .select([
                "id",
                "codigo",
                "nombre",
                "descripcion",
                "config",
                "tipo"
            ])
            .where({ id: id_modulo });

        if (arrayModulo.length == 0) {
            objResponse.status = 203;
            objResponse.message = `No se encontro registro de modulo.`;
        } else {

            let objModulo = arrayModulo[0];
            objModulo.config = JSON.parse(objModulo.config || "{}");


            let arrayAccionAll = [];
            let objPerfil = await ConnectionBD.knex("perfil")
                .select(["nombre"]).where({ id: id_perfil }).first();

            if (objPerfil.nombre.includes("_all")) {
                arrayAccionAll.push('crear');
                arrayAccionAll.push('editar');
                arrayAccionAll.push('eliminar');
                arrayAccionAll.push('exportar');
            }

            let arrayPerfilAccion = await ConnectionBD
                .knex('perfil_accion as pera')
                .join('accion as acc', 'pera.id_accion', 'acc.id')
                .pluck('acc.nombre')
                .where('pera.estado', 1)
                .where('acc.estado', 1)
                .where('pera.id_perfil', id_perfil);

            arrayAccionAll = arrayAccionAll.concat(arrayPerfilAccion);


            objModulo.accion = arrayAccionAll;
            objModulo.perfil = objPerfil;


            objResponse.status = 200;
            objResponse.message = `Se encontró configuración de módulo.`;
            objResponse.data = objModulo;

        }
    } catch (error) {
        objResponse.message = error.message;
    }
    return objResponse;
}


async function getDigitalCatalogo(req) {

    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        let usuario = req.usuario;
        let id_rol = usuario.id_rol;
        let id_producto = parametro.id_producto;
        let arrayCatalogo = ConnectionBD.knex("catalogo_venta")
            .select([
                'id as id_catalogo',
                'id_producto',
                'tipo_vendedor',
                'codigo',
                'nombre',
                'descripcion',
                'precio',
                'comision',
                'observacion',
                'perfiles',
                'tipo_duracion',
                'cantidad_duracion',
                'estado'
            ])
            .where({ id_producto: id_producto, estado: 1 });
        if (id_rol != 1) {
            arrayCatalogo.where({ tipo_vendedor: id_rol });
        }

        arrayCatalogo = await arrayCatalogo;
        if (arrayCatalogo.length == 0) {
            objResponse.status = 203;
            objResponse.message = `No se encontro registro de catalogo.`;
        } else {
            let arrayCatalogoDisponible = [];


            arrayCatalogo.forEach(el => {
                let reqPerfiles = el.perfiles;
                let reqTipoDuracion = el.tipo_duracion;
                let reqCantidaDuracion = el.cantidad_duracion;
                let duracion = Utilitys.getTipoDuracion(reqTipoDuracion, reqCantidaDuracion);
                let descripcion = `${reqPerfiles} perfiles por ${reqCantidaDuracion} ${duracion}`;

                let item = {
                    id_catalogo: el.id_catalogo,
                    precio: el.precio,
                    comision: el.comision,
                    descripcion
                }

                arrayCatalogoDisponible.push(item);

            });


            objResponse.status = 200;
            objResponse.message = `Se encontró configuración de módulo.`;
            objResponse.data = arrayCatalogoDisponible;

        }
    } catch (error) {
        objResponse.message = error.message;
    }
    return objResponse;
}


module.exports = {
    showMenu,
    getModuloFull,
    getDigitalCatalogo
};
