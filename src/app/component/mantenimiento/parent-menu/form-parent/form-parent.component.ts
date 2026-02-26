import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { ParentMenu } from "@rdinvesiones/core/interface/parent_menu.interface";
import { ParentMenuService } from "@rdinvesiones/core/services/system/parent-menu.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-form-parent",
  templateUrl: "./form-parent.component.html",
  styleUrls: ["./form-parent.component.scss"],
})
export class FormParentComponent implements OnInit {
  @Input() titulo: string = "";
  @Input() formParentMenu: ParentMenu;
  parentId: number = 0;
  title: string = "Crear Categoria";
  formGrupMenu!: FormGroup;
  submitted: boolean = false;
  isLoading: boolean = false;
  files: File;
  filePrincipal: { file: File; preview: string }[] = [];
  previousPublicId: string | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private totastService: ToastrService,
    config: NgbModalConfig,
    private parentMenuService: ParentMenuService,
    private modalService: NgbModal, // Inyecta NgbModal directamente aquí
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.formGrupMenu = this.formBuilder.group({
      menus: this.formBuilder.array([]),
    });
    if (this?.formParentMenu?.parentId > 0) {
      this.parentId = this?.formParentMenu?.parentId || 0;
      this.loadMenuToEdit(this.formParentMenu);
    } else {
      this.addMenu(); // inicia con uno
    }
  }
  get menus(): FormArray {
    return this.formGrupMenu.get("menus") as FormArray;
  }
  addMenu() {
    if (this.menus.length >= 5) {
      this.totastService.warning(
        "Solo puedes agregar máximo 5 menús por operación",
      );
      return;
    }
    this.menus.push(this.createMenu());
    this.filePrincipal.push(null as any);
  }

  removeMenu(index: number) {
    this.menus.removeAt(index);
    this.filePrincipal.splice(index, 1);
  }
  createMenu(): FormGroup {
    return this.formBuilder.group({
      descripcion: ["", [Validators.required, Validators.maxLength(40)]],
      image: [null],
    });
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        this.formGrupMenu.reset();
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }
  onSubmit() {
    this.submitted = true;

    if (this.formGrupMenu.invalid) return;
    const formData = new FormData();
    if (this.parentId == 0) {
      this.menus.controls.forEach((menu, index) => {
        formData.append(`menus[${index}][descripcion]`, menu.value.descripcion);
        if (this.filePrincipal[index]?.file) {
          formData.append(
            `menus[${index}][image]`,
            this.filePrincipal[index].file,
          );
        }
      });
    } else {
      const menu = this.menus.at(0).value;
      formData.append("descripcion", menu.descripcion);
      if (this.filePrincipal[0]?.file) {
        formData.append("image", this.filePrincipal[0].file);
        formData.append("publicId", this.previousPublicId);
      }
    }
    this.isLoading = true;
    this.parentMenuService.save(formData, this.parentId).subscribe({
      next: (res) => {
        this.totastService.success(res?.message);
        this.modalService.dismissAll();
        this.parentMenuService.saveStatus(true);
      },
      error: (err) => {
        this.totastService.error(err?.message);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  loadMenuToEdit(menu: any) {
    this.previousPublicId = menu.publicId || null;
    this.menus.clear();
    this.filePrincipal = [];
    this.menus.push(
      this.formBuilder.group({
        //id: [menu.id],
        descripcion: [
          menu.descripcion,
          [Validators.required, Validators.maxLength(40)],
        ],
        image: [null],
      }),
    );

    // si quieres mostrar imagen existente
    if (menu.logo) {
      this.filePrincipal[0] = {
        file: null,
        preview: menu.logo,
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

      this.menus.at(index).patchValue({
        image: file,
      });
    };

    reader.readAsDataURL(file);
  }


}
