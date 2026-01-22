import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  // bread crum data
  breadCrumbItems: Array<{}>;
  constructor(
    config: NgbModalConfig
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    this.breadCrumbItems = [
      { label: "Ventas" },
      { label: "Lista de Ventas", active: true },
    ];
  }
  ngOnInit(): void {
  }

}
