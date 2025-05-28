import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuRecursivoComponent } from './component/main/sidebar-left/menu-recursivo.component'; 
import { HeaderComponent } from './component/main/header/header.component';
import { FooterComponent } from './component/main/footer/footer.component';
import { BodyComponent } from './component/main/body/body.component';
import { LoginComponent } from './component/main/login/login.component';
import { RegisterComponent } from './component/main/register/register.component';
import { HomeComponent } from './component/content/home/home.component';
import { DasboardComponent } from './component/content/dasboard/dasboard.component';
import { PageNotFoundComponent } from './component/main/page-not-found/page-not-found.component';
import { ReporteComponent } from './component/content/reporte/reporte.component';
import { UsuarioComponent } from './component/content/usuario/usuario.component';
import { TransaccionesComponent } from './component/content/transacciones/transacciones.component';
import { ConfiguracionComponent } from './component/content/configuracion/configuracion.component';
import { PreloaderComponent } from './component/main/preloader/preloader.component';
import { PerfilComponent } from './component/content/perfil/perfil.component';
import { RecargarSaldoComponent } from './component/content/recargar-saldo/recargar-saldo.component';
import { ManagerComponent } from './component/main/manager/manager.component';
import { HttpClientModule } from '@angular/common/http';
import { GestorComponent } from './component/content/gestor/gestor.component';
import { SidebarLeftComponent } from './component/main/sidebar-left/sidebar-left.component';
import { SidebarRightComponent } from './component/main/sidebar-right/sidebar-right.component';
import { RecuperarClaveComponent } from './component/main/recuperar-clave/recuperar-clave.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuRecursivoComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DasboardComponent,
    PageNotFoundComponent,
    ReporteComponent,
    UsuarioComponent,
    TransaccionesComponent,
    ConfiguracionComponent,
    PreloaderComponent,
    PerfilComponent,
    RecargarSaldoComponent,
    ManagerComponent,
    GestorComponent,
    SidebarLeftComponent,
    SidebarRightComponent,
    RecuperarClaveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ], 
  bootstrap: [AppComponent]
})
export class AppModule { }
