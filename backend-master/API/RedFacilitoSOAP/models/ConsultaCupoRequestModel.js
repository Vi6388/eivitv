class ConsultaCupoRequestModel {

  Id_Institucion = "";
  Token = "";

  constructor(data) {
    this.Id_Institucion = data.Id_Institucion;
    this.Token = data.Token;
  }

}

module.exports = ConsultaCupoRequestModel;






