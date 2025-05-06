import { AfterViewInit, Component, OnInit } from '@angular/core'; 
import { ParametrosService } from 'src/app/service/parametros.service';
import { AuthService } from 'src/app/service/auth.service';
declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  public parametros: any = ParametrosService;

  constructor(private _authService: AuthService) { }
  ngOnInit(): void {

  }

  public IniciarSesion() {

    let strEmail: any = $("#id-login-email").val();
    let strClave: any = $("#id-login-clave").val();

    this._authService.getLogin(strEmail, strClave)
      .then((response: any) => {
        debugger
        let data: any = response.data;
        let token: any = data.token || null;
        let usuario: any = data.usuario || {};
        let sistema: any = data.sistema || {};
        let menus: any = data.menus || [];
        localStorage.setItem("ms-token", token);
        localStorage.setItem("ms-usuario", JSON.stringify(usuario));
        localStorage.setItem("ms-sistema", JSON.stringify(sistema));
        localStorage.setItem("ms-menus", JSON.stringify(menus));
        window.location.href = '/'; 

      })
      .catch(error => {
        console.log(error);
      });


  }

  ngAfterViewInit(): void {
    $("body").removeClass("sidebar-mini layout-footer-fixed layout-fixed layout-navbar-fixed ");
    $("body").addClass(" login-page");
    setTimeout(() => {
      $("body")[0].removeAttribute("style");
    }, 300);

  }




}
