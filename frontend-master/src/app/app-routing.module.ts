import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracionComponent } from './component/content/configuracion/configuracion.component';
import { DasboardComponent } from './component/content/dasboard/dasboard.component';
import { GestorComponent } from './component/content/gestor/gestor.component';
import { HomeComponent } from './component/content/home/home.component';
import { PerfilComponent } from './component/content/perfil/perfil.component'; 
import { RecargarSaldoComponent } from './component/content/recargar-saldo/recargar-saldo.component';
import { ReporteComponent } from './component/content/reporte/reporte.component';
import { TransaccionesComponent } from './component/content/transacciones/transacciones.component';
import { UsuarioComponent } from './component/content/usuario/usuario.component';
import { LoginComponent } from './component/main/login/login.component';
import { PageNotFoundComponent } from './component/main/page-not-found/page-not-found.component';
import { RegisterComponent } from './component/main/register/register.component';
import { RecuperarClaveComponent } from './component/main/recuperar-clave/recuperar-clave.component';

const routes: Routes = [
  { path: '', component: HomeComponent},  

  { path: 'dasboard', component: DasboardComponent},
  { path: 'gestor/:crud', component:  GestorComponent}, 

  { path: 'reporte', component: ReporteComponent},
  { path: 'usuario', component: UsuarioComponent}, 


  { path: 'transacciones', component: TransaccionesComponent},  
  { path: 'configuracion', component: ConfiguracionComponent}, 
  { path: 'perfil', component: PerfilComponent}, 
  { path: 'recargar/saldo', component: RecargarSaldoComponent}, 

  
  { path: 'login', component: LoginComponent}, 
  { path: 'register', component: RegisterComponent},
  { path: 'recuperar/clave', component: RecuperarClaveComponent },
  { path: '**', component: PageNotFoundComponent },  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
