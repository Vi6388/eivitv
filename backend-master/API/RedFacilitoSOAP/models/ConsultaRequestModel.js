class ConsultaRequestModel {

  IdentidadProducto = "";
  Referencia = "";

  constructor(data) {
    this.IdentidadProducto = data.IdentidadProducto;
    this.Referencia = data.Referencia;
  }

}

module.exports = ConsultaRequestModel;






