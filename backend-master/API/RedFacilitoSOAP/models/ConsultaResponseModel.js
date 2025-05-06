class ConsultaResponseModel {
  CodigoResultado = '';
  Mensaje = '';

  Identificador = '';
  Nombre = '';

  FechaHoraTransaccion = '';
  IdTransaccion = '';
  DetallesRubros = [];

  constructor(data) {
    let ConsultaResponse = data.ConsultaResponse[0];
    let ConsultaResult = ConsultaResponse.ConsultaResult[0];

    this.CodigoResultado = ConsultaResult['a:CodigoResultado'][0];
    this.Mensaje = ConsultaResult['a:Mensaje'][0];
    this.FechaHoraTransaccion = ConsultaResult['a:FechaHoraTransaccion'][0];
    if (this.CodigoResultado == '000') {
      this.IdTransaccion = ConsultaResult['a:IDTransaccion'][0];

      this.Identificador = ConsultaResult['a:Identificacion'][0];
      this.Nombre = ConsultaResult['a:Nombre'][0];

      let DataConsulta = ConsultaResult['a:DataConsulta'][0]['a:INT_ResplyConsulta.INT_DataConsulta'];

      for (let index = 0; index < DataConsulta.length; index++) {
        let Datadetalle = DataConsulta[index];

        let detalle = new detalleModel(Datadetalle);
        this.DetallesRubros.push(detalle);
      }
    }
  }
}

class detalleModel {
  Descripcion = '';
  IdRubro = '';
  Prioridad = 0;
  Comision = 0;
  Valor = 0;
  ValorFijo = 0;
  ValorConComision = 0;
  SePaga = false; //todos los rubros apareceran marcados

  constructor(DataConsulta) {
    this.Descripcion = DataConsulta['a:Descripcion'][0];
    this.IdRubro = DataConsulta['a:IDRubro'][0];
    this.Prioridad = parseInt(DataConsulta['a:Prioridad'][0]);
    this.Comision = parseFloat(DataConsulta['a:Comision'][0]);
    this.Valor = parseFloat(DataConsulta['a:Valor'][0]);
    this.ValorFijo= this.Valor;
    this.ValorConComision = parseFloat(DataConsulta['a:ValorConComision'][0]);
    this.SePaga = this.Prioridad == 1 ? true : false; //el primero va marcado


  }
}
module.exports = ConsultaResponseModel;
