const express = require("express");
const router = express.Router();

const Controller = require("../controllers/Controller");
router.route("/login").post(Controller.Login);
router.route("/register").post(Controller.UsuarioRegistrar);
router.route("/codigo/verificacion/generar").post(Controller.GenerarCodigoVerificacion);
router.route("/usuario/cambiar/clave").post(Controller.UsuarioCambioClave);

router.use(Controller.isLoggedIn);
router.use(Controller.SeccionUsuario);
router.route("/usuario/actualizar/datos").post(Controller.UsuarioActualizarDatos);
router.route("/usuario/visualizar/log").post(Controller.UsuarioMostrarLog);


module.exports = router;