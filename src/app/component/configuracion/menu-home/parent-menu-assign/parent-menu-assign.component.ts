import { filter } from 'rxjs/operators';
import { Component, Input, OnInit, inject } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { GestionMenu } from "@rdinvesiones/core/interface/gestion-menu.interface";
import { ParentMenuService } from "@rdinvesiones/core/services/system/parent-menu.service";
import { ToastrService } from "ngx-toastr";
import {
  Category,
  DataDefault,
  ListPage,
  ResponseMessage,
  SubCategory,
} from "src/app/core";
import { CategoryService } from "src/app/core/services/system/category.service";

@Component({
  selector: "app-parent-menu-assign",
  templateUrl: "./parent-menu-assign.component.html",
  styleUrls: ["./parent-menu-assign.component.scss"],
})
export class ParentMenuAssignComponent implements OnInit {
  @Input() titulo: string = "";
  @Input() parentMenuId: number;
  title: string = "Crear Sub Categoria";
  formGrupMenu: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isLoading: boolean = false;
  categoria: Category[] = [];
  gestionMenu: GestionMenu = {
    categoryIds: [],
    parentMenuId: 0,
  };
  constructor(
    private formBuilder: FormBuilder,
    private totastService: ToastrService,
    config: NgbModalConfig,
    private categoriaService: CategoryService,
    private parentMenuService: ParentMenuService,
    private modalService: NgbModal, // Inyecta NgbModal directamente aquí
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.getCategoria();
    this.formGrupMenu = this.formBuilder.group({
      menuParent: this.formBuilder.array([]),
    });
    this.gestionMenu.parentMenuId = this.parentMenuId;
  }
  get menuParent() {
    return this.formGrupMenu.get("menuParent") as FormArray;
  }
  agregarMenu(): void {
    const menu = this.formBuilder.group({
      categoryId: [[], Validators.required],
    });
    if (this.menuParent.length >= 10) {
      this.totastService.error(
        "Está permitido registrar un máximo de 10 menus por acción.",
      );
      return;
    }
    this.menuParent.push(menu);
  }
  eliminar(index: number) {
    this.menuParent.removeAt(index);
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
    if (this.formGrupMenu.invalid) {
      return;
    }
    this.gestionMenu.categoryIds = this.menuParent.value.flatMap(
      (m) => m.categoryId ?? [],
    );
    this.parentMenuService.assignCategoriesToMainMenu(this.gestionMenu).subscribe({
      next: (res: ResponseMessage) => {
        this.totastService.success(res?.message);
        this.formGrupMenu.reset();
        this.modalService.dismissAll();
        this.parentMenuService.saveStatus(true);
      },
      error: (err: any) => {
        console.log("err ", err);
        this.totastService.error(err?.message);
      },
      complete: () => {
        console.log("finis");
      },
    });
  }
  get f() {
    return this.formGrupMenu;
  }
  getCategoria() {
    this.categoriaService.get()
    .subscribe({
      next: (res: ListPage) => {
        this.categoria = res.content.filter(cat => cat.type_category === DataDefault.SELECIONAR_TIPO_CATEGORIA_SUBCATEGORIA[0].val);
      },
      error: (err: any) => {},
    });
  }
}
