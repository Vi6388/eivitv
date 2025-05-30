import { Injectable } from '@angular/core';
import { usuarioModel } from '../models/UsuarioModel';
import { BehaviorSubject } from 'rxjs';
declare var alertify: any;
declare var $: any;
declare var window: any;
declare var document: any;
@Injectable({
  providedIn: 'root'
})
export class UtilitariosService {
  //CONFIGURACIONES DEL PLUGIN
  /*******transition
            slide
            zoom
            flipx
            flipy
            fade
            pulse
  */

  constructor() { }

  private textTypeSource = new BehaviorSubject<string>('password');
  currentTextType = this.textTypeSource.asObservable();

  changeTextType(textType: string) {
    this.textTypeSource.next(textType);
  }


  public static alertifyIncializarModal() {




    var configModalEstandarPrimary = function () {
      return {
        main: function (content: any) {
          let e: any = this;
          e.setContent(content);

        },
        setup: function () {
          return {
            buttons: [
              { text: "<i class='fa fa-sign-out'></i> Cerrar", key: 27, className: 'btn btn-default' }
            ],
            focus: {
              element: function () {
              },
              select: true
            },
            options: {
              padding: false,
              pinned: false,
              movable: false,
              resizable: false,
              //autoReset: true,
              closable: false,
              maximizable: false,
              startMaximized: true,
              pinnable: false,
              transition: 'fade'
            }
          };
        },
        settings: {
        }
      };
    };
    alertify.modalEstandarPrimary || alertify.dialog('modalEstandarPrimary', configModalEstandarPrimary);


    var configModalEstandar = function () {
      return {
        main: function (content: any) {
          let e: any = this;
          e.setContent(content);

        },
        setup: function () {
          return {
            buttons: [
              { text: "<i class='fa fa-arrow-left'></i> Volver", scope: 'auxiliary', key: 27, className: 'btn btn-default' }
            ],
            focus: {
              element: function () {
              },
              select: true
            },
            options: {
              padding: false,
              pinned: false,
              movable: false,
              resizable: false,
              //autoReset: true,
              closable: false,
              maximizable: false,
              startMaximized: true,
              pinnable: false,
              transition: 'fade'
            }
          };
        },
        settings: {
        }
      };
    };

    alertify.modalEstandar || alertify.dialog('modalEstandar', configModalEstandar);
    alertify.modalEstandarCategoria || alertify.dialog('modalEstandarCategoria', configModalEstandar);
    alertify.modalEstandarProducto || alertify.dialog('modalEstandarProducto', configModalEstandar);
    alertify.modalEstandarVenta || alertify.dialog('modalEstandarVenta', configModalEstandar);

    var configModalComprobante = function () {

      return {
        main: function (content: any, config: any) {
          let e: any = this;
          e.setContent(content);

        },
        setup: function (data: any, config: any) {
          return {
            buttons: [
              { id: 'omitir', text: "<i class='fa fa-arrow-left'></i> Omitir", invokeOnClose: false },
              { id: 'imprimir', text: "<i class='fa fa-print'></i> Imprimir", invokeOnClose: true },
              { id: 'compartir', text: "<i class='fa fa-whatsapp'></i> Compartir A Numero", invokeOnClose: true },
              { id: 'compartirContacto', text: "<i class='fa fa-whatsapp'></i> Compartir A Contacto", invokeOnClose: true }
            ],
            focus: {
              element: function () {
              },
              select: true
            },
            options: {
              padding: false,
              pinned: false,
              movable: false,
              resizable: false,
              //autoReset: true,
              closable: false,
              maximizable: false,
              startMaximized: true,
              pinnable: false,
              transition: 'zoom'

            }
          };
        },
        callback: function (e: any) {
          e.cancel = true;
          switch (e.button.id) {
            case 'omitir':
              alertify.closeAll();
              break;
            case 'imprimir':
              UtilitariosService.printDiv("id_cont_comprobante");
              break;
            case 'compartir':
              alertify.modalCompartirWhatsapp(null, {
                onEnviar: function (numero: string) {
                  UtilitariosService.compartirComprobante("id_cont_comprobante", numero);
                }
              });
              break;
            case 'compartirContacto':
              UtilitariosService.compartirComprobante("id_cont_comprobante");
              break;

          }

        }

      };
    };
    alertify.modalComprobante || alertify.dialog('modalComprobante', configModalComprobante);


    var configModalRescargarSaldo = function () {
      var config: any = {};

      return {
        main: function (content: any, conf: any) {
          let e: any = this;
          e.setContent(content);
          config = conf;

        },
        setup: function (data: any) {
          return {
            buttons: [
              { id: 'close', text: "<i class='fa fa-close'></i> Cerrar", invokeOnClose: false },
              { id: 'save', text: "<i class='fa fa-save'></i> Guardar", invokeOnClose: true },
            ],
            focus: {
              element: function () { },
              select: true
            },
            options: {
              padding: false,
              pinned: false,
              movable: false,
              resizable: false,
              closable: false,
              maximizable: false,
              startMaximized: true,
              pinnable: false,
              transition: 'zoom'
            }
          };
        },
        callback: function (e: any) {
          e.cancel = true;
          let button: any = e.button;
          switch (button.id) {
            case 'close':
              alertify.closeAll();
              break;
            case 'save':
              if (typeof config.save === 'function') {
                config.save();
              }
              break;
          }
        }
      };
    };

    alertify.modalRescargarSaldo || alertify.dialog('modalRescargarSaldo', configModalRescargarSaldo);


    var configModalCompartirWhatsapp = function () {
      let config: any = {};

      return {
        main: function (_content: any, conf: any) {
          config = conf;
          let e: any = this;
          let html = `
          <div class="form-group p-3">
            <label for="numeroWhatsapp">Número de WhatsApp:</label>
            <input type="text" class="form-control" id="numeroWhatsapp" placeholder="Ej: 0912311111" required autocomplete="off" pattern="^[0-9]{9,15}$" title="Ingrese un número válido de WhatsApp (9 a 15 dígitos)">
          </div>
        `;
          e.setContent(html);
        },
        setup: function () {
          return {
            buttons: [
              { id: 'cancelar', text: "<i class='fa fa-times'></i> Cancelar", invokeOnClose: false },
              { id: 'enviar', text: "<i class='fa fa-paper-plane'></i> Enviar", invokeOnClose: false }
            ],
            focus: { element: "#numeroWhatsapp", select: true },
            options: {
              padding: true,
              closable: false,
              maximizable: false,
              startMaximized: false,
              transition: 'zoom'
            }
          };
        },
        callback: function (e: any) {
          e.cancel = true;

          if (e.button.id === 'cancelar') {
            alertify.closeAll();
            return;
          }

          if (e.button.id === 'enviar') {
            const input = document.getElementById('numeroWhatsapp') as HTMLInputElement;
            let numero = input?.value.trim();

            if (!numero) {
              alertify.error("Debe ingresar un número");
              return;
            }

            // Llamar a la función con el número limpio
            if (typeof config.onEnviar === 'function') {
              config.onEnviar(numero);
            }

          }
        }

      };
    };

    alertify.modalCompartirWhatsapp || alertify.dialog('modalCompartirWhatsapp', configModalCompartirWhatsapp);

  }







