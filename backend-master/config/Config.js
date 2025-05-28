

var config = {
    ejecutar: "DESARROLLO",
    name_proyect: "Eivitv || API V2.1.1",
    nombre: "Eivitv",
    autor: "Micro start",
    descripcion: "Website",
    tokenSecreto: "-.T0k3nS3cr3t0-MicroStart.-",
    tokenTimeSeccion: 60 * 60 * 24, // expires in 24 hours
    // IpClienteDefault: "192.168.130.1", // ip diferenciar el uso de terminales 
    jwt: false, //deshabilita el uso de token jwt  
    local: {
      
        CONNECTION_HTTP: {
            puerto: 5006,
        },
        CONNECTION_BD_PG: {
            DATABASE_URL: "postgresql://eivitv_user:7p9p98sd3YjLZoLLa1SAMjRXvhgXAmAv@dpg-d0g7n6k9c44c73fbf8t0-a.frankfurt-postgres.render.com/eivitv_db_sve9",
            host: 'dpg-d0g7n6k9c44c73fbf8t0-a.frankfurt-postgres.render.com', 
            port: 5432, 
            user:  'eivitv_user', 
            password: '7p9p98sd3YjLZoLLa1SAMjRXvhgXAmAv',
            database: 'eivitv_db_sve9', 
            charset: 'utf8',
            ssl: false
        },
        CONNECTION_BD_PG_DEFAULT: {
            user:  null, 
            password:  null, 
            ssl: false
        },
    }, 
    local_dev: {
      
        CONNECTION_HTTP: {
            puerto: 5006,
        },
        CONNECTION_BD_PG: {
            DATABASE_URL: "postgresql://eivitv_user:7p9p98sd3YjLZoLLa1SAMjRXvhgXAmAv@dpg-d0g7n6k9c44c73fbf8t0-a.frankfurt-postgres.render.com/eivitv_db_sve9",
            host: 'dpg-d0g7n6k9c44c73fbf8t0-a.frankfurt-postgres.render.com', 
            port: 5432, 
            user:  'eivitv_user', 
            password: '7p9p98sd3YjLZoLLa1SAMjRXvhgXAmAv',
            database: 'eivitv_db_sve9', 
            charset: 'utf8',
            ssl: false
        },
        CONNECTION_BD_PG_DEFAULT: {
            user:  null, 
            password:  null, 
            ssl: false
        },
    }, 
    console_info: true,
    console_debugger: true,//mostrar mensajes de ejecucion de funciones por clientes


};


module.exports = config;
 