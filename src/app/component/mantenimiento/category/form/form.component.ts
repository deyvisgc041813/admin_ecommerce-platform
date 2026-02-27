import { Component, Input, OnInit, inject } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { Category, ResponseMessage, DataDefault } from "src/app/core";
import { CategoryService } from "src/app/core/services/system/category.service";
@Component({
  selector: "app-category-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
})
export class FormCategoryComponent implements OnInit {
  @Input() titulo: string = "";
  @Input() formCategory: Category;
  categoryId: number = 0;
  title: string = "Crear Categoria";
  submitted: boolean = false;
  isLoading: boolean = false;
  categoria: Category;
  tipoCategoria: any = [];
  formGrupCate!: FormGroup;
  files: File;
  filePrincipal: { file: File; preview: string }[] = [];
  previousPublicId: string | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private totastService: ToastrService,
    config: NgbModalConfig,
    private categoryService: CategoryService,
    private modalService: NgbModal,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.formGrupCate = this.formBuilder.group({
      categorias: this.formBuilder.array([]),
    });
    this.tipoCategoria = DataDefault.SELECIONAR_TIPO_CATEGORIA_SUBCATEGORIA;
    if (this?.formCategory?.id > 0) {
      this.categoryId = this.formCategory.id;
      this.loadMenuToEdit();
    } else {
      this.addMenu(); // inicia con uno
    }
  }
  get categorias(): FormArray {
    return this.formGrupCate.get("categorias") as FormArray;
  }
  addMenu() {
    if (this.categorias.length >= 5) {
      this.totastService.warning(
        "Solo puedes agregar máximo 5 categorias por operación",
      );
      return;
    }
    this.categorias.push(this.createCategoria());
    this.filePrincipal.push(null as any);
  }
  createCategoria(): FormGroup {
    return this.formBuilder.group({
      nombre: ["", Validators.required],
      tipoCategoria: ["", Validators.required],
      image: [null],
    });
  }
  removeMenu(index: number) {
    this.categorias.removeAt(index);
    this.filePrincipal.splice(index, 1);
  }

  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        this.formGrupCate.reset();
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.formGrupCate.invalid) return;
    const formData = new FormData();

    if (!this.formCategory) {
      this.categorias.controls.forEach((menu, index) => {
        const value = menu.value;
        formData.append(`categorias[${index}][nombre]`, value.nombre);
        formData.append(
          `categorias[${index}][tipoCategoria]`,
          value.tipoCategoria,
        );

        // Imagen si existe
        if (this.filePrincipal[index]?.file) {
          formData.append(
            `categorias[${index}][image]`,
            this.filePrincipal[index].file,
          );
        }
      });
      if (!this.validateFormArray(this.categorias, "Categorias")) {
        return;
      }
    } else {
      const category = this.categorias.at(0).value;
      formData.append("nombre", category.nombre);
      formData.append("tipoCategoria", category.tipoCategoria);
      if (this.filePrincipal[0]?.file) {
        formData.append("image", this.filePrincipal[0].file);
        formData.append("publicId", this.previousPublicId);
      }
    }

    this.isLoading = true;
    this.categoryService.save(this.categoryId, formData).subscribe({
      next: (res) => {
        this.totastService.success(res?.message);
        this.modalService.dismissAll();
        this.categoryService.saveStatus(true);
      },
      error: (err) => {
        this.totastService.error(err?.message);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  loadMenuToEdit() {
    this.previousPublicId = this.formCategory.public_id || null;
    this.categorias.clear();
    this.filePrincipal = [];
    this.categorias.push(
      this.formBuilder.group({
        nombre: [this.formCategory.category_name ?? "", Validators.required],
        tipoCategoria: [
          this.formCategory.type_category ?? "",
          Validators.required,
        ],
        image: [null],
      }),
    );
    if (this.formCategory.image_path) {
      this.filePrincipal[0] = {
        file: null,
        preview: this.formCategory.image_path,
      };
    }
  }
  onSelect(event: any, index: number) {
    const file: File = event.addedFiles[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.filePrincipal[index] = {
        file,
        preview: e.target.result,
      };

      this.categorias.at(index).patchValue({
        image: file,
      });
    };

    reader.readAsDataURL(file);
  }

  removeImage(index: number) {
    this.filePrincipal[index] = null;
    const group = this.categorias.at(index);
    group.get("image")?.setValue(null);
    group.get("image")?.markAsTouched();
    group.get("image")?.updateValueAndValidity();
  }
  private validateFormArray(formArray: FormArray, label: string): boolean {
    for (let i = 0; i < formArray.length; i++) {
      const group = formArray.at(i) as FormGroup;

      if (group.invalid) {
        group.markAllAsTouched();
        this.totastService.error(`${label} ${i + 1} tiene campos incompletos.`);
        return false;
      }
      if (!this.formCategory && !group.get("image")?.value) {
        this.totastService.error(`${label} ${i + 1} debe tener una imagen.`);
        return false;
      }
    }

    return true;
  }
  // constructor(
  //   private formBuilder: FormBuilder,
  //   private totastService: ToastrService,
  //   config: NgbModalConfig,
  //   private categoryService: CategoryService,
  //   private modalService: NgbModal, // Inyecta NgbModal directamente aquí
  // ) {
  //   config.backdrop = 'static';
  //   config.keyboard = false;
  // }
  // ngOnInit(): void {
  //   this.formGrupCate = this.formBuilder.group({
  //     nombre: ['', [Validators.required]],
  //     tipoCategoria: ['', [Validators.required]]
  //   });

  //   if (this.formCategory) {
  //     this.setIdit()
  //   }
  //   this.tipoCategoria = DataDefault.SELECIONAR_TIPO_CATEGORIA_SUBCATEGORIA
  // }
  // getDismissReason(reason: any): string {
  //   switch (reason) {
  //     case ModalDismissReasons.BACKDROP_CLICK:
  //       this.modalService.dismissAll();
  //       this.formGrupCate.reset();
  //       return 'by clicking on a backdrop';
  //     default:
  //       return `with: ${reason}`;
  //   }
  // }
  // onSubmit() {
  //   this.submitted = true;
  //   if (this.formGrupCate.invalid) {
  //     return;
  //   }
  //   this.categoria = {
  //     nombre: this.formGrupCate.get("nombre")?.value,
  //     tipoCategoria: this.formGrupCate.get("tipoCategoria")?.value
  //   }
  //   if (this.idCategory === 0) {
  //     this.categoryService.register(this.categoria).subscribe({
  //       next: (res: ResponseMessage) => {
  //         this.totastService.success(res?.message);
  //         this.formGrupCate.reset();
  //         this.modalService.dismissAll();
  //         this.categoryService.saveStatus(true)
  //       },
  //       error: (err: any) => {
  //         this.totastService.error(err?.message);
  //         console.log(err)
  //         this.modalService.dismissAll();
  //       },
  //       complete: () => {
  //         console.log("finis")
  //       },
  //     })
  //   } else {
  //     this.categoryService.update(this.idCategory, this.categoria).subscribe({
  //       next: (res: ResponseMessage) => {
  //         this.totastService.success(res?.message);
  //         this.formGrupCate.reset();
  //         this.modalService.dismissAll();
  //         this.categoryService.saveStatus(true)
  //       },
  //       error: (err: any) => {
  //         this.totastService.error(err?.message);
  //         console.log(err)
  //         this.modalService.dismissAll();
  //       },
  //       complete: () => {
  //         console.log("finis")
  //       },
  //     })
  //   }

  // }
  // get f() {
  //   return this.formGrupCate;
  // }
  // setIdit () {
  //   console.log("this?.formCategory ", this?.formCategory)
  //   this.formGrupCate?.setValue({
  //     nombre: this?.formCategory?.nombre,
  //     tipoCategoria: this?.formCategory?.tipoCategoria
  //   })
  //   this.idCategory = this?.formCategory?.id || 0
  // }
}
