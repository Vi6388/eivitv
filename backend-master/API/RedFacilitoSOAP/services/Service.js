const { ConsumirSOAP, XmltoJson } = require('./UtilidadWS');
const ResponseModel = require('../models/ResponseModel');

const ConfiguracionFacilitoModel = require('../models/ConfiguracionFacilitoModel ');

const ConsultaResponseModel = require('../models/ConsultaResponseModel');
const PagoResponseModel = require('../models/PagoResponseModel');
const RecargaResponseModel = require('../models/RecargaResponseModel');
const ConsultaCupoResponseModel = require('../models/ConsultaCupoResponseModel');
const ConsultaEntidadesCIResponseModel = require('../models/ConsultaEntidadesCIResponseModel');

const ConsultaRequestModel = require('../models/ConsultaRequestModel');
const PagoRequestModel = require('../models/PagoRequestModel');
const RecargaRequestModel = require('../models/RecargaRequestModel');
const ConsultaCupoRequestModel = require('../models/ConsultaCupoRequestModel');
const ConsultaEntidadesCIRequestModel = require('../models/ConsultaEntidadesCIRequestModel');




const Utilitys = require("../../../utils/Utilitys");
const ConnectionBD = require('../../../config/ConnectionPG');
const ServiceSaldos = require('../../Saldos/services/Service');
const ServiceParametro = require('../../Parametros/services/Service');

async function CargarConfiguracionRedFacilito() {
  let configuracion = new ConfiguracionFacilitoModel();
  let objCabeceraParametro = await ServiceParametro.getCabecera({ nombre: "CREDENCIALES_RED_FACILITO" });
  let id_parametro_cab = objCabeceraParametro.id;
  let objCanal = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: "canal" });
  let objUsuario = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: "usuario" });
  let objClave = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: "clave" });
  let objEntidad = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: "entidad" });
  let objAgencia = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: "agencia" });
  let objTokenData = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: "token_data" });
  let objUrlApi = await ServiceParametro.getDetalle({ id_parametro_cab, codigo: "url_api" });

  configuracion.setCanal(objCanal.valor);
  configuracion.setUsuario(objUsuario.valor);
  configuracion.setClave(objClave.valor);
  configuracion.setIdEntidad(objEntidad.valor);
  configuracion.setIdAgencia(objAgencia.valor);
  configuracion.setTokenData(objTokenData.valor);
  configuracion.setUrlApi(objUrlApi.valor);

  return configuracion;

}

async function Consulta(req) {


  let objResponse = new ResponseModel();
  let objRequest = new ConsultaRequestModel(req.body);
  let identidadProducto = objRequest.IdentidadProducto;
  let referencia = objRequest.Referencia;

  try {
    let configuracion = await CargarConfiguracionRedFacilito();
    let metodo = 'Consulta';
    let url = configuracion.getUrlApi();
    let xmlBody = `    
    <tem:Consulta> 
      <tem:RequestConsulta>
        <sw:Canal>${configuracion.getCanal()}</sw:Canal>
        <sw:DatosSeguridad>
            <sw:Clave>${configuracion.getClave()}</sw:Clave>
            <sw:TokenData>${configuracion.getTokenData()}</sw:TokenData>
            <sw:Usuario>${configuracion.getUsuario()}</sw:Usuario>
        </sw:DatosSeguridad>
        <sw:IDAgencia>${configuracion.getIdAgencia()}</sw:IDAgencia>
        <sw:IDEntidad>${configuracion.getIdEntidad()}</sw:IDEntidad>
        <sw:IDProducto>${identidadProducto}</sw:IDProducto> 
        <sw:Referencia>${referencia}</sw:Referencia>
        <sw:XmlAdd></sw:XmlAdd>
      </tem:RequestConsulta>
    </tem:Consulta>
    `;

    let objResponseSoap = await ConsumirSOAP({ url, metodo, xmlBody });
    objResponse.status = objResponseSoap.status;
    objResponse.message = objResponseSoap.message;
    if (objResponseSoap.status == 200) {
      let objConsulta = new ConsultaResponseModel(objResponseSoap.result);
      objResponse.data = objConsulta;
    }
  } catch (error) {
    objResponse.status = 403;
    objResponse.message = error.message;
  }

  return objResponse;
}

