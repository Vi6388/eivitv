class ConsultaResponseModel {
  constructor(data) {
    this.nombres = data.nombres || '';
    this.identificacion = data.identificacion || '';
    this.comision = data.comision || 0;
    this.rubros = [];

    for (let index = 0; index < (data.rubros || []).length; index++) {
      let el = data.rubros[index];
      el = new Rubro(el);
      this.rubros.push(el);
    }

  }
}

class Rubro {
  constructor(data) {
    this.idRubro = parseInt(data.idRubro || 0);
    this.valorPagado = data.valorPagado || 0;
    this.descripcion = [];

    for (let index = 0; index < (data.descripcion || []).length; index++) {
      let el = data.descripcion [index];
      el = new Descripcion(el);
      this.descripcion.push(el);
    }

  }
}

class Descripcion {
  constructor(data) {
    this.parametro = data.parametro || '';
    this.info = data.info || '';
  }
}

module.exports = ConsultaResponseModel;
