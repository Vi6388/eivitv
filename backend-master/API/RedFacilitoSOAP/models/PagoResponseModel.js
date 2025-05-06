 
class PagoResponseModel {
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
    let PagoResponse = data.PagoResponse[0];
    let PagoResult = PagoResponse.PagoResult[0];

    this.CodigoResultado = PagoResult['a:CodigoResultado'][0];
    this.Mensaje = PagoResult['a:Mensaje'][0];
    this.FechaHoraTransaccion = PagoResult['a:FechaHoraTransaccion'][0];

    if (this.CodigoResultado == '000') {
      this.CodigoPago = PagoResult['a:CodigoPago'][0];
      this.CodigoTraceTrx = PagoResult['a:CodigoTraceTrx'][0];
      this.CodigoTransaccion = PagoResult['a:CodigoTransaccion'][0];

      this.IdTransaccion = PagoResult['a:IDTransaccion'][0];
      this.FechaCierre = PagoResult['a:FechaCierre'][0];
      this.FechaCompensacion = PagoResult['a:FechaCompensacion'][0];

      this.OperadoPor = PagoResult['a:OperadoPor'][0];
      this.Terminal = PagoResult['a:Terminal'][0];
      this.Producto = PagoResult['a:Producto'][0];
      this.UrlFactura = PagoResult['a:UrlFactura'][0];

      let DataPago = PagoResult['a:DataPago'][0]['a:INT_ResplyPago.INT_DataPago'];
      for (let index = 0; index < DataPago.length; index++) {
        let dataDetalle = DataPago[index];

        let detalle = new DetallesPagosModel(dataDetalle);
        this.DetallesPagos.push(detalle);
      }

      this.XMLRecibo = PagoResult['a:XMLRecibo'][0]; 

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
module.exports = PagoResponseModel;