async function Pago(req) {
  let objResponse = new ResponseModel();
  let objRequest = new PagoRequestModel(req.body);
  let usuario = req.usuario;
  let idUsuario = usuario.id;
  let fechaCreacion = new Date();
  let codigo = await Utilitys.GenerateKey(8);
  let idTipoPago = objRequest.IdTipoPago;
  let idProducto = objRequest.IdProducto;
  let identidadProducto = objRequest.IdentidadProducto;
  let referencia = objRequest.Referencia;
  let nombre = objRequest.Nombre;

  try {
    let configuracion = await CargarConfiguracionRedFacilito();
    let url = configuracion.getUrlApi();
    let metodo = 'Pago';
    let html_pagos = '';
    let costoTotal = 0;
    let comisionTotal = 0;
    for (let index = 0; index < objRequest.DetallesRubros.length; index++) {
      const el = objRequest.DetallesRubros[index];
      costoTotal = costoTotal + el.ValorConComision;
      comisionTotal = comisionTotal + el.Comision;
      html_pagos =
        html_pagos +
        ` 
        <sw:INT_RequestPago.INT_DataPago>
          <sw:IDRubro>${el.IdRubro}</sw:IDRubro>
          <sw:ValorConComision>${el.ValorConComision}</sw:ValorConComision> 
        </sw:INT_RequestPago.INT_DataPago>
      `;
    }



    let validaSaldo = await validarSaldoDisponible(req, costoTotal, idTipoPago);

    if (validaSaldo == "") {
      let xmlBody = `    
    <tem:Pago> 
      <tem:RequestPago>   
          <sw:Canal>${configuracion.getCanal()}</sw:Canal>      
          <sw:DataPago> 
             ${html_pagos}
          </sw:DataPago> 
          <sw:DatosFactura>${objRequest.DatosFactura}</sw:DatosFactura> 
          <sw:DatosSeguridad> 
              <sw:Clave>${configuracion.getClave()}</sw:Clave>
              <sw:TokenData>${configuracion.getTokenData()}</sw:TokenData>
              <sw:Usuario>${configuracion.getUsuario()}</sw:Usuario>
          </sw:DatosSeguridad> 
          <sw:IDTransaccion>${objRequest.IdTransaccion}</sw:IDTransaccion> 
          <sw:XmlAdd></sw:XmlAdd>
      </tem:RequestPago>
    </tem:Pago> 
    `;
      let objResponseSoap = await ConsumirSOAP({ url, metodo, xmlBody });
      objResponse.status = objResponseSoap.status;
      objResponse.message = objResponseSoap.message;
      if (objResponseSoap.status == 200) {
        let objConsulta = new PagoResponseModel(objResponseSoap.result);

        if (objConsulta.CodigoResultado == '000') {

          await ConnectionBD.knex.transaction(async function (trx) {
            //****SERIALIZAR RECIBO */

            let ObjetoJson = {};
            if (objConsulta.XMLRecibo) {
              ObjetoJson = await XmltoJson(objConsulta.XMLRecibo);
              let Comprobante = ObjetoJson['COMPROBANTE'];
              let Recibo = Comprobante['RECIBO'][0];
              let HTMLRecibo = "";
              const keys = Object.keys(Recibo);
              for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                let html = "<p class=\"font\">" + Recibo[key] + "</p>";
                HTMLRecibo = HTMLRecibo + html;

              }

              objConsulta.HTMLRecibo = HTMLRecibo;
            }

            //****CREAR REGISTRO DE VENTA */
            let descripcion = referencia + '|' + nombre;
            let dataVentaCab = {
              id_vendedor: idUsuario,
              id_cliente: null,
              codigo: codigo,
              numero_factura: objRequest.IdTransaccion,
              observacion: objRequest.DatosFactura,
              descripcion: descripcion,
              fecha: fechaCreacion,
              json_detalles: JSON.stringify(ObjetoJson),
              estado: 1,
              created_at: fechaCreacion,
              updated_at: fechaCreacion
            };

            let objVentaCab = await ConnectionBD.knex('venta_cabecera')
              .transacting(trx)
              .returning('*')
              .insert(dataVentaCab);
            objVentaCab = objVentaCab[0];

            for (let index = 0; index < objRequest.DetallesRubros.length; index++) {
              const el = objRequest.DetallesRubros[index];
              let dataVentaDet = {
                id_venta_cab: objVentaCab.id,
                id_producto: idProducto,
                observacion: el.IdRubro,
                descripcion: el.Descripcion,
                valor: parseFloat(el.Valor).toFixed(4),
                comision: parseFloat(el.Comision).toFixed(4),
                total: parseFloat(el.ValorConComision).toFixed(4),
                json_detalles: JSON.stringify(el),
                estado: 1,
                created_at: fechaCreacion,
                updated_at: fechaCreacion

              };

              let objVentaDet = await ConnectionBD.knex('venta_detalle')
                .transacting(trx)
                .returning('*')
                .insert(dataVentaDet);
            }

            //**CALCULAR COMISIONES */

            let objProducto = await ConnectionBD.knex('producto')
              .returning('*')
              .where({ id: idProducto });

            objProducto = objProducto[0];
            let observacion = "Transacción:" + codigo;
            let tipoComision = objProducto.comision_tipo || 0;
            let aplicaComison = objProducto.comision_aplica || 0;
            let comisionVenta = parseFloat(objProducto.comision_venta) || 0;
            let comisionUsuario = 0;
            let comisionSistema = 0;
            if (aplicaComison == 1) {
              switch (tipoComision) {
                case 0://POR VALOR FIJO
                  //NOTA: si la comisionVenta excede la comisionTotal la comision cera 0
                  comisionUsuario = comisionTotal >= comisionVenta ? comisionVenta : 0;
                  break;

                case 1://POR PROCENTAJE 
                  comisionUsuario = comisionTotal * (comisionVenta / 100);
                  break;
              }

            }
            comisionSistema = comisionTotal - comisionUsuario;

            //**REGISTRAR COMISIONES */
            let idUsuarioSistema = 1;
            await ServiceSaldos.actualizarComision(trx, idUsuarioSistema, comisionSistema, 1, observacion);


            //**DESCONTAR SALDOS DEL VENDEDOR*/
            switch (idTipoPago) {
              case 1:
                await ServiceSaldos.actualizarSaldo(trx, idUsuario, costoTotal, 2, observacion);

                await ServiceSaldos.actualizarComision(trx, idUsuario, comisionUsuario, 1, observacion);
                break;

              case 2:
                await ServiceSaldos.actualizarComision(trx, idUsuario, costoTotal, 2, observacion);
                break;
            }

            //xxxxxxxxxxxxxxxx

          }).then(async function (res) {
            objResponse.data = objConsulta;
            console.log('Transaction complete.');
          }).catch(function (err) {
            console.error(err);
          });

        } else {
          objResponse.status = 403;
          objResponse.message = objConsulta.Mensaje;
        }


      }

    } else {
      objResponse.status = 403;
      objResponse.message = validaSaldo;
    }
  } catch (error) {
    objResponse.status = 403;
    objResponse.message = error.message;
    console.log(error);
  }

  return objResponse;
}

