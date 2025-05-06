 
class RecargasResponseModel {
  CodigoResultado = '';

  CodigoPago = '';
  CodigoTraceTrx = '';
  CodigoTransaccion = '';

  Mensaje = '';
  FechaHoraTransaccion = '';
  FechaCierre = '';
  FechaCompensacion = '';
  OperadoPor = '';
  Terminal = '';
  Producto = '';
  UrlFactura = '';
  XMLRecibo = '';
  HTMLRecibo = '';
  IdTransaccion = '';

  DetallesPagos = [];

   constructor (data) {
    let RecargasResponse = data.RecargasResponse[0];
    let RecargasResult = RecargasResponse.RecargasResult[0];

    this.CodigoResultado = RecargasResult['a:CodigoResultado'][0];
    this.Mensaje = RecargasResult['a:Mensaje'][0];
    this.FechaHoraTransaccion = RecargasResult['a:FechaHoraTransaccion'][0];

    if (this.CodigoResultado == '000') {
      this.CodigoPago = RecargasResult['a:CodigoPago'][0];
      this.CodigoTraceTrx = RecargasResult['a:CodigoTraceTrx'][0];
      this.CodigoTransaccion = RecargasResult['a:CodigoTransaccion'][0];

      this.IdTransaccion = RecargasResult['a:IDTransaccion'][0];
      this.FechaCierre = RecargasResult['a:FechaCierre'][0];
      this.FechaCompensacion = RecargasResult['a:FechaCompensacion'][0];

      this.OperadoPor = RecargasResult['a:OperadoPor'][0];
      this.Terminal = RecargasResult['a:Terminal'][0];
      this.Producto = RecargasResult['a:Producto'][0];
      this.UrlFactura = RecargasResult['a:UrlFactura'][0];

      let DataPago = RecargasResult['a:DataPago'][0]['a:INT_ResplyRecargas.INT_DataPago'];
      for (let index = 0; index < DataPago.length; index++) {
        let dataDetalle = DataPago[index];

        let detalle = new DetallesPagosModel(dataDetalle);
        this.DetallesPagos.push(detalle);
      }

      this.XMLRecibo = RecargasResult['a:XMLRecibo'][0]; 

    }
  }
}

class DetallesPagosModel {
  CodigoAutorizacion = '';
  Factura = '';
  IdRubro = '';
  SecuenciaAdquirente = '';
  SecuenciaSwitch = '';

  constructor(data) {
    this.CodigoAutorizacion = data['a:CodigoAutorizacion'][0];
    this.Factura = data['a:Factura'][0];
    this.IdRubro = data['a:IDRubro'][0];
    this.SecuenciaAdquirente = data['a:SecuenciaAdquirente'][0];
    this.SecuenciaSwitch = data['a:SecuenciaSwitch'][0];
  }
}
module.exports = RecargasResponseModel;