  public static async Alertify_Modal(icono: any, titulo: any, html: any, botones: any) {
    //si  closeEvent.cancel  es false se cierra si es true la ventana persiste

    let labels: any = { ok: botones.ok.titulo, cancel: botones.cancel.titulo };
    alertify
      .prompt('')
      .unpin()
      .setHeader(`<i class="${icono}"></i>${titulo}`)
      .setContent(html)
      .closeOthers()
      .set('modal', true)
      .set('movable', true)
      .set('maximizable', true)
      .set('padding', false)
      .set('startMaximized', true)
      .set('resizable', false)//.resizeTo(400, 400)
      .set({ transition: 'fade' })
      .set('labels', labels)
      .set({
        onshow: null,
        onclose: function () {
          // alertify.message('Closed');
        },
      })
      .set('oncancel', function (closeEvent: any) {
        if (botones.cancel.evento) {
          botones.cancel.evento();
        }
      })
      .set('onok', function (closeEvent: any) {

        if (botones.ok.evento) {
          closeEvent.cancel = true;
          botones.ok.evento();

        }
      });
  }



  public static Alertify_Modal_Uno(titulo: any, html: any) {

    alertify
      .prompt('')
      .unpin()
      .setHeader(titulo)
      .setContent(html)
      .set('modal', true)
      .set('transition', 'fade')
      .setting({
        label: 'Cancelar',
        onok: function () {

        }
      })
      .maximize();
  }


