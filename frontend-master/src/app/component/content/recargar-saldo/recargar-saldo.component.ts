import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/service/global.service';
import { UtilitariosService } from 'src/app/service/utilitarios.service';
declare var $: any;
declare var alertify:any;

@Component({
  selector: 'app-recargar-saldo',
  templateUrl: './recargar-saldo.component.html',
  styleUrls: ['./recargar-saldo.component.css']
})
export class RecargarSaldoComponent implements OnInit, AfterViewInit {

  constructor() { }

  static i: any;
  public data_cuentas: Array<CuentaModel> = [];

  ngOnInit(): void {
    RecargarSaldoComponent.i = this;
    this.cargarCuentas();

  }

  ngAfterViewInit(): void {
    UtilitariosService.configurarTab();
  }


  public CargarModalPago(obj_cuenta: CuentaModel, obj_canal: CanalModel) {
    UtilitariosService.loadingElementOn('idHtml');
    var titulo = "Enviar Pago";
    var icono = "fas fa-money-check-alt";
    var html =
      ` 
<div class="col-sm-12">
    <div class="card card-widget widget-user shadow">
        <div class="widget-user-header bg-info" style="padding-bottom: 2px; padding-top: 2px;">
            <h3 class="widget-user-username">${obj_cuenta.banco_nombre}</h3>
            <h5 class="widget-user-desc">${obj_cuenta.cuenta}</h5>
        </div>
        <div class="widget-user-image" style="top: 60px;">
            <img class="img-circle elevation-2" src="${obj_cuenta.banco_icono}" alt="${obj_cuenta.banco_nombre}">
        </div>
    </div>
    <div class="modal-body row">
        <div class="col-sm-6 col-xs-12">
            <div class="form-group">
                <label>Canal de pago</label>
                <input type="text" class="form-control" placeholder="Ingrese Canal de pago ..."
                    value="${obj_canal.nombre}" disabled />
            </div>
            <div class="form-group">
                <label>Documento</label>
                <input id="id_pago_documento" type="text" maxlength="20" class="form-control"
                    placeholder="Ingrese numero de documento"  autocomplete="off"/>
                    <code></code>
            </div>  
            <div class="form-group">
                <label>Monto</label>
                <input id="id_pago_monto" type="number"  maxlength="5" class="form-control" placeholder="Ingrese monto"  autocomplete="off"/>
            </div>         
            <div class="form-group">
                <label>Fecha y Hora</label>
                <div class="input-group date" id="id_pago_fecha_datetime" data-target-input="nearest">
                    <div class="input-group-append" data-target="#id_pago_fecha_datetime" data-toggle="datetimepicker">
                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                    </div>
                    <input id="id_pago_fecha"  class="form-control datetimepicker-input"
                        data-target="#id_pago_fecha_datetime" placeholder="Ingrese fecha y hora"  autocomplete="off"/>
                </div>
            </div>
            <div class="form-group">
                <label>Comprobante</label>
                <input id="id_pago_comprobante" type="file" class="form-control" placeholder="Ingrese foto de comprobante"  autocomplete="off"/>
            </div>
         
            <div class="form-group">
                <label>Descripción</label>
                <textarea id="id_pago_descripcion" type="text" maxlength="500" class="form-control" rows="3"  autocomplete="off"
                    placeholder="Ingrese descripción"></textarea>
            </div>
        </div>

        <div class="col-sm-6 col-xs-12">
            <div class="form-group">
                <label>Ejemplo de comprobante </label>
                <div class="small-box ">
                    <div class="inner">
                        <h6 class="small-box-footer text-center"><i>${obj_cuenta.descripcion}</i> </h6>
                        <div class="card mb-2 img-box-comprobante">
                            <img class="card-img-top img-comprobante" src="${obj_canal.img_baucher}"
                                alt="${obj_canal.nombre}">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
      `;


    alertify.modalRescargarSaldo(html, {
     save: function () {
        RecargarSaldoComponent.i.enviarPago(obj_canal);
      }
    }).setHeader(`<i class="${icono}"></i>${titulo}`).closeOthers();




    setTimeout(() => {
      $('#id_pago_fecha_datetime').datetimepicker({ icons: { time: 'far fa-clock' } });
      UtilitariosService.loadingElementOff('idHtml');
    }, 500);

  }

  async cargarCuentas() {
    UtilitariosService.loadingElementOn('idHtml');
    let endPoint = "recargar_saldo/cuenta/list";
    let res: any = await GlobalService.Post(endPoint, {});
    if (res.status == 200) {
      this.data_cuentas = res.data;
    }
    UtilitariosService.loadingElementOff('idHtml');
  }


  async enviarPago(obj_canal: CanalModel) {
    UtilitariosService.loadingElementOn('idHtml');
    let el_documento = $('#id_pago_documento');
    let el_fecha = $('#id_pago_fecha');
    let el_comprobante = $('#id_pago_comprobante');
    let el_monto = $('#id_pago_monto');
    let el_descripcion = $('#id_pago_descripcion');

    let valido = true;
    let documento = el_documento.val();
    let fecha = el_fecha.val();
    let comprobante = el_comprobante.val();
    let monto = el_monto.val();
    let descripcion = el_descripcion.val();

    let id_cuenta_canal = obj_canal.id_cuenta_canal;


    el_documento.removeClass('is-invalid is-valid');
    if (documento.length == 0) {
      valido = false;
      el_documento.addClass('is-invalid');
    } else {
      el_documento.addClass('is-valid');
    }


    el_fecha.removeClass('is-invalid is-valid');
    if (fecha.length == 0) {
      valido = false;
      el_fecha.addClass('is-invalid');
    } else {
      el_fecha.addClass('is-valid');
    }


    el_comprobante.removeClass('is-invalid is-valid');
    if (comprobante.length == 0) {
      valido = false;
      el_comprobante.addClass('is-invalid');
    } else {
      el_comprobante.addClass('is-valid');
      let file = el_comprobante[0].files[0];
      comprobante = await UtilitariosService.toBase64(file);

    }

    el_monto.removeClass('is-invalid is-valid');
    if (monto.length == 0) {
      valido = false;
      el_monto.addClass('is-invalid');
    } else {
      el_monto.addClass('is-valid');
    }

    el_descripcion.removeClass('is-invalid is-valid');
    if (descripcion.length == 0) {
      valido = false;
      el_descripcion.addClass('is-invalid');
    } else {
      el_descripcion.addClass('is-valid');
    }


    if (valido) {
      let data = { id_cuenta_canal, documento, fecha, comprobante, monto, descripcion };
      let endPoint = "recargar_saldo/pago/guardar";
      let res: any = await GlobalService.Post(endPoint, data);
      if (res.status == 200) {
        let mensaje = res.message;
        UtilitariosService.Alertify_Close();
        UtilitariosService.Alertify_alert({ mensaje, type: "success" });
        alertify.closeAll();
      }
    } else {
      UtilitariosService.Alertify_alert({ mensaje: "Existen valores con inconsistencia que deben ser correjidos", type: "warning" });
    }

    UtilitariosService.loadingElementOff('idHtml');
  }

}


class CuentaModel {
  id!: number;
  banco_nombre!: string;
  banco_icono!: string;
  cuenta!: string;
  nombre!: string;
  cedula!: string;
  descripcion!: string;
  array_canales!: Array<CanalModel>;
}

class CanalModel {
  id_cuenta_canal!: number;
  id_canal_pago!: number;
  img_baucher!: string;
  descripcion!: string;
  nombre!: string;
}