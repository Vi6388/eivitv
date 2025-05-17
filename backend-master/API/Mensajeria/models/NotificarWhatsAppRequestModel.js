class NotificarWhatsAppRequestModel {
  constructor(data) {

    if (!data || data.phone === undefined) {
      this.phone = data.phone;
    }
    if (!data || data.text === undefined) {
      this.text = data.text;
    }

  }

  getPhone() {
    return this.phone;
  }

  setPhone(phone) {
    this.phone = phone;
  }

  getText() {
    return this.text;
  }

  setText(text) {
    this.text = text;
  }

}

module.exports = NotificarWhatsAppRequestModel;
