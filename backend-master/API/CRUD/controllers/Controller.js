const Service = require('../services/Service');


async function Save(req, res, next) {
    let objResponse = await Service.Save(req);
    res.status(objResponse.status).jsonp(objResponse);    
}


async function Update(req, res, next) {
    let objResponse = await Service.Update(req);
    res.status(objResponse.status).jsonp(objResponse);    
}
 
async function Delete(req, res, next) {
    let objResponse = await Service. Delete(req);
    res.status(objResponse.status).jsonp(objResponse);    
}

async function Show(req, res, next) {
    let objResponse = await Service.Show(req);
    res.status(objResponse.status).jsonp(objResponse);    
}

async function ShowList(req, res, next) {
    let objResponse = await Service. ShowList(req);
    res.status(objResponse.status).jsonp(objResponse);
}
  

async function ShowSelector(req, res, next) {
    let objResponse = await Service.  ShowSelector(req);
    res.status(objResponse.status).jsonp(objResponse);    
}

async function ShowContent(req, res, next) {
    let objResponse = await Service.  ShowSelector(req);
    res.status(objResponse.status).jsonp(objResponse);  
}
 

module.exports = {
    Save,
    Update,
    Delete,
    Show,
    ShowList,
    ShowContent,
    ShowSelector
   
};