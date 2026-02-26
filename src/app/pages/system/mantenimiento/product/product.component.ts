import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import {  NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormProductComponent } from 'src/app/component/mantenimiento/product/form/form.component';

import { CompanyService, Producto, SedeService, TokenService } from 'src/app/core';
import { ProductoService } from 'src/app/core/services/system/producto.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit{
  // bread crum data
  breadCrumbItems: Array<{}>;
  companyId: number = 2
  tiendas: any = []
  tiendaDefault: number = 0
  constructor(
    private productService: ProductoService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private sedeService: SedeService,
    private tokenService: TokenService
  ) {
    config.backdrop = 'static';
		config.keyboard = false;
    this.breadCrumbItems = [{ label: 'Productos' }, { label: 'Historial de Productos', active: true }];
  }
  ngOnInit(): void {
    this.getTienda()
  }
  open() {
    const modalRef = this.modalService.open(FormProductComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl'});
    modalRef.componentInstance.titulo = 'Crear Producto';
  }
  onSuccess (event: any) {
    this.productService.saveStatus(event)
  }
  isUpdate (event: any) {
    const modalRef = this.modalService.open(FormProductComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl'});
    modalRef.componentInstance.titulo = 'Actualizar Producto';
    modalRef.componentInstance.formProduct  = event?.data as Producto;
  }
  getTienda() {
    const data = this.tokenService.decodeToken()
    const companyId = data?.user?.company_id ?? data?.company_id
    this.sedeService.getByIDcompanySede(companyId).subscribe({
      next: (res: any) => {
        this.tiendas = res;
        if(res && res.length > 0) {
          this.tiendaDefault = res[0].store_id
          
        }
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

}
