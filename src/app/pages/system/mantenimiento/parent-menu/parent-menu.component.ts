import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ParentMenu } from "@rdinvesiones/core/interface/parent_menu.interface";
import { ParentMenuService } from "@rdinvesiones/core/services/system/parent-menu.service";
import { FormParentComponent } from "src/app/component/mantenimiento/parent-menu/form-parent/form-parent.component";

@Component({
  selector: "app-parent-menu",
  templateUrl: "./parent-menu.component.html",
  styleUrls: ["./parent-menu.component.scss"],
})
export class ParentMenuComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  constructor(
    private categoriaService: ParentMenuService,
    config: NgbModalConfig,
    private modalService: NgbModal, // Inyecta NgbModal directamente aquí
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    this.breadCrumbItems = [
      { label: "Administración de Navegación" },
      { label: "Menús Superiores", active: true },
    ];
  }
  ngOnInit(): void {
  }
  open() {
    const modalRef = this.modalService.open(FormParentComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
    });
    modalRef.componentInstance.titulo = "Crear Menu Superior";
  }
  onSuccess(event: any) {
    this.categoriaService.saveStatus(event);
  }
  isUpdate(event: any) {
    const modalRef = this.modalService.open(FormParentComponent, {
      ariaLabelledBy: "modal-basic-title",
    });
    modalRef.componentInstance.titulo = "Actualizar Superior";
    modalRef.componentInstance.formParentMenu = event?.data as ParentMenu;
  }
}
