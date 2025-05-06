const express = require('express');
const router = express.Router();
const end_point = "parametro";

const Controller = require("../controllers/Controller");
router.route(`/${end_point}/getCabecera`).post(Controller.getCabecera); 
router.route(`/${end_point}/getDetalle`).post(Controller.getDetalle); 
router.route(`/${end_point}/getListaDetalle`).post(Controller.getListaDetalle); 

module.exports = router;