  public static Alertify_Modal_Temp(titulo: any, html: any) {

    alertify
      .confirm('')
      .unpin()
      .setHeader(titulo)
      .setContent(html)
      .set('modal', true)
      .set('transition', 'fade')
      .setting({
        label: 'Cancelar',
        onok: function () {

        }
      })
      .maximize();
  }
  public static async Alertify_Modal_Dos(icono: any, titulo: any, html: any, botones: any) {
    let labels: any = {
      ok: botones.ok.titulo,
      cancel: botones.cancel.titulo,
      nuevoBoton: "Nuevo Botón"
    };

    alertify
      .confirm('')
      .unpin()
      .setHeader(`<i class="${icono}"></i>${titulo}`)
      .setContent(html)
      .closeOthers()
      .set('pinnable', false)
      .set('closable', false)
      .set('modal', true)
      .set('startMaximized', true)
      .set('resizable', false)
      .set({ transition: 'zoom' })
      .maximize()
      .set('labels', labels)
      .set({
        onshow: function () {
          // alertify.message('confirm was shown.')
        },
        onclose: function (closeEvent: any) {
          // alertify.message('Closed'); 
        },
      })
      .set('oncancel', function (closeEvent: any) {
        closeEvent.cancel = true;
        if (botones.cancel.evento) {
          botones.cancel.evento();
        }
      })
      .set('onok', function (closeEvent: any) {
        closeEvent.cancel = true;
        if (botones.ok.evento) {
          botones.ok.evento();
        }

      })
      .set('onnuevoBoton', function (closeEvent: any) {


      });
    /*  .set('onsetup', function () {
        debugger
        // Obtener el botón personalizado y asociar un evento clic
        var nuevoBoton = document.querySelector('.btn-default.nuevo-boton');
        if (nuevoBoton) {
          nuevoBoton.addEventListener('click', function () {
            // Agregar aquí la lógica que deseas ejecutar al hacer clic en el nuevo botón
            console.log('Nuevo botón clicado');
            // Si hay una función asociada al evento, llámala
            if (botones.nuevoBoton.evento) {
              botones.nuevoBoton.evento();
            }
          });
        }
      });*/
  }



  public static async Alertify_confirmacion(icono: any, titulo: any, html: any, botones: any) {
    alertify.confirm(`<a> <i class="${icono}"></i>  ${titulo}</a>`, html,
      function () {
        if (botones.ok.evento) {
          botones.ok.evento();
        }
      },
      function () {
        if (botones.cancel.evento) {
          botones.cancel.evento();
        }
      }).set('labels', { ok: botones.ok.titulo, cancel: botones.cancel.titulo });
  }

  public static Alertify_alert(data: DataAlert) {
    alertify.set('notifier', 'position', 'bottom-right');
    alertify.notify(data.mensaje, data.type, 20, function () { });
  }

  public static Alertify_Close() {
    alertify.confirm().close();
  }


  public static GenerateKeyHex() {
    var str = Math.random().toString();
    return this.ConvertHex(str);
  }

  public static ConvertHex(str: any) {
    var arr1: Array<any> = [];
    str = str || '';
    for (var n = 0, l = str.length; n < l; n++) {
      let hex: any = Number(str.charCodeAt(n)).toString(16);
      arr1.push(hex);
    }
    return arr1.join('');
  }

  public static configurarTab() {
    //carga la clase colapse cuando no es un framento
    setTimeout(() => {
      let bolEsTab: any = document.getElementsByClassName("iframe-mode").length == 0;
      if (bolEsTab) {
        $("body").addClass("sidebar-collapse");

      }
    }, 1000);
  }

