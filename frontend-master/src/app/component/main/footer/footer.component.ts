import { Component, OnInit } from '@angular/core';
import { ParametrosService } from 'src/app/service/parametros.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public parametros: any = ParametrosService;
  constructor() { }

  ngOnInit(): void {
  }

}
