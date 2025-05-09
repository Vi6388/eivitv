const config = require("./Config");
//set set timezone='America/Guayaquil'; 
//show timezone
var DATABASE_URL = process.env.DATABASE_URL || config.local.CONNECTION_BD_PG.DATABASE_URL;

var Cadena = {
    client: 'pg',
    connection: {
        charset: config.local.CONNECTION_BD_PG.charset,
    },
    searchPath: ['knex', 'public'],
    useNullAsDefault: true,// valores de vacios  con null al usar insert
    depuración: false,
    debug: false,

    pool: {
        min: 0,
        max: 5, // Reducing max connections to avoid hitting limits on free tier
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

// For Render PostgreSQL, SSL is required
if (DATABASE_URL) {
    console.log("Using DATABASE_URL for connection");
    Cadena.connection.connectionString = DATABASE_URL;
    // Always use SSL when connecting to Render PostgreSQL
    Cadena.connection.ssl = { rejectUnauthorized: false };
} else {
    console.log("Using local connection settings");
    Cadena.connection.host = process.env.CONNECTION_BD_HOST || config.local.CONNECTION_BD_PG.host;
    Cadena.connection.port = process.env.CONNECTION_BD_PORT || config.local.CONNECTION_BD_PG.port;
    Cadena.connection.user = process.env.CONNECTION_BD_USER || config.local.CONNECTION_BD_PG.user;
    Cadena.connection.password = process.env.CONNECTION_BD_PASSWORD || config.local.CONNECTION_BD_PG.password;
    Cadena.connection.database = process.env.CONNECTION_BD_DATABASE || config.local.CONNECTION_BD_PG.database;
    
    // Set SSL based on config or environment
    let ssl = process.env.CONNECTION_BD_SSL || config.local.CONNECTION_BD_PG.ssl;
    if (ssl == true || ssl == 'true') {
        Cadena.connection.ssl = { rejectUnauthorized: false };
    }
}

// Add database connection monitoring and error logging
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

//modifica string a decimales 
const pg = require('pg');
//const PG_DECIMAL_OID = 1700;
//pg.types.setTypeParser(PG_DECIMAL_OID, parseFloat);
const TIMESTAMPTZ_OID = 1184;
const TIMESTAMP_OID = 1114;
pg.types.setTypeParser(TIMESTAMPTZ_OID, val => val);
pg.types.setTypeParser(TIMESTAMP_OID, val => val);

// Create knex instance with error handling
let knexInstance;
try {
    knexInstance = require('knex')(Cadena);
    console.log("Database connection initialized successfully");
    
    // Test the connection
    knexInstance.raw('SELECT 1')
        .then(() => {
            console.log('Database connection established successfully!');
        })
        .catch(err => {
            console.error('Failed to connect to database:', err);
        });
} catch (error) {
    console.error('Error initializing database connection:', error);
    throw error;
}

function ModelORM(data) {
    let Tablas = data.name_tables; //ARRAY
    var Modelo = knexInstance(Tablas);
    return Modelo;
}

function DefaultConexion() {
    //crear un usuario por defecto en postgres con una clave   
    return knexInstance;
}

module.exports = {
    knex: knexInstance,
    ModelORM: ModelORM,
    DefaultConexion: DefaultConexion
};

// PAGINA https://knexjs.org/
