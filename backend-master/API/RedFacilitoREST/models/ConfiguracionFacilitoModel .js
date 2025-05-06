

class ConfiguracionFacilitoModel {
  constructor() {
    this.Canal = null;
    this.Clave = null;
    this.TokenData = null;
    this.Usuario = null;
    this.IdAgencia = null;
    this.IdEntidad = null;
    this.UrlApi = null;
  }

  getCanal() {
    return this.Canal;
  }

  setCanal(value) {
    this.Canal = value;
  }

  getClave() {
    return this.Clave;
  }

  setClave(value) {
    this.Clave = value;
  }

  getTokenData() {
    return this.TokenData;
  }

  setTokenData(value) {
    this.TokenData = value;
  }

  getUsuario() {
    return this.Usuario;
  }

  setUsuario(value) {
    this.Usuario = value;
  }

  getIdAgencia() {
    return this.IdAgencia;
  }

  setIdAgencia(value) {
    this.IdAgencia = value;
  }

  getIdEntidad() {
    return this.IdEntidad;
  }

  setIdEntidad(value) {
    this.IdEntidad = value;
  }

  getUrlApi() {
    return this.UrlApi;
  }

  setUrlApi(value) {
    this.UrlApi = value;
  }
}

module.exports = ConfiguracionFacilitoModel;
