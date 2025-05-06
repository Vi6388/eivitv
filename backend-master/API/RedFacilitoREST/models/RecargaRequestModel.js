class RecargaRequestModel {
  IdTransaccion = '';
  DatosFactura = ''; 

  IdTipoPago = null;
  Referencia = null;
  Cantidad =0;
  IdProducto = null;
  IdentidadProducto = null;

  constructor(data) {
    this.IdTipoPago = data.IdTipoPago;
    this.Referencia = data.Referencia;
    this.Cantidad = data.Cantidad;
    this.IdProducto = data.IdProducto;
    this.IdentidadProducto = data.IdentidadProducto; 
    this.DatosFactura = data.DatosFactura;  
  }
}

 
module.exports = RecargaRequestModel;
