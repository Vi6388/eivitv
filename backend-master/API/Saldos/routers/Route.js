const express = require('express');
const router = express.Router();
const end_point = "saldos";

const Controller = require("../controllers/Controller");
router.route(`/${end_point}/visualizar/cupos`).post(Controller.visualizarCupos); 


module.exports = router;