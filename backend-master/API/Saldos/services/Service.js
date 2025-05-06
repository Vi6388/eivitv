
const Utilitys = require("../../../utils/Utilitys");
const ConnectionBD = require('../../../config/ConnectionPG');
const ResponseModel = require('../../../Model/ResponseModel');
const SaldosRequestModel = require('../models/SaldosRequestModel');
const SaldosResponseModel = require('../models/SaldosResponseModel');



async function visualizarCupos(req) {
    let objResponse = new ResponseModel();
    let dataSaldos = new SaldosResponseModel();

    try {
        let parametro = new SaldosRequestModel(req.body);
        let usuario = req.usuario;
        let id_usuario = usuario.id;


        let objSaldo = await ConnectionBD.knex('saldo').select(['id', 'monto']).where({ id_usuario });
        if (objSaldo.length != 0) {
            objSaldo = objSaldo[0];
            dataSaldos.total_saldo = parseFloat(objSaldo.monto).toFixed(2);
        }

        let objComision = await ConnectionBD.knex('comision').select(['id', 'monto']).where({ id_usuario });
        if (objComision.length != 0) {
            objComision = objComision[0];
            dataSaldos.total_comision = parseFloat(objComision.monto).toFixed(2);
        }

        objResponse.message = "Su saldo actual es de $" + dataSaldos.total_saldo;
        objResponse.status = 200;
    } catch (error) {
        objResponse.message = error.message;
    }
    objResponse.data = dataSaldos;

    return objResponse;
}


async function actualizarSaldo(trx, idUsuario, monto, tipo, observacion) {
    let objSaldo = await ConnectionBD.knex('saldo').transacting(trx)
        .select(['id', 'monto'])
        .where({ id_usuario: idUsuario });
    let codigo = await Utilitys.GenerateKey(8);
    let descripcion = "";
    let estado = 1;

    let saldoAnterior = 0;
    let saldoActual = 0;

    switch (tipo) {
        case 1: //ingreso; 
            if (objSaldo.length == 0) {
                saldoActual = saldoAnterior + parseFloat(monto);
                objSaldo = await ConnectionBD.knex('saldo')
                    .transacting(trx)
                    .returning(['id', 'monto'])
                    .insert({ codigo, monto: saldoActual, id_usuario: idUsuario, estado, observacion });
            } else {
                objSaldo = objSaldo[0];
                saldoAnterior = parseFloat(objSaldo.monto);
                saldoActual = saldoAnterior + parseFloat(monto);
                objSaldo = await ConnectionBD.knex('saldo')
                    .transacting(trx)
                    .returning(['id', 'monto'])
                    .update({ monto: saldoActual, estado, observacion })
                    .where({ id_usuario: idUsuario });
            }
            break;

        case 2: //egreso; 

            objSaldo = objSaldo[0];
            saldoAnterior = parseFloat(objSaldo.monto);
            saldoActual = saldoAnterior - parseFloat(monto);
            objSaldo = await ConnectionBD.knex('saldo')
                .transacting(trx)
                .returning(['id', 'monto'])
                .update({ monto: saldoActual, estado, observacion })
                .where({ id_usuario: idUsuario });


            break;
    }


    objSaldo = objSaldo[0];
    let idSaldo = objSaldo.id;
    let objSaldoHistorial = await ConnectionBD.knex('saldo_historial')
        .transacting(trx)
        .insert({
            id_saldo: idSaldo,
            codigo,
            monto,
            anterior: saldoAnterior,
            actual: saldoActual,
            tipo,
            observacion,
            descripcion,
            estado
        });

    return saldoActual;

}

async function actualizarComision(trx, idUsuario, monto, tipo, observacion) {

    let objSaldo = await ConnectionBD.knex('comision').transacting(trx)
        .select(['id', 'monto'])
        .where({ id_usuario: idUsuario });
    let codigo = await Utilitys.GenerateKey(8);
    let descripcion = "";
    let estado = 1;

    let saldoAnterior = 0;
    let saldoActual = 0;

    switch (tipo) {
        case 1: //ingreso; 
            if (objSaldo.length == 0) {
                saldoActual = saldoAnterior + parseFloat(monto);
                objSaldo = await ConnectionBD.knex('comision')
                    .transacting(trx)
                    .returning(['id', 'monto'])
                    .insert({ codigo, monto: saldoActual, id_usuario: idUsuario, estado, observacion });
            } else {
                objSaldo = objSaldo[0];
                saldoAnterior = parseFloat(objSaldo.monto);
                saldoActual = saldoAnterior + parseFloat(monto);
                objSaldo = await ConnectionBD.knex('comision')
                    .transacting(trx)
                    .returning(['id', 'monto'])
                    .update({ monto: saldoActual, estado, observacion })
                    .where({ id_usuario: idUsuario });
            }
            break;

        case 2: //egreso; 

            objSaldo = objSaldo[0];
            saldoAnterior = parseFloat(objSaldo.monto);
            saldoActual = saldoAnterior - parseFloat(monto);
            objSaldo = await ConnectionBD.knex('comision')
                .transacting(trx)
                .returning(['id', 'monto'])
                .update({ monto: saldoActual, estado, observacion })
                .where({ id_usuario: idUsuario });


            break;
    }


    objSaldo = objSaldo[0];
    let idComision = objSaldo.id;
    let objSaldoHistorial = await ConnectionBD.knex('comision_historial')
        .transacting(trx)
        .insert({
            id_comision: idComision,
            codigo,
            monto,
            anterior: saldoAnterior,
            actual: saldoActual,
            tipo,
            observacion,
            descripcion,
            estado
        });

    return saldoActual;

}



module.exports = {
    visualizarCupos,
    actualizarSaldo,
    actualizarComision
};