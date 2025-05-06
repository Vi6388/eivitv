class SolicitudPagoRequestModel {

    id_usuario = 0;
    id_cuenta_canal = 0;
    documento = "";
    fecha = "";
    comprobante = "";
    monto = "";
    descripcion = "";

    constructor(data) {
        this.id_usuario = data.id_usuario;
        this.id_cuenta_canal = data.id_cuenta_canal;
        this.documento = data.documento;
        this.fecha = data.fecha;
        this.comprobante = data.comprobante;
        this.monto = data.monto;
        this.descripcion = data.descripcion;
    }

}

module.exports = SolicitudPagoRequestModel;