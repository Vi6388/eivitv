var cors = require('cors')
//https://www.npmjs.com/package/cors

var corsOptions = {
    origin: '*'
   // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

var GlobalCors = cors(corsOptions);

module.exports = {
    GlobalCors: GlobalCors
}


