class ConsultaRequestModel { 

    constructor(data) {
        this.data = {
            uuid: data.uuid ||null ,
            referencia: data.referencia||null ,
            idProducto: data.idProducto||null ,
            idInstitucion: data.idInstitucion||null ,
            idAgencia: data.idAgencia||null ,
            datosAdicionales: data.datosAdicionales||null 
        };
    }

    setUUID(uuid) {
        this.data.uuid = uuid;
    }

    setReferencia(referencia) {
        this.data.referencia = referencia;
    }

    setIdProducto(idProducto) {
        this.data.idProducto = idProducto;
    }

    setIdInstitucion(idInstitucion) {
        this.data.idInstitucion = idInstitucion;
    }

    setIdAgencia(idAgencia) {
        this.data.idAgencia = idAgencia;
    }

    setDatosAdicionales(datosAdicionales) {
        this.data.datosAdicionales = datosAdicionales;
    }

    build() {
        return this.data;
    }
}




module.exports = ConsultaRequestModel;






