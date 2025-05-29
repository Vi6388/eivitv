import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/service/global.service';
import { ParametrosService } from 'src/app/service/parametros.service';
import { UtilitariosService } from 'src/app/service/utilitarios.service';
import { VerificarCupo } from 'src/app/models/GlobalModels';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public parametros: any = ParametrosService;

  public textType: string = 'password';
  public data_cupo: VerificarCupo = new VerificarCupo;

  constructor() { }


  ngOnInit(): void {
    this.verificarCupo();
  }

  showHideValue(): void {
    this.textType = this.textType === 'text' ? 'password' : 'text';
  }

  async visualizar_montos() {
    await this.verificarCupo();
    var titulo = "Montos";
    var botones = {
      ok: {
        titulo: "Refrescar",
        evento: null
      },
      cancel: {
        titulo: "Cancelar",
        evento: null
      }
    }
    var icono = "fas fa-money-check-alt";

    const saldo = this.textType === 'password' ? '***' : this.data_cupo.total_saldo;
    const ganancia = this.textType === 'password' ? '***' : this.data_cupo.total_comision;

    const Html = `
      <div style="margin: 10px;">
        <div class="row">
          <div class="col-md-6 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-info"><i class="fa fa-rocket"></i></span>
              <div class="info-box-content">
                <span class="info-box-text">Saldo</span>
                <span class="info-box-number">$${saldo}</span>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-success"><i class="fa fa-star"></i></span>
              <div class="info-box-content">
                <span class="info-box-text">Ganancia</span>
                <span class="info-box-number">$${ganancia}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    UtilitariosService.Alertify_Modal(icono, titulo, Html, botones);

  }

  async verificarCupo() {
    let endPoint = "saldos/visualizar/cupos";
    let res: any = await GlobalService.Post(endPoint, {});
    if (res.status == 200) {
      this.data_cupo = res.data;
    }
  }




}

