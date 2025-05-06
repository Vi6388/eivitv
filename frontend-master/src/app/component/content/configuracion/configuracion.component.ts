import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UtilitariosService } from 'src/app/service/utilitarios.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    UtilitariosService.configurarTab();
  }

}
