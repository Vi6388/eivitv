import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UtilitariosService } from 'src/app/service/utilitarios.service';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor() { }
  ngOnInit(): void {
    UtilitariosService.getVericarSession();
 

  }

  ngAfterViewInit(): void {
    $("body").removeClass("layout-navbar-fixed");//ajuste de tab
    UtilitariosService.hiddenMenuHome();
  }


}