async function Recargar(req) {
  let objResponse = new ResponseModel();
  let objRequest = new RecargaRequestModel(req.body);
  let usuario = req.usuario;
  let idUsuario = usuario.id;
  let fechaCreacion = new Date();
  let codigo = await Utilitys.GenerateKey(8);
  let idTipoPago = objRequest.IdTipoPago;
  let idProducto = objRequest.IdProducto;
  let identidadProducto = objRequest.IdentidadProducto;
  let referencia = objRequest.Referencia;
  let cantidad = objRequest.Cantidad;
  try {
    let configuracion = await CargarConfiguracionRedFacilito();
    let url = configuracion.getUrlApi();
    let metodo = 'Recargas';
    let costoTotal = cantidad;
    let comisionTotal = 0;
    let valorConComision = costoTotal + comisionTotal;


    let validaSaldo = await validarSaldoDisponible(req, costoTotal, idTipoPago);

    if (validaSaldo == "") {
      let xmlBody = `    
    <tem:Recargas> 
      <tem:RequestPago>   
          <sw:Canal>${configuracion.getCanal()}</sw:Canal>   
          <sw:DatosFactura>${objRequest.DatosFactura}</sw:DatosFactura> 
          <sw:DatosSeguridad> 
              <sw:Clave>${configuracion.getClave()}</sw:Clave>
              <sw:TokenData>${configuracion.getTokenData()}</sw:TokenData>
              <sw:Usuario>${configuracion.getUsuario()}</sw:Usuario>
          </sw:DatosSeguridad> 
          <sw:IDAgencia>${configuracion.getIdAgencia()}</sw:IDAgencia>
          <sw:IDEntidad>${configuracion.getIdEntidad()}</sw:IDEntidad>
          <sw:IDProducto>${identidadProducto}</sw:IDProducto>
          <sw:Referencia>${referencia}</sw:Referencia>
          <sw:ValorConComision>${valorConComision}</sw:ValorConComision>
          <sw:XmlAdd></sw:XmlAdd>
      </tem:RequestPago>
    </tem:Recargas> 
    `;
      let objResponseSoap = await ConsumirSOAP({ url, metodo, xmlBody });
      objResponse.status = objResponseSoap.status;
      objResponse.message = objResponseSoap.message;
      if (objResponseSoap.status == 200) {
        let objConsulta = new RecargaResponseModel(objResponseSoap.result);

        await ConnectionBD.knex.transaction(async function (trx) {
          //****SERIALIZAR RECIBO */

          let ObjetoJson = {};
          if (objConsulta.XMLRecibo) {
            ObjetoJson = await XmltoJson(objConsulta.XMLRecibo);
            let Comprobante = ObjetoJson['COMPROBANTE'];
            let Recibo = Comprobante['RECIBO'][0];
            let HTMLRecibo = "";
            const keys = Object.keys(Recibo);
            for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              let html = "<p class=\"font\">" + Recibo[key] + "</p>";
              HTMLRecibo = HTMLRecibo + html;

            }

            objConsulta.HTMLRecibo = HTMLRecibo;
          }

          //****CREAR REGISTRO DE VENTA */
          let descripcion = referencia + '|' + cantidad;
          let dataVentaCab = {
            id_vendedor: idUsuario,
            id_cliente: null,
            codigo: codigo,
            numero_factura: objRequest.IdTransaccion,
            observacion: objRequest.DatosFactura,
            descripcion: descripcion,
            fecha: fechaCreacion,
            json_detalles: JSON.stringify(ObjetoJson),
            estado: 1,
            created_at: fechaCreacion,
            updated_at: fechaCreacion
          };

          let objVentaCab = await ConnectionBD.knex('venta_cabecera')
            .transacting(trx)
            .returning('*')
            .insert(dataVentaCab);
          objVentaCab = objVentaCab[0];


          let dataVentaDet = {
            id_venta_cab: objVentaCab.id,
            id_producto: idProducto,
            observacion: "",
            descripcion: "",
            valor: 0,
            comision: 0,
            total: 0,
            json_detalles: "",
            estado: 1,
            created_at: fechaCreacion,
            updated_at: fechaCreacion

          };

          let objVentaDet = await ConnectionBD.knex('venta_detalle')
            .transacting(trx)
            .returning('*')
            .insert(dataVentaDet);


          //**CALCULAR COMISIONES */

          let objProducto = await ConnectionBD.knex('producto')
            .returning('*')
            .where({ id: idProducto });

          objProducto = objProducto[0];
          let observacion = "Transacción:" + codigo;
          let tipoComision = objProducto.comision_tipo || 0;
          let aplicaComison = objProducto.comision_aplica || 0;
          let comisionVenta = parseFloat(objProducto.comision_venta) || 0;
          let comisionUsuario = 0;
          let comisionSistema = 0;
          if (aplicaComison == 1) {
            switch (tipoComision) {
              case 0://POR VALOR FIJO
                //NOTA: si la comisionVenta excede la comisionTotal la comision cera 0
                comisionUsuario = comisionTotal >= comisionVenta ? comisionVenta : 0;
                break;

              case 1://POR PROCENTAJE 
                comisionUsuario = comisionTotal * (comisionVenta / 100);
                break;
            }

          }
          comisionSistema = comisionTotal - comisionUsuario;

          //**REGISTRAR COMISIONES */
          let idUsuarioSistema = 1;
          await ServiceSaldos.actualizarComision(trx, idUsuarioSistema, comisionSistema, 1, observacion);


          //**DESCONTAR SALDOS DEL VENDEDOR*/
          switch (idTipoPago) {
            case 1:
              await ServiceSaldos.actualizarSaldo(trx, idUsuario, costoTotal, 2, observacion);

              await ServiceSaldos.actualizarComision(trx, idUsuario, comisionUsuario, 1, observacion);
              break;

            case 2:
              await ServiceSaldos.actualizarComision(trx, idUsuario, costoTotal, 2, observacion);
              break;
          }



          //xxxxxxxxxxxxxxxx


        }).then(async function (res) {
          objResponse.data = objConsulta;
          console.log('Transaction complete.');
        }).catch(function (err) {
          console.error(err);
        });



      }

    } else {
      objResponse.status = 403;
      objResponse.message = validaSaldo;
    }
  } catch (error) {
    objResponse.status = 403;
    objResponse.message = error.message;
    console.log(error);
  }

  return objResponse;
}


