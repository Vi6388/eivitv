const config = require("../../../config/Config");
const Utilitys = require("../../../utils/Utilitys");
const ConnectionBD = require('../../../config/ConnectionPG'); 

const request = require('request');
const xml2js = require('xml2js');
const ModelConsumirSoap = require('../models/ConsumirSoapModel');

async function ConsumirSOAP(data) { 
  let params = new ModelConsumirSoap(data);
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:sw="http://schemas.datacontract.org/2004/07/SW.WCF.Entidades.Integracion">
      <soapenv:Header/>
      <soapenv:Body>
      ${params.getXmlBody()}
      </soapenv:Body>
      </soapenv:Envelope>`;

  let promesa = new Promise(async (resolve, reject) => {
    let options = {
      url: params.getUrl(),
      method: 'POST',
      body: xml,
      timeout: 10000,
      proxy: false,
      headers: {
        'Content-Type': 'text/xml;charset=utf-8',
        'Accept-Encoding': '*',
        'Content-Length': xml.length,
        SOAPAction: 'http://tempuri.org/ISWSBFacilito/' + params.getMetodo(),
      },
    };
    let ObjResponse = new ModeloResponse();
    let callback = async (error, response, body) => {
      if (error) {
        ObjResponse.status = 500;
        ObjResponse.message = `Ha ocurrido un error con el proveedor :${error.message}`;
      } else {
        ObjResponse.status = response.statusCode;
        ObjResponse.message = response.statusMessage;
        ObjResponse.body = body;
        ObjResponse.result = null;
        if (!error && response.statusCode == 200) {
          try {

            let ObjetoJson = await XmltoJson(body);
            let sEnvelope = ObjetoJson['s:Envelope'];
            let sBody = sEnvelope['s:Body'][0];
            ObjResponse.result = sBody;
            /* } else {
             let ObjetoJson = await XmltoJson (body);
              let sEnvelope = ObjetoJson['s:Envelope'];
              let sBody = sEnvelope['s:Body'][0];
              let sFault = sBody['s:Fault'][0];
              let faultstring = sFault['faultstring'][0];
              ObjResponse.message = faultstring['_'];
            }*/

            Utilitys.ConsoleInfo({
              text: 'SOAP REQUEST (' +
                params.getXmlBody() +
                ')[' +
                ObjResponse.message +
                ']',
              color: ObjResponse.status == 500 ? 'red' : 'green',
            });
          } catch (error) {
            ObjResponse.status = 500;
            ObjResponse.message = 'ERROR [' + error.message + ']';
            ObjResponse.body = '';

            //SI SE PRODUCE UN FALLO DE LECTURA , REALIZAR UN REVERSO.
            Utilitys.ConsoleInfo({
              text: 'SOAP REQUEST ERROR EN LECTURA (' +
                params.getMetodo() +
                ')[' +
                error.message +
                ']',
              color: 'red',
            });
          }
        }
      }
      resolve(ObjResponse);
    };
    request(options, callback);
  });

  return promesa;
}

async function XmltoJson(xml) {
  return (promesa = new Promise((resolve, reject) => {
    xml2js.parseString(xml, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  }));
}

module.exports = {
  ConsumirSOAP,
  XmltoJson
};

class ModeloResponse {
  status = 500;
  message = 'ERROR';
  body = '';
  result = null;
}
