import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UtilitariosService } from 'src/app/service/utilitarios.service';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.css']
})
export class TransaccionesComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    UtilitariosService.configurarTab();
  }


}
