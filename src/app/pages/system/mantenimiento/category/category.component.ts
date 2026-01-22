import { Component, inject } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormCategoryComponent } from 'src/app/component/mantenimiento/category/form/form.component';
import { Category } from 'src/app/core';
import { CategoryService } from 'src/app/core/services/system/category.service';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
    // bread crum data
  breadCrumbItems: Array<{}>;
  constructor(
    private categoriaService: CategoryService,
    config: NgbModalConfig,
    private modalService: NgbModal, // Inyecta NgbModal directamente aquí
  ) {
    config.backdrop = 'static';
		config.keyboard = false;
    this.breadCrumbItems = [{ label: 'Categorias' }, { label: 'Historial de Categorias', active: true }];

  }
  open() {
    const modalRef = this.modalService.open(FormCategoryComponent, { ariaLabelledBy: 'modal-basic-title',size: 'lg' });
    modalRef.componentInstance.titulo = 'Crear Categoria';
  }
  onSuccess (event: any) {
    this.categoriaService.saveStatus(event)
  }
  isUpdate (event: any) {
    const modalRef = this.modalService.open(FormCategoryComponent, { ariaLabelledBy: 'modal-basic-title'});
    modalRef.componentInstance.titulo = 'Actualizar Categoria';
    modalRef.componentInstance.formCategory  = event?.data as Category;
  }
}
