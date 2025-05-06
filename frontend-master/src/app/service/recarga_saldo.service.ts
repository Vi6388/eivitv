import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { UtilitariosService } from './utilitarios.service';
declare var window: any;
declare var $: any;
declare var alertify: any;
@Injectable({
    providedIn: 'root'
})
export class RecargaSaldoService {

    constructor() { }


    public static getRenderButton(td: any, cellData: any, rowData: any, row: any, col: any) {
        let key = UtilitariosService.GenerateKeyHex();
        let strIdentificador = rowData.id + key;
        setTimeout(async () => {
            let btn = document.getElementById(`id-validar-${strIdentificador}`);
            if (btn) {
                let fun = async function () { await RecargaSaldoService.cargarModalFormularioStatus(rowData) };
                btn.addEventListener("click", fun);
            }
        }, 50);
        return `<button id="id-validar-${strIdentificador}" type="button" class="btn btn-info btn-sm" title="Verificar Datos"><i class="fa fa-shield"></i></button>`;

    }

    public static async cargarModalFormularioStatus(data: any) {
        UtilitariosService.loadingElementOn('idHtml');
        let id_recarga_saldo = data.id || data.id_recarga_saldo;
        let endPoint = "recargar_saldo/recarga/saldo/verificar";
        let res: any = await GlobalService.Post(endPoint, { id_recarga_saldo });
        if (res.status == 200) {
            let obj_recarga: RecargaSaldoModel = res.data;
            let titulo = "Validar Recarga de Saldo";
            let html_rechazar = "";
            let html_aprobar = "";
            let status_background = ""

            if (obj_recarga.status == 0) {
                html_rechazar = `
            <div class="card card-danger">
                <div class="card-header">
                    <h4 class="card-title w-100">
                        <a class="d-block w-100 collapsed" data-toggle="collapse" href="#rechazar_rec_sal" aria-expanded="false">
                            Rechazar Recarga de Saldo
                        </a>
                    </h4>
                </div>
                <div id="rechazar_rec_sal" class="collapse" data-parent="#accordion_rec_sal">
                    <div class="card-body">
                        <div class="callout callout-info">
                            <h5>¿Seguro que desea rechazar esta solicitud de recarga de saldo?</h5>
                            <p>Se enviara un correo notificando al usuario el motivo del rechazo.</p>
                        </div>
                        <div class="form-group">
                            <label>Motivo de rechazo</label>
                            <textarea id="id_motivo_rec_sal" placeholder="Ingrese motivo de rechazo" class="form-control" rows="3">${obj_recarga.motivo}</textarea>
                        </div>
                        <button type="button" id="id_btn_rechazar_rec_sal" class="btn btn-block btn-outline-danger btn-sm">Rechazar Pago</button>
                    </div>
                </div>
            </div> ` ;

                html_aprobar = ` 
            <div class="card card-success">
                <div class="card-header">
                    <h4 class="card-title w-100">
                        <a class="d-block w-100 collapsed" data-toggle="collapse" href="#aprobar_rec_sal" aria-expanded="false">
                            Aprobar Recarga de Saldo
                        </a>
                    </h4>
                </div>
                <div id="aprobar_rec_sal" class="collapse" data-parent="#accordion_rec_sal">
                    <div class="card-body">
                        <div class="callout callout-info">
                            <h5>¿Seguro que desea aprobar esta solicitud de recarga de saldo?</h5>
                            <p>Se enviara un correo notificando al usuario la acreditacion de su saldo.</p>
                        </div>

                        <div class="form-group">
                            <label>Monto a aprobar</label>
                            <input class="form-control" value="${obj_recarga.monto}" disabled />
                        </div>

                        <button type="button" id="id_btn_aprobar_rec_sal" class="btn btn-block btn-outline-success btn-sm">Aprobar Pago</button>
                    </div>
                </div>
            </div> ` ;
            }


            if (obj_recarga.status == 1) {
                status_background = 'lightgreen';
            }

            if (obj_recarga.status == 2) {
                status_background = 'lightsalmon';
            }

            let html_motivo = "";
            if (obj_recarga.motivo) {
                html_motivo = `
                 <div class="form-group">
                    <label>Motivo</label>
                    <textarea class="form-control" rows="3" disabled>${obj_recarga.motivo}</textarea>
                </div>`;
            }

            let html_verificar = `
            <div class="card card-primary">
              <div class="card-header">
                  <h4 class="card-title w-100">
                      <a class="d-block w-100" data-toggle="collapse" href="#verifica_rec_sal" aria-expanded="true">
                          Verificacion de datos
                      </a>
                  </h4>
              </div>
              <div id="verifica_rec_sal" class="collapse show" data-parent="#accordion_rec_sal">
                  <div class="card-body">
                      <div class="modal-body row">
  
                          <div class="col-sm-6 col-xs-12">
                              <div class="form-group">
                                  <label>Banco</label>
                                  <input class="form-control" value="${obj_recarga.nombre_banco}" disabled />
                              </div>
                              <div class="form-group">
                                  <label>Cuenta</label>
                                  <input class="form-control" value="${obj_recarga.nombre_cuenta}" disabled />
                              </div>
                              <div class="form-group">
                                  <label>Canal de pago</label>
                                  <input class="form-control" value="${obj_recarga.nombre_canal}" disabled />
                              </div>
                              <div class="form-group">
                                  <label>Comprobante</label>
                                  <div class="small-box ">
                                      <div class="inner">
                                          <div class="card mb-2 img-box-comprobante">
                                              <img id="id_img_comprobante" class="card-img-top img-comprobante" src="${obj_recarga.comprobante}"  alt="${obj_recarga.descripcion}">
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col-sm-6 col-xs-12">
                              <div class="form-group">
                                  <label>Codigo</label>
                                  <input class="form-control" value="${obj_recarga.codigo_recarga}" disabled />
                              </div>
                              <div class="form-group">
                                  <label>Documento</label>
                                  <input class="form-control" value="${obj_recarga.documento}" disabled />
                              </div>
                              <div class="form-group">
                                  <label>Fecha Pago</label>
                                  <input class="form-control" value="${obj_recarga.fecha}" disabled />
                              </div>
                              <div class="form-group">
                                  <label>Monto</label>
                                  <input class="form-control" value="${obj_recarga.monto}" disabled />
                              </div>
                          
                              <div class="form-group">
                                  <label>Identificacion de usuario</label>
                                  <input class="form-control" value="${obj_recarga.dni}" disabled />
                              </div>
                              <div class="form-group">
                                  <label>Nombres de usuario</label>
                                  <input class="form-control" value="${obj_recarga.apellidos} ${obj_recarga.nombres}" disabled />
                              </div>
  
                              <div class="form-group">
                                  <label>Observación</label>
                                  <textarea class="form-control" rows="3" disabled>${obj_recarga.descripcion}</textarea>
                              </div>
                              <div class="form-group">
                                  <label>Status</label>
                                  <input class="form-control" value="${obj_recarga.status_nombre}"  style=" background: ${status_background};" disabled />
                              </div>
                              ${html_motivo}                            
        
                          </div>  
                      </div>
                  </div>
              </div>
          </div>  `;



            let html = ` 
                <div id="accordion_rec_sal">
                 ${html_verificar}
                 ${html_rechazar}
                 ${html_aprobar}                   
                </div>
 
                  `;
 
            alertify.modalEstandarProducto(html).setHeader(titulo);

            setTimeout(async () => {

                let btn_rechazar = document.getElementById(`id_btn_rechazar_rec_sal`);
                if (btn_rechazar) {
                    let fun_rechazar = async function () {
                        await RecargaSaldoService.RechazarSolicitudRecargaSaldo(obj_recarga)
                    };
                    btn_rechazar.addEventListener("click", fun_rechazar);
                }

                let btn_aprobar = document.getElementById(`id_btn_aprobar_rec_sal`);
                if (btn_aprobar) {
                    let fun_aprobar = async function () {
                        await RecargaSaldoService.AprobarSolicitudRecargaSaldo(obj_recarga)
                    };
                    btn_aprobar.addEventListener("click", fun_aprobar);
                }
                UtilitariosService.loadingElementOff('idHtml');
            }, 50);

        }
    }


