import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth.service';
import { UtilitariosService } from '../../../service/utilitarios.service';
import { ParametrosService } from '../../../service/parametros.service';
import { GlobalService } from 'src/app/service/global.service';
import { usuarioModel } from 'src/app/models/UsuarioModel';
declare var $: any;

@Component({
  selector: 'app-recuperar-clave',
  templateUrl: './recuperar-clave.component.html',
  styleUrls: ['./recuperar-clave.component.css']
})
export class RecuperarClaveComponent implements OnInit, AfterViewInit {

  public parametros: any = ParametrosService;
  public newPasswordType: string = 'password';
  public confirmPasswordType: string = 'password';
  public step = 1;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    $("body").removeClass("sidebar-mini layout-footer-fixed layout-fixed layout-navbar-fixed ");
    $("body").addClass("login-page");
    setTimeout(() => {
      $("body")[0].removeAttribute("style");
    }, 300);
  }

  async GenerarCodigoVerificacion() {
    let correo = $('#id-login-email').val();
    if (UtilitariosService.validarEmail(correo)) {
      UtilitariosService.loadingOn();
      let endPoint = "codigo/verificacion/generar";
      let res: any = await GlobalService.Post(endPoint, { correo });
      if (res.status == 201) {
        UtilitariosService.Alertify_alert({ mensaje: res.message, type: "success" });
      }
      this.step = 2;
      UtilitariosService.loadingOff();
    } else {
      UtilitariosService.Alertify_alert({ mensaje: "El correo electrónico es requerido.", type: "error" });
      $('#id-login-email').focus();
    }
  }

  async RecuperarCambioClave() {
    let codigo_verificacion = $('#inc-codigo-verif').val();
    let clave = $('#inc-clave').val();
    let clave_repite = $('#inc-clave-repite').val();
    if (clave != clave_repite) {
      UtilitariosService.Alertify_alert({ mensaje: 'Las clave son distintas', type: "warning" });
    } else {
      UtilitariosService.loadingOn();
      let endPoint = "usuario/cambiar/clave";
      let res: any = await GlobalService.Post(endPoint, { codigo_verificacion, clave });
      if (res.status == 201) {
        UtilitariosService.Alertify_alert({ mensaje: res.message, type: "success" });
      }
      UtilitariosService.loadingOff();
    }
  }

  showHideNewPassword(): void {
    if ($("#inc-clave").attr("type") === 'password') {
      this.newPasswordType = 'text';
    } else {
      this.newPasswordType = 'password';
    }
  }

  showHideConfirmPassword(): void {
    if ($("#inc-clave-repite").attr("type") === 'password') {
      this.confirmPasswordType = 'text';
    } else {
      this.confirmPasswordType = 'password';
    }
  }

}
