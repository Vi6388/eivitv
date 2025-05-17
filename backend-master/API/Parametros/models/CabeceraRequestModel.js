class CabeceraRequestModel {
  constructor(data) {
    if (!data || data.id === undefined) {
      this.id = data.id;
      if (!data || data.codigo === undefined) {
        this.codigo = data.codigo;
      }
      if (!data || data.nombre === undefined) {
        this.nombre = data.nombre;
      }
      if (!data || data.descripcion === undefined) {
        this.descripcion = data.descripcion;
      }
      if (!data || data.estado === undefined) {
        this.estado = data.estado;
      }
    }
  }
  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getCodigo() {
    return this.codigo;
  }

  setCodigo(codigo) {
    this.codigo = codigo;
  }

  getNombre() {
    return this.nombre;
  }

  setNombre(nombre) {
    this.nombre = nombre;
  }

  getDescripcion() {
    return this.descripcion;
  }

  setDescripcion(descripcion) {
    this.descripcion = descripcion;
  }

  getEstado() {
    return this.estado;
  }

  setEstado(estado) {
    this.estado = estado;
  }
}

module.exports = CabeceraRequestModel;
