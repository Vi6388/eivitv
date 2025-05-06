
import { Injectable } from '@angular/core';
import { ParametrosService } from './parametros.service';
import { ResponseModel } from '../models/ResponseModel';
import { UtilitariosService } from './utilitarios.service';


declare var window: any;

@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  public static async Post(endPoint: string, parameter: any): Promise<ResponseModel> {

    const url = ParametrosService.url_service + '/' + endPoint;
    const headers = new Headers();
    const token = UtilitariosService.getToken();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('token', token);
    return new Promise((resolve, reject) => {

      fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(parameter),
      })
        .then((res) => res.json())
        .then((res) => {
          let mensaje = res.message;
          let status = res.status;
          if (status != 200 && status != 201) {
            UtilitariosService.Alertify_alert({ mensaje, type: "warning" });
          }
          if (res.auth) {
            UtilitariosService.removeToken();
            window.location = '/login';
          }
          resolve(res);
        })
        .catch((error: any) => {
          if (error.status == 403) {
            error = error.error;
            UtilitariosService.Alertify_alert({ mensaje: error.message, type: "warning" });
          } else {
            let mensaje = error.message == 'Failed to fetch' ? "No se ha establecido conexión con el servidor." : error.message;
            UtilitariosService.Alertify_alert({ mensaje, type: "error" });
          }
          if (error.auth) {
            UtilitariosService.removeToken();
            window.location = '/login';
          }
          reject(error);
        });
    });



  }



}
