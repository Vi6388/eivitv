class CabeceraRequestModel {
    constructor(data) {
        if (data?.id !== undefined) {
            this.id = data.id;
        }
        if (data?.codigo !== undefined) {
            this.codigo = data.codigo;
        }
        if (data?.nombre !== undefined) {
            this.nombre = data.nombre;
        }
        if (data?.descripcion !== undefined) {
            this.descripcion = data.descripcion;
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
}

module.exports = CabeceraRequestModel;
