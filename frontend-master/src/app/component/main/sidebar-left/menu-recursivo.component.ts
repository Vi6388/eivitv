import { Component, Input } from '@angular/core';
import { menuModel } from 'src/app/models/MenuModel';


@Component({
  selector: 'app-menu-recursivo',
  template: ` 
   
      <li *ngFor="let item of dataMenu; index as i; first as isFirst" class="nav-item ">
        <a  (click)="irModulo(item)"  [href]="item.hrefValor"  class="nav-link" [ngClass]="{'active': isFirst}"> 
          <i class="nav-icon  {{item.icono}}"></i>
          <p> {{item.nombre}} <i *ngIf="item.subMenus.length !=0" class="right fas fa-angle-left"></i> </p>
        </a>
        <ul *ngIf="item.subMenus.length !=0" class="nav nav-treeview">
          <app-menu-recursivo *ngIf="item.subMenus" [dataMenu]="item.subMenus"></app-menu-recursivo>
        </ul>
      </li>


 
  `
})


export class MenuRecursivoComponent {
  @Input() dataMenu?: Array<menuModel>;
  constructor() { }

  public irModulo(itemMenu: menuModel) {
    if (itemMenu.subMenus.length == 0) {
      const objetoJSON: any = itemMenu;
      const jsonString = JSON.stringify(objetoJSON);
      const base64String = btoa(jsonString);
      const url = itemMenu.link + '?data=' + base64String;
      itemMenu.hrefValor = url;
    }

  }


}
