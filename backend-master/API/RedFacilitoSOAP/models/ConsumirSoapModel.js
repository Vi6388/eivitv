class ConsumirSoapModel {
  constructor(data) {
    this.url = data.url;
    this.metodo = data.metodo;
    this.xmlBody = data.xmlBody;
  }

  getUrl() {
    return this.url;
  }

  setUrl(newUrl) {
    this.url = newUrl;
  }

  getMetodo() {
    return this.metodo;
  }

  setMetodo(newMetodo) {
    this.metodo = newMetodo;
  }

  getXmlBody() {
    return this.xmlBody;
  }

  setXmlBody(newXmlBody) {
    this.xmlBody = newXmlBody;
  }
}

module.exports = ConsumirSoapModel;