  public static hiddenMenuHome() {
    //elimina la opcion home del menu 
    setTimeout(() => {
      let objMenuActivo: any = document.getElementsByClassName("nav-link active");
      if (objMenuActivo.length != 0) {
        let strMenu = objMenuActivo[0].innerText;
        strMenu = strMenu.trim();
        objMenuActivo[0].hidden = true;
      }
    }, 500);
  }


  public static getVericarSession() {
    if (!UtilitariosService.getIsLodged()) {
      window.location = '/login';
    }
  }

  public static getVerificarAccesoAdmin() {
    if (UtilitariosService.getIsLodged()) {
      window.location = '/admin';
    }
  }


  public static getIsLodged() {
    if (UtilitariosService.getToken() == null) {
      return false;
    } else {
      return true;
    }
  }



  public static getToken() {
    let token: any = localStorage.getItem("ms-token");
    return token;
  }

  public static removeToken() {
    localStorage.removeItem("ms-token");
  }

  public static getDataUsuario(): usuarioModel {
    let usuario: any = localStorage.getItem("ms-usuario") || "{}";
    let data_usuario: any = JSON.parse(usuario);
    return data_usuario;
  }


  public static validarSoloNumeros(val: string) {
    let esValido = false;
    let ExpRegSoloNumeros = "^[0-9]+$";
    if (val.match(ExpRegSoloNumeros) != null) {
      esValido = true;
    }
    return esValido;
  }


  public static validarSoloTexto(val: string) {
    let esValido = false;
    let ExpRegSoloLetras = "^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$";
    if (val.match(ExpRegSoloLetras) != null) {
      esValido = true;
    }
    return esValido;
  }


  public static validarSoloAlfaNumerico(val: string) {
    let esValido = false;
    let ExpRegSoloLetras = "^([a-zA-Z0-9_-]){1,16}$";
    if (val.match(ExpRegSoloLetras) != null) {
      esValido = true;
    }
    return esValido;
  }

  public static validarSoloTextoEspacio(val: string) {
    let esValido = false;
    let ExpRegLetrasEspacio = "^[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$";
    if (val.match(ExpRegLetrasEspacio) != null) {
      esValido = true;
    }
    return esValido;
  }

  public static validarEmail(val: string) {
    let esValido = false;
    let ExpRegEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

    if (val.match(ExpRegEmail) != null) {
      esValido = true;
    }
    return esValido;
  }



  public static cargarSlider(id_elemento: string, config: any) {

    setTimeout(() => {

      $('#' + id_elemento).slick(config);
    }, 100);

  }


  public static NombreFecha(fecha: any) {
    let date = new Date(fecha.replace(/-+/g, '/'));
    let options: any = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    let hora = date.toLocaleTimeString();
    return date.toLocaleDateString('es-MX', options) + ', ' + hora;

  }


  public static printDiv(divName: any) {
    var printContents = document.getElementById(divName).innerHTML;
    var winPrint = window.open('', '', 'width=800,height=600,toolbar=0,location=0,status=0,menubar=0,scrollbars=0,left=0,top=0');
    winPrint.document.write(
      `<html>
    <head> 
        <title>IMPRIMIR COMPROBANTE</title> 
        <style>      
            
        @media print {
          @page { 
            padding-top: 0rem;
            padding-bottom: 0rem;
            margin-left: 0.5rem;
            margin-right: 0.5rem;
          }
          body  {
            padding-top: 2mm;
            padding-bottom: 2mm; 
          }
        }
       </style>
    </head>
    <body style="margin: 0px;"> 
        ${printContents}
    </body>
    </html>`
    );
    winPrint.document.close();
    winPrint.focus();
    winPrint.print();
    winPrint.close();

  }


