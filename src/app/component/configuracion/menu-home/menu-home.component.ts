import { Component, OnInit } from "@angular/core";
import { ICategoriaHome } from "@rdinvesiones/core/interface/general.interface";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ListPage } from "src/app/core";
import { NavegacionPrincipalComponent } from "./navegacion-principal/navegacion-principal.component";
import { DestacadoComponent } from "./destacado/destacado.component";
import { ParentMenuService } from "@rdinvesiones/core/services/system/parent-menu.service";
import { ParentMenuAssignComponent } from "./parent-menu-assign/parent-menu-assign.component";
import { MenuService } from "@rdinvesiones/core/services/system/menu.service";
@Component({
  selector: "app-menu-home",
  templateUrl: "./menu-home.component.html",
  styleUrls: ["./menu-home.component.scss"],
})
export class MenuHomeComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  shopsData: ICategoriaHome[];
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private menuService: MenuService,
    private parentMenuService: ParentMenuService,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }

  ngOnInit() {
    this.obserbableOpertator();
    this.obserbableOpertatorMenu();
    this.breadCrumbItems = [
      { label: "Ecommerce" },
      { label: "Menu Principal", active: true },
    ];
    this._fetchData();
  }
  private _fetchData() {
    this.parentMenuService.fetchMainMenuConfig()
    .subscribe({
      next: (res: ListPage) => {
        this.shopsData = res.content.map((element) => {
          return {
            name: element.parentName,
            logo: element.logoUrl,
            categorias: element.categorias,
            parentId: element.parentId,
            color: "primary",
          };
        });
      },
      error: (err: any) => {},
    });
  }
  agregar(parentId: number) {
    const modalRef = this.modalService.open(ParentMenuAssignComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
    });
    modalRef.componentInstance.titulo =
      "Gestión de Categorías del Menú Superior";
    modalRef.componentInstance.parentMenuId = parentId;
  }
  navegacionPrincipal(parentId: number) {
    const modalRef = this.modalService.open(NavegacionPrincipalComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
    });
    modalRef.componentInstance.titulo = "Crear Menu Principal";
    modalRef.componentInstance.categoryId = parentId;
  }
  addDestacado(parentId: number) {
    const modalRef = this.modalService.open(DestacadoComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
    });
    modalRef.componentInstance.categoryId = parentId;
  }
  obserbableOpertator() {
    this.parentMenuService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        if (res) this._fetchData();
      },
    });
  }
  obserbableOpertatorMenu() {
    this.parentMenuService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        if (res) this._fetchData();
      },
    });
  }
}
