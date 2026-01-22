import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormMenuComponent } from 'src/app/component/configuracion/operator-menu/form-menu/form-menu.component';
import { ProductoService } from 'src/app/core';

@Component({
  selector: 'app-operator-menu',
  templateUrl: './operator-menu.component.html',
  styleUrls: ['./operator-menu.component.scss']
})
export class OperatorMenuComponent implements OnInit {

  constructor(private productService: ProductoService,
    config: NgbModalConfig,
    private modalService: NgbModal) {
      config.backdrop = 'static';
      config.keyboard = false;
  }

  ngOnInit(): void {
  }
  onSuccess(event: any) {
    this.productService.saveStatus(event)
  }
  isUpdate(event: any) {
    const size = event.tipoMenu === "principal" ? 'lg' : 'xl' ;
    const modalRef = this.modalService.open(FormMenuComponent, { ariaLabelledBy: 'modal-basic-title', size });
    modalRef.componentInstance.titulo = event.tipoMenu === "principal" ? 'Crear Sub Menu Principal' : 'Crear Sub Menu Secundario' ;
    modalRef.componentInstance.form = event
  }
}
