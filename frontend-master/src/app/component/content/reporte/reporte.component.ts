import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UtilitariosService } from 'src/app/service/utilitarios.service';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit , AfterViewInit{

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    UtilitariosService.configurarTab();
  }

}