    static async RechazarSolicitudRecargaSaldo(data: RecargaSaldoModel) {
        UtilitariosService.loadingElementOn('idHtml');
        let id_recarga_saldo = data.id_recarga_saldo;
        let motivo = $("#id_motivo_rec_sal").val();
        let endPoint = "recargar_saldo/recarga/saldo/rechazar";
        let res: any = await GlobalService.Post(endPoint, { id_recarga_saldo, motivo });
        if (res.status == 200) {
            let mensaje = res.message;
            UtilitariosService.Alertify_Close();
            UtilitariosService.Alertify_alert({ mensaje, type: "success" });
            await RecargaSaldoService.cargarModalFormularioStatus(data);
        }
        UtilitariosService.loadingElementOff('idHtml');
    }

    static async AprobarSolicitudRecargaSaldo(data: RecargaSaldoModel) {
        UtilitariosService.loadingElementOn('idHtml');
        let id_recarga_saldo = data.id_recarga_saldo;
        let endPoint = "recargar_saldo/recarga/saldo/aprobar";
        let res: any = await GlobalService.Post(endPoint, { id_recarga_saldo });
        if (res.status == 200) {
            let mensaje = res.message;
            UtilitariosService.Alertify_Close();
            UtilitariosService.Alertify_alert({ mensaje, type: "success" });
            await RecargaSaldoService.cargarModalFormularioStatus(data);
        }
        UtilitariosService.loadingElementOff('idHtml');
    }


}



class RecargaSaldoModel {

    id_recarga_saldo!: string;
    id_cuenta_canal!: string;
    codigo_recarga!: string;
    documento!: string;
    fecha!: string;
    comprobante!: string;
    monto!: string;
    descripcion!: string;
    id_usuario!: string;
    status!: number;
    status_nombre!: string;
    codigo_usuario!: string;
    nombres!: string;
    apellidos!: string;
    dni!: string;
    correo!: string;
    foto_img!: string;
    id_banco!: string;
    codigo_banco!: string;
    nombre_banco!: string;
    id_cuenta!: string;
    codigo_cuenta!: string;
    nombre_cuenta!: string;
    id_canal_pago!: string;
    codigo_canal!: string;
    nombre_canal!: string;
    motivo!: string;

}