const config = require("../../../config/Config");
const Utilitys = require("../../../utils/Utilitys");
const ConnectionBD = require('../../../config/ConnectionPG');
const ResponseModel = require('../../../Model/ResponseModel');
const SolicitudPagoRequestModel = require('../models/SolicitudPagoRequestModel');
const SaldoServices = require('../../Saldos/services/Service');
const CrudServices = require('../../CRUD/services/Service');

async function ListarCuenta(req) {
    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        let show = [
            'id',
            'banco_nombre',
            'banco_icono',
            'cuenta',
            'nombre',
            'cedula',
            'descripcion',
        ];
        let objResult = await ConnectionBD.knex('view_cuentas_bancarias').select(
            show
        );

        if (objResult.length == 0) {
            objResponse.status = 403;
            objResponse.message = `No se encontro registro.`;
        } else {
            objResponse.status = 200;
            objResponse.message = `Se enconto ${objResult.length} registros.`;

            for (let index = 0; index < objResult.length; index++) {
                const el = objResult[index];
                let show_canal = [
                    'id_cuenta_canal',
                    'id_canal_pago',
                    'img_baucher',
                    'descripcion',
                    'nombre',
                ];
                let objResultCuentaCanal = await ConnectionBD.knex(
                    'view_cuentas_bancarias_canales'
                )
                    .select(show_canal)
                    .where('id_cuenta', '=', el.id);
                el.array_canales = objResultCuentaCanal;
            }
            objResponse.data = objResult;
        }
    } catch (error) {
        objResponse.status = 403;
        objResponse.message = error.message;
    }

    return objResponse;
}

async function ListarCanalPago(req) {
    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        let show = ['id', 'codigo', 'nombre', 'icono'];
        let objResult = await ConnectionBD.knex('canal_pago')
            .select(show)
            .where('estado', '=', 1);
        if (objResult.length == 0) {
            objResponse.status = 403;
            objResponse.message = `No se encontro registro.`;
        } else {
            objResponse.status = 200;
            objResponse.message = `Se enconto ${objResult.length} registros.`;
            objResponse.data = objResult;
        }
    } catch (error) {
        objResponse.status = 403;
        objResponse.message = error.message;
    }

    return objResponse;
}

async function GuardarSolicitudPago(req) {
    let usuario = req.usuario;
    let objResponse = new ResponseModel();
    try {
        let parametro = new SolicitudPagoRequestModel(req.body);
        let ruta_comprobante = parametro.comprobante;
        let codigo = await Utilitys.GenerateKey(8);
        ruta_comprobante = await Utilitys.GuardarArchivoBase64(ruta_comprobante);
        let fecha = new Date(parametro.fecha);
        let table ='recarga_saldo'; 
        let data_insert = {
            codigo,
            id_usuario: usuario.id,
            id_cuenta_canal: parametro.id_cuenta_canal,
            documento: parametro.documento,
            fecha: fecha,
            monto: parametro.monto,
            descripcion: parametro.descripcion,
            comprobante: ruta_comprobante,
            status: 0,
            motivo: '',
            estado: 1,
        };

        await CrudServices.ValidateOnlyContent(table, 'documento', parametro.documento ,null);
        
        let objResult = await ConnectionBD.knex(table)
            .returning('*')
            .insert(data_insert);
        if (objResult.length == 0) {
            objResponse.status = 403;
            objResponse.message = `No se pudo ingresar el pago.`;
        } else {
            objResponse.status = 200;
            objResponse.message = `Pago registrado correctamente.`;

            //notificar solicitud de recarga a operador 
            objResult = objResult[0];
            let id_recarga_saldo = objResult.id;
            let objRecargaSaldo = await ConnectionBD.knex('view_recarga_saldo').returning('*').where({ id_recarga_saldo });
            objRecargaSaldo = objRecargaSaldo[0];
            notificarOperadorRecargaSolicitada(objRecargaSaldo);
            notificarClienteRecargaSolicitada(objRecargaSaldo);
        }
    } catch (error) {
        console.log("Error al GuardarSolicitudPago");
        console.log(error);
        objResponse = new ResponseModel(error);
    }

    return objResponse;
}

async function RecargaSaldoVerificar(req) {
    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        let id_recarga_saldo = parametro.id_recarga_saldo;
        let show = [
            'id_recarga_saldo',
            'id_cuenta_canal',
            'codigo_recarga',
            'documento',
            'fecha',
            'comprobante',
            'monto',
            'descripcion',
            'id_usuario',
            'status',
            'status_nombre',
            'codigo_usuario',
            'nombres',
            'apellidos',
            'dni',
            'correo',
            'foto_img',
            'id_banco',
            'codigo_banco',
            'nombre_banco',
            'id_cuenta',
            'codigo_cuenta',
            'nombre_cuenta',
            'id_canal_pago',
            'codigo_canal',
            'nombre_canal',
            'motivo',
        ];
        let objResult = await ConnectionBD.knex('view_recarga_saldo')
            .select(show)
            .where({ id_recarga_saldo });
        if (objResult.length == 0) {
            objResponse.status = 403;
            objResponse.message = `No se encontro registro.`;
        } else {
            objResponse.status = 200;
            objResponse.message = `Se enconto registros.`;
            objResponse.data =  await Utilitys.mapearUrlRoot(objResult[0]);
        }
    } catch (error) {
        objResponse.status = 403;
        objResponse.message = error.message;
    }

    return objResponse;
}

