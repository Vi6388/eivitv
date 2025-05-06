const express = require('express');
const router = express.Router();
const end_point = "general/private";

const Controller = require("../controllers/Controller");
router.route(`/${end_point}/menu`).post(Controller.showMenu);
router.route(`/${end_point}/modulo`).post(Controller.getModulo);
router.route(`/${end_point}/digital/catalogo`).post(Controller.getDigitalCatalogo); 
module.exports = router; 
