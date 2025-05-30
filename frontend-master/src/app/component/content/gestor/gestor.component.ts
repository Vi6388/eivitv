import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilitariosService } from 'src/app/service/utilitarios.service';
import { RecargaSaldoService } from 'src/app/service/recarga_saldo.service';
import { ReversarTransaccionService } from 'src/app/service/reversar_transaccion.service';
import { GlobalService } from 'src/app/service/global.service';
import { moduloModel } from 'src/app/models/ModuloModel';
import { menuModel } from 'src/app/models/MenuModel';
declare var document: any;



@Component({
  selector: 'app-gestor',
  templateUrl: './gestor.component.html',
  styleUrls: ['./gestor.component.css']
})
export class GestorComponent implements OnInit, AfterViewInit {



  constructor(private activatedRoute: ActivatedRoute) { }
  public dataMenu: menuModel = new menuModel();
  public dataModulo: moduloModel = new moduloModel();
  public objDataManager: any;

  public extOpciones: any = {
    reversarTransaccion: ReversarTransaccionService.getRenderButton,
    validarRecargaSaldo: RecargaSaldoService.getRenderButton
  }



  ngOnInit(): void {
    UtilitariosService.getVericarSession();
    let crud = this.activatedRoute.snapshot.params.crud;
    let base64String = this.activatedRoute.snapshot.queryParams.data;
    let jsonString = atob(base64String);
    this.dataMenu = JSON.parse(jsonString);
    this.getDataModulo();


  }

  ngAfterViewInit(): void {
    UtilitariosService.configurarTab();
  }


  async getDataModulo() {
    let id_modulo = this.dataMenu.id_modulo;
    let id_perfil = this.dataMenu.id_perfil;
    if (id_perfil && id_modulo) {
      let endPoint = "general/private/modulo";
      let res: any = await GlobalService.Post(endPoint, { id_perfil, id_modulo });
      if (res.status == 200) {
        this.dataModulo = res.data;
        console.log(this.dataModulo);
        let opciones: any[] = [];
        this.dataModulo.accion.forEach(el => {
          let fun = this.extOpciones[el];
          if (fun) {
            opciones.push(fun);
          }
        });

        this.dataModulo.config.opciones = opciones;
        if(id_modulo === 9) {
          this.dataModulo.config.order = 3;
        } else if(id_modulo === 35) {
          this.dataModulo.config.order = 5;
        }

        this.objDataManager = this.dataModulo.config;
      }
    }

  }





}
