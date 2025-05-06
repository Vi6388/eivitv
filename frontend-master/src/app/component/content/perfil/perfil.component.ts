import { Component, OnInit } from '@angular/core';
import { usuarioModel } from 'src/app/models/UsuarioModel';
import { GlobalService } from 'src/app/service/global.service';
import { UtilitariosService } from 'src/app/service/utilitarios.service';
declare var $: any;
declare var document: any;
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  public dataUsuario: usuarioModel = UtilitariosService.getDataUsuario();
  public dataActividades: Array<LogModal> = [];
  public msjActividades: any;
  static i: any;
  constructor() { }

  ngOnInit(): void {
    UtilitariosService.getVericarSession();
    this.CargarDataLog();
    PerfilComponent.i = this;
    this.cargarPais();

  }



  async CargarDataLog() {
    let endPoint = "usuario/visualizar/log";
    let res: any = await GlobalService.Post(endPoint, {});
    if (res.status == 200) {
      this.dataActividades = res.data.log_detalle;
      this.dataActividades.map(function (x: LogModal) {
        x.fecha = UtilitariosService.NombreFecha(x.fecha)
        return x;
      });

    } else {
      this.msjActividades = res.message;
    }
  }

  public async ActualizarDatosUsuario() {
    let foto_img = $('#in-foto-img');
    let fondo_img = $('#in-fondo-img');
    let nombres = $('#in-nombre').val();
    let apellidos = $('#in-apellido').val();
    let dni = $('#in-dni').val();
    let correo = $('#in-correo').val();
    let telefono = $('#in-telefono').val();
    let id_canton = $('#in-canton').val();
    let direccion = $('#in-direccion').val();
    if (!id_canton) {
      UtilitariosService.Alertify_alert({ mensaje: "Se requiere selecciona un canton", type: "warning" });
    } else {

      if (foto_img.val()) {
        foto_img = foto_img[0].files[0];
        foto_img = await UtilitariosService.toBase64(foto_img);
      } else {
        foto_img = null;
      }
      if (fondo_img.val()) {
        fondo_img = fondo_img[0].files[0];
        fondo_img = await UtilitariosService.toBase64(fondo_img);
      } else {
        fondo_img = null;
      }

      let dataUsuario = { foto_img, fondo_img, nombres, apellidos, dni, correo, telefono, direccion, id_canton };
      let endPoint = "usuario/actualizar/datos";
      let res: any = await GlobalService.Post(endPoint, dataUsuario);
      if (res.status == 201) {
        UtilitariosService.Alertify_alert({ mensaje: res.message, type: "success" });
      }
    }

  }



  async cargarVistaModalCambiarClave() {
    var icono = " ";
    var botones = {
      ok: {
        titulo: "Realizar cambio de contraseña",
        evento: function () {
          PerfilComponent.i.GenerarCambioClave()
        }
      },
      cancel: {
        titulo: "Cancelar",
        evento: null
      }
    }

    let titulo = `Cambiar contraseña`
    let html = `
    <div   class="modal-body" tabindex="-1"> 
        <form class="form-horizontal">  
             <div class="form-group row">
                <label for="inc-codigo-verif" class="col-sm-5 col-form-label">Codigo verificación</label>
                <div class="col-sm-7">
                  <div class="input-group mb-3">
                      <div class="input-group-prepend">
                        <button id="id_btn_generar_codigo" type="button" class="btn btn-danger">Generar Codigo</button>
                      </div>                  
                      <input type="text" class="form-control" id="inc-codigo-verif" placeholder="Codigo de verificación" />
                  </div>
                </div>
            </div>
            <div class="form-group row">
                <label for="inc-clave" class="col-sm-5 col-form-label">Nueva contraseña</label>
                <div class="col-sm-7">
                    <input type="password" class="form-control" id="inc-clave" placeholder="Ingrese nueva  contraseña" />
                </div>
            </div>
            <div class="form-group row">
                <label for="inc-clave-repite" class="col-sm-5 col-form-label">Repetir nueva contraseña</label>
                <div class="col-sm-7">
                    <input type="password" class="form-control" id="inc-clave-repite" placeholder="Repita la nueva contraseña" />
                </div>
            </div> 
        </form> 
    </div>
    `;
    UtilitariosService.Alertify_Modal(icono, titulo, html, botones);
    let GenerarCodigoVerificacion = function () { PerfilComponent.i.GenerarCodigoVerificacion() }
    document.getElementById("id_btn_generar_codigo").addEventListener("click", GenerarCodigoVerificacion);
  }



  async GenerarCodigoVerificacion() {
    let endPoint = "codigo/verificacion/generar";
    let correo = this.dataUsuario.correo;
    let res: any = await GlobalService.Post(endPoint, { correo });
    if (res.status == 201) {
      UtilitariosService.Alertify_alert({ mensaje: res.message, type: "success" });
    }
  }

  async GenerarCambioClave() {
    let codigo_verificacion = $('#inc-codigo-verif').val();
    let clave = $('#inc-clave').val();
    let clave_repite = $('#inc-clave-repite').val();
    if (clave != clave_repite) {
      UtilitariosService.Alertify_alert({ mensaje: 'Las clave son distintas', type: "warning" });
    } else {
      let endPoint = "usuario/cambiar/clave";
      let res: any = await GlobalService.Post(endPoint, { codigo_verificacion, clave });
      if (res.status == 201) {
        UtilitariosService.Alertify_alert({ mensaje: res.message, type: "success" });
      }
    }
  }



  async cargarPais() {
    let dataListaPaises = [];
    let endPoint = "general/selector/pais";
    let res: any = await GlobalService.Post(endPoint, {});
    if (res.status == 200) {
      dataListaPaises = res.data;
    }
    let el_pais = $(`#in-pais`);
    el_pais.empty();
    el_pais.select2({
      placeholder: "Seleccionar Pais",
      data: dataListaPaises,
      allowClear: true
    }).on('change', function (e: any) {
      let id_pais = e.currentTarget.value;
      PerfilComponent.i.cargarProvincias(id_pais);
    });
  }


  async cargarProvincias(id_pais: any) {
    let dataListaProvinicias = [];
    let endPoint = "general/selector/provincia";

    let res: any = await GlobalService.Post(endPoint, { id_pais });
    if (res.status == 200) {
      dataListaProvinicias = res.data;
    }
    let el_provincia = $(`#in-provincia`);
    el_provincia.empty();
    el_provincia.select2({
      placeholder: "Seleccionar Provincia",
      data: dataListaProvinicias,
      allowClear: true
    }).on('change', function (e: any) {
      let id_provincia = e.currentTarget.value;
      PerfilComponent.i.cargarCantones(id_provincia);
    });
  }

  async cargarCantones(id_provincia: any) {
    let dataListaCantones = [];
    let endPoint = "general/selector/canton";
    let res: any = await GlobalService.Post(endPoint, { id_provincia });
    if (res.status == 200) {
      dataListaCantones = res.data;
    }
    let el_canton = $(`#in-canton`);
    el_canton.empty();
    el_canton.select2({
      placeholder: "Seleccionar Canton",
      data: dataListaCantones,
      allowClear: true
    }).on('change', function (e: any) {
      let id_canton = e.currentTarget.value;
    });
  }


}

class LogModal {
  icono: any;
  nombre: any;
  esquema: any;
  codigo: any;
  descripcion: any;
  fecha: any;
}