import { Component, OnInit } from '@angular/core';
import { ICategoriaHome } from '@rdinvesiones/core/interface/general.interface';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService, SubcategoryService } from 'src/app/core';
import { NavegacionPrincipalComponent } from './navegacion-principal/navegacion-principal.component';
import { ToastrService } from 'ngx-toastr';
import { DestacadoComponent } from './destacado/destacado.component';
import { FormSubCategoryComponent } from '../../mantenimiento/subcategory/form/form.component';
import { FormCategoryComponent } from '../../mantenimiento/category/form/form.component';
@Component({
  selector: 'app-menu-home',
  templateUrl: './menu-home.component.html',
  styleUrls: ['./menu-home.component.scss']
})
export class MenuHomeComponent implements OnInit {


  // bread crumb items
  breadCrumbItems: Array<{}>;

  shopsData: ICategoriaHome[];
  constructor(
    private categoriaService: CategoryService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private subCategoriaService: SubcategoryService
  ) {
    config.backdrop = 'static';
		config.keyboard = false;
  }

  ngOnInit() {
    this.obserbableOpertator()
    this.obserbableOpertatorCategoria()
    this.breadCrumbItems = [{ label: 'Ecommerce' }, { label: 'Menu Principal', active: true }];

    /**
     * fetches data
     */
    this._fetchData();
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
      this.categoriaService.getMenuHome().subscribe({
        next:(res: any) => {
          this.shopsData = res.map(element => {
            return {
              name: element.category_name,
              subCategoria: element.subCategoria,
              categoryId: element.id,
              color: "primary"
            };
          });
        }, 
        error: (err: any) => {

        }
      })
  }
  agregar(id: number) {
    const modalRef = this.modalService.open(FormSubCategoryComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl'});
    modalRef.componentInstance.titulo = 'Generar sub menu';
    modalRef.componentInstance.categoriaId = id
  }
  navegacionPrincipal(id: number) {
    const modalRef = this.modalService.open(NavegacionPrincipalComponent, { ariaLabelledBy: 'modal-basic-title',size: 'lg' });
    modalRef.componentInstance.titulo = 'Crear Menu Principal';
    modalRef.componentInstance.categoryId = id
  }
  addDestacado(id: number) {
    const modalRef = this.modalService.open(DestacadoComponent, { ariaLabelledBy: 'modal-basic-title',size: 'lg' });
    modalRef.componentInstance.categoryId = id
  }
  obserbableOpertator() {
    this.subCategoriaService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
       if (res) this._fetchData();
      }
    })
  }
  obserbableOpertatorCategoria() {
    this.categoriaService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        if (res) this._fetchData();
      }
    })
  }
}