  public static compartirComprobante(divId: string, numero: string | null = null) {
    if (numero) {
      // Elimina todos los caracteres que no sean dígitos ni el símbolo +
      numero = numero.replace(/[^\d+]/g, '');

      if (numero.startsWith('+')) {
        // Si empieza con +, quitamos el + pero no modificamos el número
        numero = numero.substring(1);
      } else if (numero.startsWith('09')) {
        // Ecuador: empieza con 09 => quitar el 0 y agregar 593
        numero = '593' + numero.substring(1);
      } else if (numero.startsWith('0')) {
        // Otro caso que empieza con 0 pero no 09 (por seguridad)
        numero = '593' + numero.substring(1);
      } else if (!numero.startsWith('593')) {
        // Si no empieza con 593 o +, asumimos que le falta el prefijo
        numero = '593' + numero;
      }
    }

    const element = document.getElementById(divId);
    if (!element) {
      alert("Elemento no encontrado");
      return;
    }

    const text = element.innerHTML.trim(); 
    const encodedText2 = encodeURIComponent(text);
    var encodedText = this.formatHTMLContent(divId);
    

    let whatsappURL = `https://web.whatsapp.com/send?text=${encodeURIComponent(encodedText)}`;
    // let whatsappURL = `https://api.whatsapp.com/send?text=${encodedText}`;
    if (numero) {
      whatsappURL = `https://web.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(encodedText)}`;
      // whatsappURL = `https://api.whatsapp.com/send?phone=${numero}&text=${encodedText}`;
    }

    // 🔐 Espera un poco para evitar interferencia con el cierre de modales
    setTimeout(() => {
      const win = window.open(whatsappURL, '_blank');
      if (!win) {
        alert('La ventana emergente fue bloqueada. Habilita los popups.');
      }
    }, 200); // Espera 200ms antes de abrir WhatsApp
  }



  public static formatHTMLContent(elementId: any): string {
    const originalElement = document.getElementById(elementId);
    if (!originalElement) return '';

    const divContent = originalElement.innerHTML;

    const atributos: any = {
      Nombre: '',
      RUC: '',
      Comprobante: '',
      NumeroComprobante: '',
      TipoRecaudacion: '',
      Referencia: '',
      NombrePersona: '',
      Identificacion: '',
      Agencia: '',
      SecADQ_SW: '',
      UUID: '',
      FechaHora: '',
      Ciudad: '',
      ValorTransaccion: '',
      Comision: '',
      Total: '',
      Mensaje: '',
      OperadoPor: '',
      Factura: '',
      EnlaceConsulta: '',
      pantallasAsignadas: '',
      fecha: '',
      hora: '',
      clave: '',
      ciudad: '',
      operadoPor: '',
      mensaje: '',
    };

    // Extraer contenido de cada <p>
    const matches = divContent.match(/<p[^>]*>(.*?)<\/p>/g) || [];
    const limpiarHTML = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();

    matches.forEach((match: string) => {
      const texto = limpiarHTML(match);
      const [clave, ...resto] = texto.split(':');
      const valor = resto.join(':').trim();

      const clave1 = clave.trim().toLowerCase();

      switch (clave.trim().toLowerCase()) {
        case 'agente':
          atributos.Nombre = valor;
          break;
        case 'fecha':
          atributos.RUC = valor;
          break;
        case 'hora':
          atributos.Comprobante = valor;
          break;
        case 'transacción':
          atributos.NumeroComprobante = valor;
          break;
        case 'producto digital':
          atributos.TipoRecaudacion = valor;
          break;
        case 'descripción':
          atributos.Referencia = valor;
          break;
        case 'total':
          atributos.Total = valor;
          break;
        case 'codigo':
          atributos.Agencia = valor;
          break;
        case 'usuario':
          atributos.SecADQ_SW = valor;
          break;
        case 'pin':
          atributos.UUID = valor;
          break;
        case 'clave':
          atributos.UUID = valor;
          break;
        case 'fecha':
          atributos.fecha = valor;
          break;
        case 'hora':
          atributos.hora = valor;
          break;
        case 'recomendacion':
          atributos.Recomendacion = valor;
          break;
        case 'ciudad':
          atributos.Ciudad = valor;
          break;
        case 'pantallas asignadas':
          atributos.pantallasAsignadas = valor;
          break;
        case 'operado por':
          atributos.OperadoPor = valor;
          break;
        case 'mensaje':
          atributos.Mensaje = valor;
          break;
        // puedes agregar más campos aquí si aparecen en otros recibos
      }
    });

    const mensajeWhatsApp = `
    *${atributos.Nombre}*

    _${atributos.RUC}_
    _${atributos.Comprobante}_
    *Número de Comprobante:* ${atributos.NumeroComprobante}

    -----------------------------------------------------
    *Tipo de Recaudación:* ${atributos.TipoRecaudacion}
    *Referencia:* ${atributos.Referencia}
    *Pantallas Asignadas:* ${atributos.pantallasAsignadas}
    *Nombre:* ${atributos.Nombre}

    -----------------------------------------------------
    *Agencia:* ${atributos.Agencia}
    *Sec ADQ/SW:* ${atributos.SecADQ_SW}
    *UUID:* ${atributos.UUID}
    *Fecha y Hora:* ${atributos.RUC}

    -----------------------------------------------------
    *Valor de Transacción* ${atributos.ValorTransaccion}
    *Total:* ${atributos.Total}
    *Mensaje:* ${atributos.Mensaje}
    *Operado Por:* ${atributos.OperadoPor}
    *Factura:* ${atributos.NumeroComprobante}

    `.trim();

    /* const mensajeWhatsApp = `
    *${atributos.Nombre}*

    _${atributos.RUC}_
    _${atributos.Comprobante}_
    *Número de Comprobante:* ${atributos.NumeroComprobante}

    -----------------------------------------------------
    *Tipo de Recaudación:* ${atributos.TipoRecaudacion}
    *Referencia:* ${atributos.Referencia}
    *Pantallas Asignadas:* ${atributos.pantallasAsignadas}
    *Nombre:* ${atributos.Nombre}
    *Identificación:* ${atributos.Identificacion}

    -----------------------------------------------------
    *Agencia:* ${atributos.Agencia}
    *Sec ADQ/SW:* ${atributos.SecADQ_SW}
    *UUID:* ${atributos.UUID}
    *Fecha y Hora:* ${atributos.RUC}
    *Ciudad:* ${atributos.Ciudad}

    -----------------------------------------------------
    *Valor de Transacción:* ${atributos.ValorTransaccion}
    *Comisión:* ${atributos.Comision}
    *Total:* ${atributos.Total}
    *Mensaje:* ${atributos.Mensaje}
    *Operado Por:* ${atributos.OperadoPor}
    *Factura:* ${atributos.Factura}

    -----------------------------------------------------
    *Consulta tu documento en:* ${atributos.EnlaceConsulta}
    `.trim(); */

    console.log(mensajeWhatsApp);

    return mensajeWhatsApp;
  }





