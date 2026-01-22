import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detalle-permiso',
  templateUrl: './detalle-permiso.component.html',
  styleUrls: ['./detalle-permiso.component.scss']
})
export class DetallePermisoComponent implements OnInit {
  @Input() data: any = [];
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    console.log(this.data)
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

}
