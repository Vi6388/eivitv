import { Component, OnInit } from '@angular/core';
import { UtilitariosService } from 'src/app/service/utilitarios.service';
import { ParametrosService } from '../../../service/parametros.service';
import { GlobalService } from 'src/app/service/global.service';
import { menuModel } from 'src/app/models/MenuModel';

@Component({
  selector: 'app-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.css']
})
export class SidebarLeftComponent implements OnInit {

  public parametros: any = ParametrosService;
  public dataUsuario: any = UtilitariosService.getDataUsuario();
  constructor(private utilitariosServce: UtilitariosService) { }
  public dataMenu: Array<menuModel> = [];

  public textType: string = "";

  ngOnInit(): void {
    this.getDataMenu();
    this.utilitariosServce.currentTextType.subscribe(textType => {
      this.textType = textType;
    });
  }


  async getDataMenu() {
    let endPoint = "general/private/menu";
    let res: any = await GlobalService.Post(endPoint, {});
    if (res.status == 200) {
      this.dataMenu = res.data;
    }
  }

}
