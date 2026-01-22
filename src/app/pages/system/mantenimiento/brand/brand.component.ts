import { Component, inject, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBrandComponent } from 'src/app/component/mantenimiento/brand/form-brand/form-brand.component';
import { Marca, SubCategory } from 'src/app/core';
import { SubcategoryService } from 'src/app/core/services/system/subcategory.service';


@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

    // bread crumb items
    breadCrumbItems: Array<{}>;
  constructor(
    private categoriaService: SubcategoryService,
    config: NgbModalConfig,
    private modalService: NgbModal, // Inyecta NgbModal directamente aquí
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Tables' }, { label: 'Basic Tables', active: true }];
  }
  open() {
    const modalRef = this.modalService.open(FormBrandComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    modalRef.componentInstance.titulo = 'Crear Marca';
  }
  onSuccess (event: any) {
    this.categoriaService.saveStatus(event)
  }
  isUpdate (event: any) {
    const modalRef = this.modalService.open(FormBrandComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    modalRef.componentInstance.titulo = 'Actualizar Marca';
    modalRef.componentInstance.formBrand  = event?.data as Marca;
  }

}
