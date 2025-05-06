const pino = require('pino')
const dateFormat = require('dateformat');

function CreateLogFile(data) {
    let now = new Date();
    let fecha = dateFormat(now, "mm-dd-yyyy");
    let file = data.name_file;
    if (file.length == "1") {
        file = file[0];
    }

    file = file.split(" ");//sepramos sentecia sql del nombre de la tabla
    file = file[0];


    var logger = null;
    //logger = pino(pino.destination('./log/' + fecha + " log-" + file));
    logger = pino(pino.destination(fecha + " log-" + file));
    return logger;
}




module.exports = {
    CreateLogFile: CreateLogFile
}


