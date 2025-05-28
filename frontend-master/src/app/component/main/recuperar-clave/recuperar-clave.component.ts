import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { ParametrosService } from 'src/app/service/parametros.service';
import { UtilitariosService } from 'src/app/service/utilitarios.service';

@Component({
  selector: 'app-recuperar-clave',
  templateUrl: './recuperar-clave.component.html',
  styleUrls: ['./recuperar-clave.component.css']
})
export class RecuperarClaveComponent implements OnInit {

  parametros: any = {};
  step: number = 1; // 1: email input, 2: code verification, 3: new password
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // this.parametros = ParametrosService.parametros;
  }

  // async sendRecoveryEmail() {
  //   if (!this.email || !UtilitariosService.validarEmail(this.email)) {
  //     UtilitariosService.mostrarAlerta('Por favor ingrese un email válido', 'warning');
  //     return;
  //   }

  //   this.loading = true;
  //   try {
  //     const response = await this.authService.sendPasswordRecovery(this.email);
  //     if (response.status === 200) {
  //       this.step = 2;
  //       UtilitariosService.mostrarAlerta('Código de verificación enviado a su email', 'success');
  //     } else {
  //       UtilitariosService.mostrarAlerta(response.message || 'Error al enviar código', 'error');
  //     }
  //   } catch (error) {
  //     UtilitariosService.mostrarAlerta('Error al enviar código de recuperación', 'error');
  //   }
  //   this.loading = false;
  // }

  // async verifyCode() {
  //   if (!this.verificationCode || this.verificationCode.length < 6) {
  //     UtilitariosService.mostrarAlerta('Por favor ingrese el código de verificación', 'warning');
  //     return;
  //   }

  //   this.loading = true;
  //   try {
  //     const response = await this.authService.verifyRecoveryCode(this.email, this.verificationCode);
  //     if (response.status === 200) {
  //       this.step = 3;
  //       UtilitariosService.mostrarAlerta('Código verificado correctamente', 'success');
  //     } else {
  //       UtilitariosService.mostrarAlerta(response.message || 'Código inválido', 'error');
  //     }
  //   } catch (error) {
  //     UtilitariosService.mostrarAlerta('Error al verificar código', 'error');
  //   }
  //   this.loading = false;
  // }

  // async resetPassword() {
  //   if (!this.newPassword || this.newPassword.length < 6) {
  //     UtilitariosService.mostrarAlerta('La contraseña debe tener al menos 6 caracteres', 'warning');
  //     return;
  //   }

  //   if (this.newPassword !== this.confirmPassword) {
  //     UtilitariosService.mostrarAlerta('Las contraseñas no coinciden', 'warning');
  //     return;
  //   }

  //   this.loading = true;
  //   try {
  //     const response = await this.authService.resetPassword(this.email, this.verificationCode, this.newPassword);
  //     if (response.status === 200) {
  //       UtilitariosService.mostrarAlerta('Contraseña actualizada correctamente', 'success');
  //       setTimeout(() => {
  //         window.location.href = '/login';
  //       }, 2000);
  //     } else {
  //       UtilitariosService.mostrarAlerta(response.message || 'Error al actualizar contraseña', 'error');
  //     }
  //   } catch (error) {
  //     UtilitariosService.mostrarAlerta('Error al actualizar contraseña', 'error');
  //   }
  //   this.loading = false;
  // }

  goBack() {
    if (this.step > 1) {
      this.step--;
    } else {
      window.location.href = '/login';
    }
  }
}