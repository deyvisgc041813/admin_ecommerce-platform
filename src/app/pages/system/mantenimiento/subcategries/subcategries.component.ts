import { Component, inject, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormSubCategoryComponent } from 'src/app/component/mantenimiento/subcategory/form/form.component';
import { SubCategory } from 'src/app/core';
import { SubcategoryService } from 'src/app/core/services/system/subcategory.service';


@Component({
  selector: 'app-subcategries',
  templateUrl: './subcategries.component.html',
  styleUrls: ['./subcategries.component.scss']
})
export class SubcategriesComponent implements OnInit {
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
    const modalRef = this.modalService.open(FormSubCategoryComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl'});
    modalRef.componentInstance.titulo = 'Crear Sub Categoria';
  }
  onSuccess (event: any) {
    this.categoriaService.saveStatus(event)
  }
  isUpdate (event: any) {
    const modalRef = this.modalService.open(FormSubCategoryComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl'});
    modalRef.componentInstance.titulo = 'Actualizar Sub Categoria';
    modalRef.componentInstance.formSubCategory  = event?.data as SubCategory;
  }
}
