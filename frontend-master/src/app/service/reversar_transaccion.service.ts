import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { UtilitariosService } from './utilitarios.service';
declare var window: any;
declare var $: any;
declare var alertify: any;
@Injectable({
    providedIn: 'root'
})
export class ReversarTransaccionService {

    constructor() { }


    public static getRenderButton(td: any, cellData: any, rowData: any, row: any, col: any) {
        let key = UtilitariosService.GenerateKeyHex();
        let strIdentificador = rowData.id + key;
        setTimeout(async () => {
            let btn = document.getElementById(`id-reversar-${strIdentificador}`);
            if (btn) {
                let fun = async function () { await ReversarTransaccionService.cargarModalFormularioStatus(rowData) };
                btn.addEventListener("click", fun);
            }
        }, 50);
        return `<button id="id-reversar-${strIdentificador}" type="button" class="btn btn-danger btn-sm" title="Reversa Transacción"><i class="fa fa-reply"></i></button>`;

    }

    public static async cargarModalFormularioStatus(data: any) {
        UtilitariosService.loadingElementOn('idHtml');
        let id_venta = data.id || data.id_venta;
        let titulo = "Reversar Transacción";
        data.motivo = data.motivo || '';


        let html = `
        <div class="card-body">
                <div class="modal-body row">
                    <div class="col-sm-12 col-xs-12">
                        <div class="form-group">
                            <label>Documento</label>
                            <input class="form-control" value="${data.numero_factura}" disabled />
                        </div>  
                        <div class="form-group">
                            <label>Descripción</label>
                            <input class="form-control" value="${data.descripcion}" disabled />
                        </div>  
                        <div class="form-group">
                            <label>Observación</label>
                            <input class="form-control" value="${data.observacion}" disabled />
                        </div>  

                        <div class="form-group">
                            <label>Motivo</label>
                            <textarea id="id_motivo_reverso" placeholder="Ingrese motivo de rechazo" class="form-control" rows="3">${data.motivo}</textarea>
                        </div>  
                        
                        <br>
                        <button type="button" id="id_btn_ejeuctar_reverso" class="btn btn-block btn-outline-danger btn-sm">Realizar Reverso</button>

                    </div>  
                </div>
             
         </div> 
        
        `;




        alertify.modalEstandarProducto(html).setHeader(titulo);

        setTimeout(async () => {
            let btn_reversar = document.getElementById(`id_btn_ejeuctar_reverso`);
            if (btn_reversar) {
                let fun_reversar = async function () {
                    await ReversarTransaccionService.EjecutarReverso(data)
                };
                btn_reversar.addEventListener("click", fun_reversar);
            }
            UtilitariosService.loadingElementOff('idHtml');
        }, 50);



    }


    static async EjecutarReverso(data: any) {
        UtilitariosService.loadingElementOn('idHtml');
        let id_venta = data.id || data.id_venta;
        let motivo = $("#id_motivo_reverso").val();
        let endPoint = "red_facilito/reverso";
        let res: any = await GlobalService.Post(endPoint, { id_venta, motivo });
        if (res.status == 200) {
            let mensaje = res.message;
            UtilitariosService.Alertify_Close();
            UtilitariosService.Alertify_alert({ mensaje, type: "success" });
        }
        UtilitariosService.loadingElementOff('idHtml');
    }



}