async function Contratar(req) {
  let objResponse = new ResponseModel();
  let objRequest = new RecargaRequestModel(req.body);
  let usuario = req.usuario;
  let idUsuario = usuario.id;
  let idRol = usuario.id_rol;
  let fechaCreacion = new Date();
  let fecha = fechaCreacion.toLocaleDateString();
  let hora = fechaCreacion.toLocaleTimeString();

  let codigo = await Utilitys.GenerateKey(8);

  let idTipoPago = objRequest.IdTipoPago;
  let idCatalogo = objRequest.Referencia;
  let idProducto = objRequest.IdProducto;


  try {


    let objCatalogo = await ConnectionBD.knex("catalogo_venta")
      .select([
        'id',
        'id_producto',
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
      .where({ id: idCatalogo, id_producto: idProducto, tipo_vendedor: idRol, estado: 1 })
      .first();

    if (!objCatalogo) {
      throw new Error("No se encontro registro de catalogo.");
    }


    let objProducto = await ConnectionBD.knex('producto')
      .select('*')
      .where({ id: idProducto })
      .first();

    if (!objProducto) {
      throw new Error("No se encontro registro de producto.");
    }


    let reqPerfiles = objCatalogo.perfiles;
    let reqTipoDuracion = objCatalogo.tipo_duracion;
    let reqCantidaDuracion = objCatalogo.cantidad_duracion;

    let objDigital = await getCuentaRecomendada({ reqPerfiles, reqTipoDuracion, reqCantidaDuracion, idProducto });


    let duracion = Utilitys.getTipoDuracion(reqTipoDuracion, reqCantidaDuracion);
    let descripcion = `${reqPerfiles} perfiles por ${reqCantidaDuracion} ${duracion}`;


    let metodo = 'Digital';
    let valorConComision = objCatalogo.precio || 0;
    let comisionTotal = objCatalogo.comision || 0;
    let costoTotal =valorConComision ;

    let htmlCredenciales = "<h4>Credenciales</h4>";
    if (objDigital.codigo) {
      htmlCredenciales += `<p><strong>Codigo:</strong>${objDigital.codigo}</p>`;
    }
    if (objDigital.credencial_usuario) {
      htmlCredenciales += `<p><strong>Usuario:</strong>${objDigital.credencial_usuario}</p>`;
    }
    if (objDigital.credencial_pin) {
      htmlCredenciales += `<p><strong>Pin:</strong>${objDigital.credencial_pin}</p>`;
    }
    if (objDigital.credencial_clave) {
      htmlCredenciales += `<p><strong>Clave:</strong>${objDigital.credencial_clave}</p>`;
    }
    if (objDigital.numero_perfile) {
      htmlCredenciales += `<p><strong>Numero de Perfiles:</strong>${objDigital.numero_perfile}</p>`;
    }

    let titlulo = objProducto.recibo_titulo || "Recibo de venta";
    let comprobante = `
    <div>
    <h4>${titlulo}</h4>    
    <p><strong>Agente: </strong>${usuario.codigo}</p>
    <p><strong>Fecha: </strong>${fecha}</p>
    <p><strong>Hora: </strong>${hora}</p>
    <p><strong>Transacción: </strong>${codigo}</p>

    <p><strong>Producto Digital: </strong>${objProducto.nombre}</p>  
    <p><strong>Descripción: </strong>${descripcion}</p> 
    <p><strong>Total: </strong> ${valorConComision}</p> 

   ${htmlCredenciales}

    <p><strong>Recomendación: </strong>${objProducto.info_add}</p>

</div>
`;



    let validaSaldo = await validarSaldoDisponible(req, costoTotal, idTipoPago);

    if (validaSaldo != "") {
      objResponse.status = 403;
      throw new Error(validaSaldo);
    }

    let objConsulta = {};

    await ConnectionBD.knex.transaction(async function (trx) {
      //****SERIALIZAR RECIBO */

      objConsulta.HTMLRecibo = comprobante;
      objConsulta.OperadoPor = "AKA PAGO";
      objConsulta.Mensaje = "Transacción realizada correctamente";

      //****CREAR REGISTRO DE VENTA */ 
      let dataVentaCab = {
        id_vendedor: idUsuario,
        id_cliente: null,
        codigo: codigo,
        numero_factura: "00000",
        observacion: objRequest.DatosFactura,
        descripcion: descripcion,
        fecha: fechaCreacion,
        //    json_detalles: JSON.stringify(ObjetoJson),
        estado: 1,
        created_at: fechaCreacion,
        updated_at: fechaCreacion
      };

      let objVentaCab = await ConnectionBD.knex('venta_cabecera')
        .transacting(trx)
        .returning('*')
        .insert(dataVentaCab);
      objVentaCab = objVentaCab[0];


      let dataVentaDet = {
        id_venta_cab: objVentaCab.id,
        id_producto: idProducto,
        observacion: "",
        descripcion: "",
        valor: costoTotal,
        comision: comisionTotal,
        total: valorConComision,
        json_detalles: "",
        estado: 1,
        created_at: fechaCreacion,
        updated_at: fechaCreacion

      };

      let objVentaDet = await ConnectionBD.knex('venta_detalle')
        .transacting(trx)
        .returning('*')
        .insert(dataVentaDet);


      //**CALCULAR COMISIONES */

      let observacion = "Transacción:" + codigo;
      let tipoComision = objProducto.comision_tipo || 0;
      let aplicaComison = objProducto.comision_aplica || 0;
      let comisionVenta = parseFloat(comisionTotal) || 0;
      let comisionUsuario = 0;
      let comisionSistema = 0;
      if (aplicaComison == 1) {
        switch (tipoComision) {
          case 0://POR VALOR FIJO
            //NOTA: si la comisionVenta excede la comisionTotal la comision cera 0
            comisionUsuario = comisionTotal >= comisionVenta ? comisionVenta : 0;
            break;

          case 1://POR PROCENTAJE 
            comisionUsuario = comisionTotal * (comisionVenta / 100);
            break;
        }

      }
      comisionSistema = comisionTotal - comisionUsuario;

      //**REGISTRAR COMISIONES */
      let idUsuarioSistema = 1;
      await ServiceSaldos.actualizarComision(trx, idUsuarioSistema, comisionSistema, 1, observacion);


      //**DESCONTAR SALDOS DEL VENDEDOR*/
      switch (idTipoPago) {
        case 1:
          await ServiceSaldos.actualizarSaldo(trx, idUsuario, costoTotal, 2, observacion);

          await ServiceSaldos.actualizarComision(trx, idUsuario, comisionUsuario, 1, observacion);
          break;

        case 2:
          await ServiceSaldos.actualizarComision(trx, idUsuario, costoTotal, 2, observacion);
          break;
      }


      //xxxxxxxxxxxxxxxx


    }).then(async function (res) {
      objResponse.data = objConsulta;
      console.log('Transaction complete.');
    }).catch(function (err) {
      console.error(err);
    });



  } catch (error) {
    objResponse.status = 403;
    objResponse.message = error.message;
    console.log(error);
  }

  return objResponse;
}


async function getCuentaRecomendada(params) {
  const { reqPerfiles, reqTipoDuracion, reqCantidaDuracion, idProducto } = params;
  let objCuenta;
  let arrayDigital = await ConnectionBD.knex("digital")
    .select([
      "id as id_digital",
      "id_producto",
      "codigo",
      "proveedor",
      "nombre",
      "descripcion",
      "costo",
      "credencial_usuario",
      "credencial_clave",
      "credencial_pin",
      "observacion",
      "numero_perfil",
      "fecha_valides_inicio",
      "fecha_valides_fin",
      "estado",
      "created_at",
      "updated_at",
      "referencias",
      ConnectionBD.knex.raw("EXTRACT(DAY FROM (fecha_valides_fin - fecha_valides_inicio)) as duracion")
    ])
    .orderBy("numero_perfil", "asc")
    .orderBy("duracion", "asc")
    .where({ id_producto: idProducto, estado: 1 });




  let reqDuracionDias = 0;
  switch (reqTipoDuracion) {
    case 1:
      reqDuracionDias = reqCantidaDuracion * 1;
      break;
    case 2:
      reqDuracionDias = reqCantidaDuracion * 30;
      break;
    case 3:
      reqDuracionDias = reqCantidaDuracion * 365;
      break;
  }

  for (let index = 0; index < arrayDigital.length; index++) {
    const cuenta = arrayDigital[index];
    let perfiles = cuenta.numero_perfil;
    let duracion = cuenta.duracion;

    //validar que sea estrictamente  cantidad de dias 

    if (reqPerfiles <= perfiles) {
      if (reqDuracionDias <= duracion) {
        objCuenta = cuenta;
        index=  arrayDigital.length; 
      }
    }
  }


  if (!objCuenta) {
    throw new Error("No se encontraron cuentas disponibles.");
  }
  return objCuenta;
}

async function validarSaldoDisponible(req, costoTotal, idTipoPago) {
  const SaldosResponseModel = require('../../Saldos/models/SaldosResponseModel');
  let objDataSaldo = await ServiceSaldos.visualizarCupos(req);
  let dataSaldos = new SaldosResponseModel(objDataSaldo.data);
  let response = "";
  switch (idTipoPago) {
    case 1:
      //valida el saldo total
      let saldo = parseFloat(dataSaldos.total_saldo);
      if (saldo <= costoTotal) {
        response = `Su saldo actual es ${saldo} y es insuficiente para realizar el pago de ${costoTotal} .`;
      }

      break;

    case 2:
      //valida el saldo de comisiones
      let comision = parseFloat(dataSaldos.total_comision);
      if (comision <= costoTotal) {
        response = `Su saldo de comisiones es ${comision} y es insuficiente para realizar el pago de ${costoTotal} .`;
      }

      break;
    default:
      response = "Tipo de pago no valido.";
      break;
  }

  return response;

}

//REVERSAR
async function Reversar(req) {
  let objResponse = new ResponseModel();
  let objRequest = new PagoRequestModel(req.body);
  let usuario = req.usuario;
  let idUsuario = usuario.id;
  let fechaCreacion = new Date();
  let codigo = await Utilitys.GenerateKey(8);
  let idTipoPago = objRequest.IdTipoPago;
  let idProducto = objRequest.IdProducto;
  try {
    let configuracion = await CargarConfiguracionRedFacilito();

    let metodo = 'Pago';
    let html_pagos = '';
    let costoTotal = 0;
    let comisionTotal = 0;
    for (let index = 0; index < objRequest.DetallesRubros.length; index++) {
      const el = objRequest.DetallesRubros[index];
      costoTotal = costoTotal + el.ValorConComision;
      comisionTotal = comisionTotal + el.Comision;
      html_pagos =
        html_pagos +
        ` 
        <sw:INT_RequestPago.INT_DataPago>
          <sw:IDRubro>${el.IdRubro}</sw:IDRubro>
          <sw:ValorConComision>${el.ValorConComision}</sw:ValorConComision> 
        </sw:INT_RequestPago.INT_DataPago>
      `;
    }



    let validaSaldo = await validarSaldoDisponible(req, costoTotal, idTipoPago);

    if (validaSaldo == "") {
      let xmlBody = `    
    <tem:Pago> 
      <tem:RequestPago>   
          <sw:Canal>${configuracion.getCanal()}</sw:Canal>      
          <sw:DataPago> 
             ${html_pagos}
          </sw:DataPago> 
          <sw:DatosFactura>${objRequest.DatosFactura}</sw:DatosFactura> 
          <sw:DatosSeguridad> 
              <sw:Clave>${configuracion.getClave()}</sw:Clave>
              <sw:TokenData>${configuracion.getTokenData()}</sw:TokenData>
              <sw:Usuario>${configuracion.getUsuario()}</sw:Usuario>
          </sw:DatosSeguridad> 
          <sw:IDTransaccion>${objRequest.IdTransaccion}</sw:IDTransaccion> 

          <sw:XmlAdd></sw:XmlAdd>
      </tem:RequestPago>
    </tem:Pago> 
    `;
      let objResponseSoap = await ConsumirSOAP({ metodo, xmlBody });
      objResponse.status = objResponseSoap.status;
      objResponse.message = objResponseSoap.message;
      if (objResponseSoap.status == 200) {
        let objConsulta = new PagoResponseModel(objResponseSoap.result);

        await ConnectionBD.knex.transaction(async function (trx) {
          //****SERIALIZAR RECIBO */

          let ObjetoJson = {};
          if (objConsulta.XMLRecibo) {
            ObjetoJson = await XmltoJson(objConsulta.XMLRecibo);
            let Comprobante = ObjetoJson['COMPROBANTE'];
            let Recibo = Comprobante['RECIBO'][0];
            let HTMLRecibo = "";
            const keys = Object.keys(Recibo);
            for (let i = 0; i < keys.length; i++) {
              const key = keys[i];
              let html = "<p class=\"font\">" + Recibo[key] + "</p>";
              HTMLRecibo = HTMLRecibo + html;

            }

            objConsulta.HTMLRecibo = HTMLRecibo;
          }

          //****CREAR REGISTRO DE VENTA */
          // agregar estadpo que indique q se reverso
          let descripcion = objRequest.Identificacion + '|' + objRequest.Nombre;
          let dataVentaCab = {
            id_vendedor: idUsuario,
            id_cliente: null,
            codigo: codigo,
            numero_factura: objRequest.IdTransaccion,
            observacion: objRequest.DatosFactura,
            descripcion: descripcion,
            fecha: fechaCreacion,
            json_detalles: JSON.stringify(ObjetoJson),
            estado: 1,
            created_at: fechaCreacion,
            updated_at: fechaCreacion
          };

          let objVentaCab = await ConnectionBD.knex('venta_cabecera')
            .transacting(trx)
            .returning('*')
            .insert(dataVentaCab);
          objVentaCab = objVentaCab[0];

          for (let index = 0; index < objRequest.DetallesRubros.length; index++) {
            const el = objRequest.DetallesRubros[index];
            let dataVentaDet = {
              id_venta_cab: objVentaCab.id,
              id_producto: idProducto,
              observacion: el.IdRubro,
              descripcion: el.Descripcion,
              valor: parseFloat(el.Valor).toFixed(4),
              comision: parseFloat(el.Comision).toFixed(4),
              total: parseFloat(el.ValorConComision).toFixed(4),
              json_detalles: JSON.stringify(el),
              estado: 1,
              created_at: fechaCreacion,
              updated_at: fechaCreacion

            };

            let objVentaDet = await ConnectionBD.knex('venta_detalle')
              .transacting(trx)
              .returning('*')
              .insert(dataVentaDet);
          }

          //**CALCULAR COMISIONES */

          let objProducto = await ConnectionBD.knex('producto')
            .returning('*')
            .where({ id: idProducto });

          objProducto = objProducto[0];
          let observacion = "Transacción:" + codigo;
          let tipoComision = objProducto.comision_tipo || 0;
          let aplicaComison = objProducto.comision_aplica || 0;
          let comisionVenta = parseFloat(objProducto.comision_venta) || 0;
          let comisionUsuario = 0;
          let comisionSistema = 0;
          if (aplicaComison == 1) {
            switch (tipoComision) {
              case 0://POR VALOR FIJO
                //NOTA: si la comisionVenta excede la comisionTotal la comision cera 0
                comisionUsuario = comisionTotal >= comisionVenta ? comisionVenta : 0;
                break;

              case 1://POR PROCENTAJE 
                comisionUsuario = comisionTotal * (comisionVenta / 100);
                break;
            }

          }
          comisionSistema = comisionTotal - comisionUsuario;

          //**REGISTRAR COMISIONES */
          let idUsuarioSistema = 1;
          await ServiceSaldos.actualizarComision(trx, idUsuarioSistema, comisionSistema, 1, observacion);


          //**DESCONTAR SALDOS DEL VENDEDOR*/
          switch (idTipoPago) {
            case 1:
              await ServiceSaldos.actualizarSaldo(trx, idUsuario, costoTotal, 2, observacion);

              await ServiceSaldos.actualizarComision(trx, idUsuario, comisionUsuario, 1, observacion);
              break;

            case 2:
              await ServiceSaldos.actualizarComision(trx, idUsuario, costoTotal, 2, observacion);
              break;
          }



          //xxxxxxxxxxxxxxxx


        }).then(async function (res) {
          objResponse.data = objConsulta;
          console.log('Transaction complete.');
        }).catch(function (err) {
          console.error(err);
        });



      }

    } else {
      objResponse.status = 403;
      objResponse.message = validaSaldo;
    }
  } catch (error) {
    objResponse.status = 403;
    objResponse.message = error.message;
    console.log(error);
  }

  return objResponse;
}


//REVISAR
async function ConsultarCupo(req) {
  let objResponse = new ResponseModel();
  let objRequest = new ConsultaCupoRequestModel(req.body);
  try {
    let metodo = 'ConsultaCupo';
    let xmlBody = `    
        <tem:ConsultaCupo> 
          <tem:RQ> 
            <sw:Id_Institucion>${objRequest.Id_Institucion}</sw:Id_Institucion> 
            <sw:Token>${objRequest.Token}</sw:Token>
          </tem:RQ>
        </tem:ConsultaCupo>
    `;

    let objResponseSoap = await ConsumirSOAP({ metodo, xmlBody });
    objResponse.status = objResponseSoap.status;
    objResponse.message = objResponseSoap.message;
    if (objResponseSoap.status == 200) {
      let objConsulta = new ConsultaCupoResponseModel(objResponseSoap.result);
      objResponse.data = objConsulta;
    }
  } catch (error) {
    objResponse.status = 403;
    objResponse.message = error.message;
  }

  return objResponse;
}

async function ConsultarEntidadesCI(req) {
  let objResponse = new ResponseModel();
  let objRequest = new ConsultaEntidadesCIRequestModel(req.body);
  try {
    let metodo = 'ConsultasEntidadesCI';
    let xmlBody = `    
    <tem:ConsultasEntidadesCI> 
     <tem:TipoTrx>${objRequest.TipoTrx}</tem:TipoTrx>
    </tem:ConsultasEntidadesCI>
    `;

    let objResponseSoap = await ConsumirSOAP({ metodo, xmlBody });
    objResponse.status = objResponseSoap.status;
    objResponse.message = objResponseSoap.message;
    if (objResponseSoap.status == 200) {
      let objConsulta = new ConsultaEntidadesCIResponseModel(
        objResponseSoap.result
      );
      objResponse.data = objConsulta;
    }
  } catch (error) {
    objResponse.status = 403;
    objResponse.message = error.message;
  }

  return objResponse;
}

module.exports = {
  Consulta,
  Pago,
  Recargar,
  Contratar,
  Reversar,
  ConsultarCupo,
  ConsultarEntidadesCI,
};
