const express = require('express');
const router = express.Router();
const end_point = "recargar_saldo";

const Controller = require("../controllers/Controller");
router.route(`/${end_point}/cuenta/list`).post(Controller.CuentaList);
router.route(`/${end_point}/canal_pago/list`).post(Controller.CanalPagoList);
router.route(`/${end_point}/pago/guardar`).post(Controller.PagoGuardar);
router.route(`/${end_point}/recarga/saldo/verificar`).post(Controller.RecargaSaldoVerificar);
router.route(`/${end_point}/recarga/saldo/aprobar`).post(Controller.RecargaSaldoAprobar);
router.route(`/${end_point}/recarga/saldo/rechazar`).post(Controller.RecargaSaldoRechazar);


module.exports = router;