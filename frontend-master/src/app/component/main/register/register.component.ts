import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/service/global.service';
import { ParametrosService } from 'src/app/service/parametros.service';
import { UtilitariosService } from 'src/app/service/utilitarios.service';
declare var $: any;
declare var window: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  constructor() { }
  static i: any;
  ngOnInit(): void {
    RegisterComponent.i = this;
  }
  public parametros: any = ParametrosService;


  public async Registrarse() {
    let nombres: any = $("#id-register-nombres").val();
    let apellidos: any = $("#id-register-apellidos").val();
    let dni: any = $("#id-register-dni").val();
    let correo: any = $("#id-register-email").val();
    let telefono: any = $("#id-register-telefono").val();
    let id_canton: any = $("#id-register-canton").val();

    let data_parametro: any = {
      nombres,
      apellidos,
      dni,
      correo,
      telefono,
      id_canton
    }

    let endPoint = "register";
    let res: any = await GlobalService.Post(endPoint, data_parametro);
    if (res.status == 201) {
      UtilitariosService.Alertify_alert({ mensaje: res.message, type: "warning" });
      window.location = '/login';
    }


  }


  async ngAfterViewInit(): Promise<void> {
    $("body").removeClass("sidebar-mini layout-footer-fixed layout-fixed layout-navbar-fixed ");
    $("body").addClass(" login-page");
    this.cargarProvincias();

  }


  async cargarProvincias() {
    let dataListaProvinicias = [];
    let endPoint = "general/selector/provincia";
    let res: any = await GlobalService.Post(endPoint, {});
    if (res.status == 200) {
      dataListaProvinicias = res.data;
    }
    let el_provincia = $(`#id-register-provincia`);
    el_provincia.empty();
    el_provincia.select2({
      placeholder: "Seleccionar Provincia",
      data: dataListaProvinicias,
      allowClear: true
    }).on('change', function (e: any) {
      let id_provincia = e.currentTarget.value;
      RegisterComponent.i.cargarCantones(id_provincia);
    });
  }

  async cargarCantones(id_provincia: any) {
    let dataListaCantones = [];
    let endPoint = "general/selector/canton";
    let res: any = await GlobalService.Post(endPoint, { id_provincia });
    if (res.status == 200) {
      dataListaCantones = res.data;
    }
    let el_canton = $(`#id-register-canton`);
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
