const express = require('express');
const router = express.Router();
const end_point = "mensajeria";

const Controller = require("../controllers/Controller");
router.route(`/${end_point}/notificarWhatsApp`).post(Controller.notificarWhatsApp);  

module.exports = router;