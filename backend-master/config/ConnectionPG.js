
const config = require("./Config");
//set set timezone='America/Guayaquil'; 
//show timezone
var DATABASE_URL = process.env.DATABASE_URL || config.local.CONNECTION_BD_PG.DATABASE_URL;
let ssl = process.env.CONNECTION_BD_SSL || config.local.CONNECTION_BD_PG.ssl;


var Cadena = {
    client: 'pg',
    connection:
    {
        charset: config.local.CONNECTION_BD_PG.charset,
    },
    searchPath: ['knex', 'public'],
    useNullAsDefault: true,// valores de vacios  con null al usar insert
    depuración: false,
    debug: false,

    pool: {
        min: 0,
        max: 7,
        acquireTimeoutMillis: 300000,
        createTimeoutMillis: 300000,
        destroyTimeoutMillis: 50000,
        idleTimeoutMillis: 300000,
        reapIntervalMillis: 10000,
        createRetryIntervalMillis: 2000,
        propagateCreateError: false,
    },
    acquireConnectionTimeout: 60000,
};


if (DATABASE_URL) {
    Cadena.connection.connectionString = DATABASE_URL;
} else {
    Cadena.connection.host = process.env.CONNECTION_BD_HOST || config.local.CONNECTION_BD_PG.host;
    Cadena.connection.port = process.env.CONNECTION_BD_PORT || config.local.CONNECTION_BD_PG.port;
    Cadena.connection.user = process.env.CONNECTION_BD_USER || config.local.CONNECTION_BD_PG.user;
    Cadena.connection.password = process.env.CONNECTION_BD_PASSWORD || config.local.CONNECTION_BD_PG.password;
    Cadena.connection.database = process.env.CONNECTION_BD_DATABASE || config.local.CONNECTION_BD_PG.database;
}

if (ssl == true || ssl == 'true') {
    Cadena.connection.ssl = { 'rejectUnauthorized': false };
}



console.log(Cadena);

//modifica string a decimales 
const pg = require('pg');
//const PG_DECIMAL_OID = 1700;
//pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
const TIMESTAMPTZ_OID = 1184;
const TIMESTAMP_OID = 1114;
pg.types.setTypeParser(TIMESTAMPTZ_OID, val => val);
pg.types.setTypeParser(TIMESTAMP_OID, val => val);


const knex = require('knex')(Cadena);

function ModelORM(data) {
    let Tablas = data.name_tables; //ARRAY
    var Modelo = knex(Tablas);
    return Modelo;
}

function DefaultConexion() {
    //crear un usuario por defecto en postgres con una clave   
    var knex = require('knex')(Cadena);
    return knex;
}

//var bookshelf = require('bookshelf')(knex);

module.exports = {
    knex: knex,
    ModelORM: ModelORM,
    DefaultConexion: DefaultConexion
};

// PAGINA https://knexjs.org/