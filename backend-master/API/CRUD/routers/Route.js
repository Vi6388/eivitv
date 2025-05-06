const express = require('express');
const router = express.Router();
const CRUDS = require("../config/CRUDS");

for (let index = 0; index < CRUDS.length; index++) {
    const objCrud = CRUDS[index];
    const end_point = objCrud.end_point;
 
    const Controller = require("../controllers/Controller");
    router.route(`/${end_point}/save`).all((req, res, next) => { req.objCrud = objCrud; next(); }).post(Controller.Save);
    router.route(`/${end_point}/update`).all((req, res, next) => { req.objCrud = objCrud; next(); }).post(Controller.Update);
    router.route(`/${end_point}/show`).all((req, res, next) => { req.objCrud = objCrud; next(); }).post(Controller.Show);
    router.route(`/${end_point}/show/list`).all((req, res, next) => { req.objCrud = objCrud; next(); }).post(Controller.ShowList);
    router.route(`/${end_point}/show/selector`).all((req, res, next) => { req.objCrud = objCrud; next(); }).post(Controller.ShowSelector);
    router.route(`/${end_point}/delete`).all((req, res, next) => { req.objCrud = objCrud; next(); }).post(Controller.Delete);
    console.log("End Points CRUD  " + end_point + " generado.")
}



module.exports = router;
