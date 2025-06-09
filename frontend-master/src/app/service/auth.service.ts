import { Injectable } from '@angular/core';
import { ParametrosService } from './parametros.service';
import { UtilitariosService } from './utilitarios.service';

// jQuery
declare var $: any;
declare var document: any;

@Injectable({
	providedIn: 'root'
})

export class AuthService {


	constructor() {
	}

	public async getLogin(correo: string, clave: string) {

		const url = ParametrosService.url_service+ '/login';
		const headers = new Headers();
		headers.append('Accept', 'application/json');
		headers.append('Content-Type', 'application/json');

		let parameter = { correo, clave };

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
					} else {
						resolve(res);
					}

				})
				.catch((error: any) => {
					if (error.status == 403) {
						error = error.error;
						UtilitariosService.Alertify_alert({ mensaje: error.message, type: "warning" });
					} else {
						UtilitariosService.Alertify_alert({ mensaje: error.message, type: "error" });
					}
					reject(error);
				});
		});

	}

	logOut() {
		UtilitariosService.removeToken();
	}
}
