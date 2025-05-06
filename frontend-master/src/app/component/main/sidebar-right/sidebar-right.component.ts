import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UtilitariosService } from 'src/app/service/utilitarios.service';
import { AuthService } from 'src/app/service/auth.service';
declare var window: any;

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.css']
})
export class SidebarRightComponent implements OnInit {
  public dataUsuario: any = UtilitariosService.getDataUsuario();
  constructor(private location: Location, private router: Router, private _authService: AuthService) { }

  ngOnInit(): void {
  }

  public cerrarSesion() {
    this._authService.logOut();
    this.location.replaceState('/');
    this.router.navigate(['login']);
  }
  public visualizarPerfil() {
    window.location.href = '/perfil';
  }
}
