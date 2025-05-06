class ConsultaCupoResponseModel {

  CodigoResultado = "";
  Mensaje = "";
  Cupo = "";
  Detalle = "";



  constructor(data) {
    let ConsultaCupoResponse = data.ConsultaCupoResponse[0];
    let ConsultaCupoResult = ConsultaCupoResponse.ConsultaCupoResult[0];

    this.Cupo = ConsultaCupoResult['a:Cupo'][0];
    if (this.Cupo !='0') {
      this.CodigoResultado = ConsultaCupoResult['a:CodResultado'][0];
      this.Mensaje = ConsultaCupoResult['a:Mensaje'][0];
      this.Detalle = ConsultaCupoResult['a:Detalle'][0];

    }


  }

}

module.exports = ConsultaCupoResponseModel;






