class SaldosResponseModel {
    total_saldo = 0;
    total_comision = 0;

    constructor(data) {
        data = data || {};
        this.total_saldo = parseFloat(data.total_saldo || 0);
        this.total_comision = parseFloat(data.total_comision || 0);
    }

}


module.exports = SaldosResponseModel;