async function RecargaSaldoRechazar(req) {
    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        let motivo = parametro.motivo;
        let id_recarga_saldo = parametro.id_recarga_saldo;
        let status = 2; //rechazado

        let objRecargaSaldo = await ConnectionBD.knex('view_recarga_saldo')
            .returning('*')
            .where({ id_recarga_saldo, status: 0 });
        if (objRecargaSaldo.length == 0) {
            objResponse.status = 403;
            objResponse.message = `La recarga de saldo no cumple con el proceso de verificación.`;
        } else {
            objRecargaSaldo = objRecargaSaldo[0];
            if (objRecargaSaldo.status == status) {
                objResponse.status = 403;
                objResponse.message = `La recarga de saldo ya fue rechazada.`;
            } else {
                let data_update = {
                    status,
                    motivo,
                };

                let objResult = await ConnectionBD.knex('recarga_saldo')
                    .returning('id')
                    .update(data_update)
                    .where({ id: id_recarga_saldo, status: 0 });
                if (objResult.length == 0) {
                    objResponse.status = 403;
                    objResponse.message = `No se pudo rechazar la recarga de saldo vuelva a intentar.`;
                } else {
                    objResponse.status = 200;
                    objResponse.message = `Recarga de saldo rechazada correctamente.`;
                    //enviar correo
                    notificarClienteRecargaRechazada(objRecargaSaldo, motivo);
                }
            }
        }
    } catch (error) {
        objResponse.status = 403;
        objResponse.message = error.message;
    }

    return objResponse;
}

async function RecargaSaldoAprobar(req) {
    let objResponse = new ResponseModel();
    try {
        let parametro = req.body;
        let id_recarga_saldo = parametro.id_recarga_saldo;
        let status = 1; //aprobado

        let objRecargaSaldo = await ConnectionBD.knex('view_recarga_saldo')
            .returning('*')
            .where({ id_recarga_saldo, status: 0 });
        if (objRecargaSaldo.length == 0) {
            objResponse.status = 403;
            objResponse.message = `La recarga de saldo no cumple con el proceso de verificación.`;
        } else {
            objRecargaSaldo = objRecargaSaldo[0];
            if (objRecargaSaldo.status == status) {
                objResponse.status = 403;
                objResponse.message = `La recarga de saldo ya fue aprobado.`;

            } else {
                await ConnectionBD.knex.transaction(async function (trx) {

                    let objResult = await ConnectionBD.knex('recarga_saldo')
                        .transacting(trx)
                        .returning('*')
                        .update({ status })
                        .where({ id: id_recarga_saldo, status: 0 });
                    if (objResult.length == 0) {
                        objResponse.status = 403;
                        objResponse.message = `No se pudo aprobar la recarga de saldo vuelva a intentar.`;
                    } else {
                        //actualizar saldo
                        objResult = objResult[0];
                        let id_usuario = objResult.id_usuario;
                        let monto = objResult.monto;

                        let saldoActual = await SaldoServices.actualizarSaldo(trx, id_usuario, monto, 1);

                        objResponse.status = 200;
                        objResponse.message = `Recarga de saldo aprobada correctamente.`;
                        objResponse.data = { saldoActual }
                    }

                }).then(function (res) {
                    console.log('Transaction complete.');
                    //enviar correo
                    notificarClienteRecargaAprobada(objRecargaSaldo);
                }).catch(function (err) {
                    console.error(err);
                });

            }
        }
    } catch (error) {
        objResponse.status = 403;
        objResponse.message = error.message;
    }
    return objResponse;
}


async function notificarOperadorRecargaSolicitada(objData) {

    let correos_operador = config.operator_email;

    let cliente = objData.nombres + ' ' + objData.apellidos;
    let dni = objData.dni;
    let correo = objData.correo;
    let codigo_recarga = objData.codigo_recarga;
    let documento = objData.documento;
    let monto = objData.monto;
    let nombre_banco = objData.nombre_banco;
    let nombre_cuenta = objData.nombre_cuenta;
    let nombre_canal = objData.nombre_canal;

    let fecha_sistema = new Date();
    let asunto = 'Verificar solicitud para recarga de saldo';
    let html = `
    <tr>
        <td style="font-size:22px; line-height:100%; font-weight:normal; color:#333; padding-bottom:0px; padding-top:18px; text-align:center">
            Estimado administrador se ha realizado la siguiente solicitud de recarga, realizar la verificacion del pago.
        </td>
    </tr>
    <tr>
        <td style="font-size:14px!important; padding-bottom:20px; padding-top:10px; text-align:center; max-width:500px!important">
            <blockquote>
                <p><b>Codigo Solicitud: </b> ${codigo_recarga} </p>
                <p><b>Cliente: </b>  ${cliente}</p>
                <p><b>DNI:     </b>  ${dni}</p>
                <p><b>Correo:  </b>  ${correo}</p>
                <br>
                <p><b>Documento: </b>${documento} </p>
                <p><b>Banco:     </b>${nombre_banco} </p>
                <p><b>Cuenta:    </b>${nombre_cuenta}</p>
                <p><b>Canal:     </b>${nombre_canal} </p>
                <p><b>Monto:     </b><h1>${monto}</h1> </p>
               
                <br>
                <small>Fecha: <cite title="${fecha_sistema}">${fecha_sistema}</cite></small>
                <br>
            </blockquote>
        </td>
    </tr>
    `;

    Utilitys.SendEmailGeneral(correos_operador, asunto, html);
}

