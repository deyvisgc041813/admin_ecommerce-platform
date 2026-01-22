import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  @Input("isActivate") isActivate: boolean
  @Input("lista") lista: []
  constructor() { }
  ngOnInit(): void {
    console.log("isActivate", this.isActivate)
  }
  search($event) {
  }
  seleccionarClick(i: number) {

  }
}
