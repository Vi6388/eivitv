class DetalleRequestModel {
  constructor(data) {
    if (data?.id !== undefined) {
      this.id = data.id;
    }
    if (data?.id_parametro_cab !== undefined) {
      this.id_parametro_cab = data.id_parametro_cab;
    }
    if (data?.codigo !== undefined) {
      this.codigo = data.codigo;
    }
    if (data?.valor !== undefined) {
      this.valor = data.valor;
    }
    if (data?.descripcion !== undefined) {
      this.descripcion = data.descripcion;
    }
    if (data?.estado !== undefined) {
      this.estado = data.estado;
    }
  }

  getId() {
    return this.id;
  }

  setid(value) {
    this.id = value;
  }

  getId_parametro_cab() {
    return this.id_parametro_cab;
  }

  setId_parametro_cab(value) {
    this.id_parametro_cab = value;
  }

  getCodigo() {
    return this.codigo;
  }

  seCodigo(value) {
    this.codigo = value;
  }

  getValor() {
    return this.valor;
  }

  setValor(value) {
    this.valor = value;
  }

  getDescripcion() {
    return this.descripcion;
  }

  setDescripcion(value) {
    this.descripcion = value;
  }

  getEstado() {
    return this.estado;
  }

  setEstado(estado) {
    this.estado = estado;
  }
}

module.exports = DetalleRequestModel;
