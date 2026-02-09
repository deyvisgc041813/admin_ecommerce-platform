import { Component, OnInit } from '@angular/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {

 // bread crum data
  breadCrumbItems: Array<{}>;
  constructor(
    config: NgbModalConfig
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    this.breadCrumbItems = [
      { label: "Pedidos" },
      { label: "Historial", active: true },
    ];
  }
  ngOnInit(): void {
  }

}
