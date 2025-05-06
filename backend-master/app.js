
const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/Config");
const Utilitys = require("./utils/Utilitys");
const Cors = require("./utils/Cors");

const session = require('express-session');

if (process.env.NODE_ENV != 'production') {
  require("dotenv").config();
}


app = express();
app.use(Cors.GlobalCors);
app.options("*", Cors.GlobalCors);
app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use('/static', express.static(__dirname + '/public'));
app.use('/archivos', express.static(__dirname + '/archivos'));

app.use("/", require("./API/Mensajeria/routers/Route"));

app.use(session({ secret: config.tokenSecreto }));

app.use("/", require("./API/GenaralPublic/routers/Route"));
app.use("/", require("./API/Authentication/routers/Route"));
app.use("/", require("./API/GeneralPrivate/routers/Route"));
app.use("/", require("./API/Dasboard/routers/Route"));
app.use("/", require("./API/CRUD/routers/Route"));
app.use("/", require("./API/RecargarSaldo/routers/Route"));
app.use("/", require("./API/RedFacilitoSOAP/routers/Route"));
app.use("/", require("./API/Saldos/routers/Route"));
app.use("/", require("./API/Parametros/routers/Route"));


let port = Utilitys.GetPuerto();
let ip = Utilitys.GetIP();
app.listen(port, function () {
  Utilitys.ConsoleTabInfo({
    //mensaje en consola
    title: "CONFIGURACIONES (" + config.nombre + ' || ' + (process.env.VERSION || config.version) + ')',
    color: "blue",
    break: true, //rompe regla de consola
    childre: async function () {
      Utilitys.ConsoleInfo({
        text: "Type of configuration: " + (process.env.NODE_ENV || config.ejecutar),
        color: "green",
      });
      Utilitys.ConsoleInfo({
        text: "listen: http://localhost:" + port,
        color: "green",
      });
      Utilitys.ConsoleInfo({
        text: "listen: http://" + ip + ":" + port,
        color: "magenta",
      });
    },
  });
}); 
