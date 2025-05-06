class ResponseModel {
  constructor(error = null) {
    if (error) {
      this.status = 500;
      this.code = error.code || 500;
      this.message = error.message || "Error de servidor.";
    } else {
      this.status = 200;
      this.code = 0;
      this.message = "La transacción se ejecutó correctamente";
    }
    
    this.data = {};
    this.auth = false;
  }
}

module.exports = ResponseModel;
