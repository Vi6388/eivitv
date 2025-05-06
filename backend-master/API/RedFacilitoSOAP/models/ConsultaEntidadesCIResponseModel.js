class ConsultaEntidadesCIResponseModel {

  CodigoResultado = "";
  Mensaje = "";
  EntidadesCI = ""; 



  constructor(data) {
    let ConsultasEntidadesCIResponse = data.ConsultasEntidadesCIResponse[0];
    let ConsultasEntidadesCIResult = ConsultasEntidadesCIResponse.ConsultasEntidadesCIResult[0];

    
      this.CodigoResultado = ConsultasEntidadesCIResult['a:CodResultado'][0];
      if (this.CodigoResultado) {
        this.Mensaje = ConsultasEntidadesCIResult['a:Mensaje'][0];
        this.EntidadesCI = ConsultasEntidadesCIResult['a:EntidadesCI'][0];
      }


  


  }

}

module.exports = ConsultaEntidadesCIResponseModel;






