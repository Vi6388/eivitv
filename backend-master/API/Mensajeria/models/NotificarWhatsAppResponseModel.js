class NotificarWhatsAppResponsetModel {
    constructor(data) {
        
        if (data?.url !== undefined) {
            this.url = data.url;
        }
        

    }

 
    getUrl() {
        return this.url;
    }

    setUrl(url) {
        this.url = url;
    }

  
}

module.exports =  NotificarWhatsAppResponsetModel;
