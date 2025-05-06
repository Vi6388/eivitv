const express = require('express');
const router = express.Router();
const end_point = "red_facilito";

const Controller = require("../controllers/Controller");
router.route(`/${end_point}/consulta`).post(Controller.Consulta); 
router.route(`/${end_point}/pago`).post(Controller.Pago); 
router.route(`/${end_point}/recargar`).post(Controller.Recargar); 
router.route(`/${end_point}/contratar`).post(Controller.Contratar); 
router.route(`/${end_point}/reverso`).post(Controller.Reverso); 

router.route(`/${end_point}/consultar/cupo`).post(Controller.ConsultarCupo); 
router.route(`/${end_point}/consultar/entidadesci`).post(Controller.ConsultarEntidadesCI); 



module.exports = router;