async function notificarClienteRecargaSolicitada(objData) {


    let cliente = objData.nombres + ' ' + objData.apellidos;
    let correos = [objData.correo];
    let codigo_recarga = objData.codigo_recarga;
    let documento = objData.documento;
    let monto = objData.monto;
    let nombre_banco = objData.nombre_banco;
    let nombre_cuenta = objData.nombre_cuenta;
    let nombre_canal = objData.nombre_canal;

    let fecha_sistema = new Date();
    let asunto = 'Verificar solicitud para recarga de saldo';
    let html = `
    <tr>
        <td style="font-size:22px; line-height:100%; font-weight:normal; color:#333; padding-bottom:0px; padding-top:18px; text-align:center">
            Estimad@ ${cliente} su pago ha sido reportado exitosmente.
        </td>
    </tr>
    <tr>
        <td style="font-size:14px!important; padding-bottom:20px; padding-top:10px; text-align:center; max-width:500px!important">
            <blockquote>
                <p> <b>Codigo Solicitud: </b> ${codigo_recarga} </p>      
                <p><b>Documento: </b>${documento} </p>
                <p><b>Banco:     </b>${nombre_banco} </p>
                <p><b>Cuenta:    </b>${nombre_cuenta}</p>
                <p><b>Canal:     </b>${nombre_canal} </p>
                <p><b>Monto:     </b><h1>${monto}</h1> </p>  
                <br>  
                <p><h3><b>Aremos la verificación respectiva de la transacción y acreditación a su cuenta</b></h3></p>             
                <br>
                <small>Fecha: <cite title="${fecha_sistema}">${fecha_sistema}</cite></small>
                <br>
            </blockquote>
        </td>
    </tr>
    `;

    Utilitys.SendEmailGeneral(correos, asunto, html);
}


async function notificarClienteRecargaRechazada(objData, motivo) {
    let cliente = objData.nombres + ' ' + objData.apellidos;
    let correos = [objData.correo];
    let fecha_sistema = new Date();
    let asunto = 'Recarga de saldo rechazada';

    let html = `
    <tr>
        <td style="font-size:22px; line-height:100%; font-weight:normal; color:#333; padding-bottom:0px; padding-top:18px; text-align:center">
            Estimad@ ${cliente}
        </td>
    </tr>
    <tr>
        <td style="font-size:14px!important; padding-bottom:20px; padding-top:10px; text-align:center; max-width:500px!important">
            <blockquote>
                <p>Su solicitud de recarga de saldo ha sido rechazada</p>
                <br>
                <h3><small>Motivo de rechazo</small></h3>
                <h2><small><cite title="${motivo}">${motivo}</cite></small></h2>
                <br>
                <small>Fecha: <cite title="${fecha_sistema}">${fecha_sistema}</cite></small>
                <br>
            </blockquote>
        </td>
    </tr>
    `;

    Utilitys.SendEmailGeneral(correos, asunto, html);
}

async function notificarClienteRecargaAprobada(objData) {
    let cliente = objData.nombres + ' ' + objData.apellidos;
    let correos = [objData.correo];
    let fecha_sistema = new Date();
    let monto = objData.monto;
    let asunto = 'Recarga de saldo aprobada';
    let html = `
    <tr>
        <td style="font-size:22px; line-height:100%; font-weight:normal; color:#333; padding-bottom:0px; padding-top:18px; text-align:center">
            Estimad@ ${cliente}
        </td>
    </tr>
    <tr>
        <td style="font-size:14px!important; padding-bottom:20px; padding-top:10px; text-align:center; max-width:500px!important">
            <blockquote>
                <p>Su solicitud de recarga de saldo ha sido aprobada</p>
                <br>
                <h3><small>Monto Acreditado</small></h3>
                <h2><small><cite title="${monto}">${monto}</cite></small></h2>
                <br>
                <small>Fecha: <cite title="${fecha_sistema}">${fecha_sistema}</cite></small>
                <br>
            </blockquote>
        </td>
    </tr>
    `;

    Utilitys.SendEmailGeneral(correos, asunto, html);
}


module.exports = {
    ListarCuenta,
    ListarCanalPago,
    ListarCanalPago,
    GuardarSolicitudPago,
    RecargaSaldoVerificar,
    RecargaSaldoRechazar,
    RecargaSaldoAprobar
};