  //ready todo
  public static loadingOn() {
    $.LoadingOverlay("show");
  }
  public static loadingOff() {
    $.LoadingOverlay("hide");
  }

  public static loadingElementOn(ident: string) {
    setTimeout(() => {
      $("#" + ident).LoadingOverlay("show");
    }, 1);
  }
  public static loadingElementOff(ident: string) {
    setTimeout(() => {
      $("#" + ident).LoadingOverlay("hide", true);
    }, 1);
  }






  about() {

    //pendiente
    let setting = {
      imgFondo: 'https://i.ibb.co/WvCDZ2m/fondo-about.jpg',
      imgEmpresa: 'https://i.ibb.co/MRBQ538/micro-start.png'
    }
    var html = `   
    <div class="box ">
        <div class="box-body box-profile">
            <img class="profile-user-img img-responsive img-circle" src="${setting.imgFondo}" alt="User profile picture">

            <h3 class="profile-username text-center">ZARP</h3>

            <p class="text-muted text-center">GESTOR DOCUMENTAL</p>
            <p class="text-muted text-center">Vercion: 1.1.0</p>

            <a href='https://metric.com.ec/' class="profile-user-img  "
                style="display: table;border: 3px solid #0753ea00;">
                <img src="${setting.imgEmpresa}" style="height: 50px;">
            </a>
        </div>
    </div>
`;
    alertify.alert(html).set('frameless', true);
  }


  public static async toBase64(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


  public static replaceText(text: any, key: string, value: string) {
    let response = text.replaceAll(key, value);
    return response;
  }


}

class DataAlert {
  public mensaje!: string;
  public type!: string;
}

class Alertify_Modal_Uno {
  public html!: string;
  public title!: string;


}


class alertifyModalCustomer {
  public id!: string;
  public html!: string;
  public title!: string;
}