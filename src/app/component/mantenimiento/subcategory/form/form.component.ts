import { Component, Input, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category, DataDefault, ListPage, ResponseMessage, SubCategory } from 'src/app/core';
import { CategoryService } from 'src/app/core/services/system/category.service';
import { SubcategoryService } from 'src/app/core/services/system/subcategory.service';


@Component({
  selector: 'app-subcategory-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormSubCategoryComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() categoriaId: number = 0;
  @Input() formSubCategory: SubCategory
  @Input() parentMenuId: number = 0
  idSubcategory: number = 0
  title: string = 'Crear Sub Categoria';
  formGrupSubCate: FormGroup = new FormGroup({});
  submitted: boolean = false
  isLoading: boolean = false
  subCateModel: SubCategory
  categoria: Category[] = []
  tipoSubCategoria: any = []
  constructor(
    private formBuilder: FormBuilder,
    private totastService: ToastrService,
    config: NgbModalConfig,
    private subCategoryService: SubcategoryService,
    private categoriaService: CategoryService,
    private modalService: NgbModal, // Inyecta NgbModal directamente aquí
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.getCategoria()
    this.formGrupSubCate = this.formBuilder.group({
      subCategoria: this.formBuilder.array([]),
    });
    if (this.idSubcategory > 0) {
      this.setIdit()
    }
    this.tipoSubCategoria = DataDefault.SELECIONAR_TIPO_CATEGORIA_SUBCATEGORIA
  }
  get subCategoria() {
    return this.formGrupSubCate.get('subCategoria') as FormArray;
  }
  agregarSubCategory() {
    const subCategoria = this.formBuilder.group({
      subcategory_name: ['', Validators.required],
      type_sub_category: ['', Validators.required],
      // path: [""],
      category_id: ['', Validators.required],
    });
    if (this.subCategoria.length >= 10) {
      this.totastService.error("Está permitido registrar un máximo de 10 categorías y subcategorías por acción.");
      return
    }
    this.subCategoria.push(subCategoria);
    // this.subCategoria.setValidators(null)
  }
  eliminar(index: number) {
    this.subCategoria.removeAt(index);
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        this.formGrupSubCate.reset();
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
  onSubmit() {
    this.submitted = true
    if (this.formGrupSubCate.invalid) {
      return;
    }
    const subCategorias = this.formGrupSubCate.value.subCategoria as SubCategory[];
    if (this.idSubcategory === 0) {
      this.subCategoryService.register(subCategorias).subscribe({
        next: (res: ResponseMessage) => {
          this.totastService.success(res?.message);
          this.formGrupSubCate.reset();
          this.modalService.dismissAll();
          this.subCategoryService.saveStatus(true)
        },
        error: (err: any) => {
          console.log("err ", err)
          this.totastService.error(err?.error["0"]?.message);
        },
        complete: () => {
          console.log("finis")
        },
      })
    } else {
      // this.subCategoryService.update(this.idSubcategory, this.subCategoria).subscribe({
      //   next: (res: ResponseMessage) => {
      //     this.totastService.success(res?.message);
      //     this.formGrupSubCate.reset();
      //     this.modalService.dismissAll();
      //     this.subCategoryService.saveStatus(true)
      //   },
      //   error: (err: any) => {
      //     this.totastService.error(err?.message);
      //     console.log(err)
      //     this.modalService.dismissAll();
      //   },
      //   complete: () => {
      //     console.log("finis")
      //   },
      // })
    }
    
  }
  get f() {
    return this.formGrupSubCate;
  }
  setIdit () {
    this.formGrupSubCate?.setValue({
      category_name: this?.formSubCategory?.subcategory_name, 
      category_id: this?.formSubCategory?.category_id,
      type_sub_category: this?.formSubCategory?.type_sub_category,
      // path: this?.formSubCategory?.path,
    })
    this.idSubcategory = this?.formSubCategory?.id || 0
  }
  getCategoria() {
    this.categoriaService.get().subscribe({
      next: (res: ListPage) => {
        if(this.categoriaId > 0) {
          this.categoria = res.content.filter(f => f.id == this.categoriaId)
        
        } else {
          this.categoria = res.content
        }
      },
      error: (err: any) => {
      }
    })
  }

}
