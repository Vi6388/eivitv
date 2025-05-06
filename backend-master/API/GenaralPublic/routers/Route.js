const express = require('express');
const router = express.Router();
const end_point = "general";

const Controller = require("../controllers/Controller");
router.route(`/${end_point}/selector/pais`).post(Controller.selectorPais);
router.route(`/${end_point}/selector/provincia`).post(Controller.selectorProvincia);
router.route(`/${end_point}/selector/canton`).post(Controller.selectorCanton); 

module.exports = router;
