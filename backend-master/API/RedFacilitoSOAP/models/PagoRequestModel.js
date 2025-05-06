class PagoRequestModel {
  IdTransaccion = '';
  DatosFactura = '';
  DetallesRubros = [];

  IdTipoPago = null;
  Referencia = null;
  Nombre = null;
  IdProducto = null;
  IdentidadProducto = null;

  constructor(data) {
    this.IdTipoPago = data.IdTipoPago;
    this.Referencia = data.Referencia;
    this.Nombre = data.Nombre;
    this.IdProducto = data.IdProducto;
    this.IdentiProducto = data.IdentiProducto;
    this.IdTransaccion = data.IdTransaccion;
    this.DatosFactura = data.DatosFactura;

    let dataRubro = data.DetallesRubros || [];
    for (let index = 0; index < dataRubro.length; index++) {
      let dataDetalle = dataRubro[index];

      let detalle = new DetallesRubrosModel(dataDetalle);
      this.DetallesRubros.push(detalle);
    }
  }
}

class DetallesRubrosModel {
  Descripcion = '';
  IdRubro = '';
  Prioridad = 0;
  Comision = 0;
  Valor = 0;
  ValorConComision = 0;

  constructor(data) {
    this.Descripcion = data.Descripcion;
    this.IdRubro = data.IdRubro;
    this.Prioridad = data.Prioridad;
    this.Comision = data.Comision;
    this.Valor = data.Valor;
    this.ValorConComision = data.ValorConComision;
  }
}

module.exports = PagoRequestModel;
