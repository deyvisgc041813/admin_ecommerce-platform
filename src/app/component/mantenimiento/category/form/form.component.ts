import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category, ResponseMessage, DataDefault } from 'src/app/core';
import { CategoryService } from 'src/app/core/services/system/category.service';
@Component({
  selector: 'app-category-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormCategoryComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() formCategory: Category;
  idCategory: number = 0
  title: string = 'Crear Categoria';
  formGrupCate: FormGroup = new FormGroup({});
  submitted: boolean = false
  isLoading : boolean = false
  categoria: Category
  tipoCategoria: any = []
  constructor(
    private formBuilder: FormBuilder,
    private totastService: ToastrService,
    config: NgbModalConfig,
    private categoryService: CategoryService,
    private modalService: NgbModal, // Inyecta NgbModal directamente aquí
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.formGrupCate = this.formBuilder.group({
      category_name: ['', [Validators.required]],
      type_category: ['', [Validators.required]]
    });

    if (this.formCategory) {
      this.setIdit()
    }
    this.tipoCategoria = DataDefault.SELECIONAR_TIPO_CATEGORIA_SUBCATEGORIA
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        this.formGrupCate.reset();
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.formGrupCate.invalid) {
      return;
    }
    this.categoria = {
      category_name: this.formGrupCate.get("category_name")?.value,
      type_category: this.formGrupCate.get("type_category")?.value
    }
    if (this.idCategory === 0) {
      this.categoryService.register(this.categoria).subscribe({
        next: (res: ResponseMessage) => {
          this.totastService.success(res?.message);
          this.formGrupCate.reset();
          this.modalService.dismissAll();
          this.categoryService.saveStatus(true)
        },
        error: (err: any) => {
          this.totastService.error(err?.message);
          console.log(err)
          this.modalService.dismissAll();
        },
        complete: () => {
          console.log("finis")
        },
      })
    } else {
      this.categoryService.update(this.idCategory, this.categoria).subscribe({
        next: (res: ResponseMessage) => {
          this.totastService.success(res?.message);
          this.formGrupCate.reset();
          this.modalService.dismissAll();
          this.categoryService.saveStatus(true)
        },
        error: (err: any) => {
          this.totastService.error(err?.message);
          console.log(err)
          this.modalService.dismissAll();
        },
        complete: () => {
          console.log("finis")
        },
      })
    }
    
  }
  get f() {
    return this.formGrupCate;
  }
  setIdit () {
    this.formGrupCate?.setValue({
      category_name: this?.formCategory?.category_name,
    })
    this.idCategory = this?.formCategory?.id || 0
  }

}
