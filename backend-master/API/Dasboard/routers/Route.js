const express = require('express');
const router = express.Router();
const end_point = "dasboard";

const Controller = require("../controllers/Controller");
router.route(`/${end_point}/publicidad/list`).post(Controller.PublicidadList);
router.route(`/${end_point}/producto/list`).post(Controller.ProductoList);
router.route(`/${end_point}/tipo/list`).post(Controller.TipoList);
router.route(`/${end_point}/categoria/list`).post(Controller.CategoriaList);
router.route(`/${end_point}/favorito/list`).post(Controller.FavoritosList);



router.route(`/${end_point}/producto/show`).post(Controller.ProductoShow);
module.exports = router;
