import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/service/global.service';
import { ParametrosService } from 'src/app/service/parametros.service';
import { UtilitariosService } from 'src/app/service/utilitarios.service';
import { VerificarCupo } from 'src/app/models/GlobalModels';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public parametros: any = ParametrosService;

  constructor() { }

 
  ngOnInit(): void {
    this.verificarCupo();
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
    var Html =
      ` <div style=" margin: 10px;">
          <div class=" row">
          <div class="col-md-6 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-info"><i class="fa  fa-rocket"></i></span>

              <div class="info-box-content">
                <span class="info-box-text">Saldo</span>
                <span class="info-box-number">$${this.data_cupo.total_saldo}</span>
              </div> 
            </div> 
          </div> 
          <div class="col-md-6 col-sm-6 col-12">
            <div class="info-box">
              <span class="info-box-icon bg-success"><i class="fa  fa-star"></i></span>

              <div class="info-box-content">
                <span class="info-box-text">Ganancia</span>
                <span class="info-box-number">$${this.data_cupo.total_comision}</span>
              </div> 
            </div> 
          </div>   
        </div>
     </div>
    `;

    UtilitariosService.Alertify_Modal(icono, titulo, Html, botones);

  }


  public data_cupo: VerificarCupo = new VerificarCupo;

  async verificarCupo() {
    let endPoint = "saldos/visualizar/cupos";
    let res: any = await GlobalService.Post(endPoint, {});
    if (res.status == 200) {
      this.data_cupo = res.data;
    }
  }




}

