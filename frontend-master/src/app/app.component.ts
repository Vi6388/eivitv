import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ParametrosService } from '../app/service/parametros.service';

import { UtilitariosService } from './service/utilitarios.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(@Inject(DOCUMENT) private doc: any) {

  }

  ngOnInit(): void {
    this.doc.title = ParametrosService.nombreSistema;
    UtilitariosService.alertifyIncializarModal();
  }

}
