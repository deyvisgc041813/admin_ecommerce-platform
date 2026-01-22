import { Component, inject, OnInit } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { FormSedeComponent } from "src/app/component/configuracion/sede/form-sede/form-sede.component";
import { Category, Sede } from "src/app/core";
import { CategoryService } from "src/app/core/services/system/category.service";

@Component({
  selector: "app-company-sedes",
  templateUrl: "./company-sedes.component.html",
  styleUrls: ["./company-sedes.component.scss"],
})
export class CompanySedesComponent implements OnInit {
  // bread crum data
  breadCrumbItems: Array<{}>;
  constructor(
    private categoriaService: CategoryService,
    config: NgbModalConfig,
    private modalService: NgbModal // Inyecta NgbModal directamente aquí
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    this.breadCrumbItems = [
      { label: "Categorias" },
      { label: "Lista de Sedes", active: true },
    ];
  }
  ngOnInit(): void {}
  open() {
    const modalRef = this.modalService.open(FormSedeComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
    });
    modalRef.componentInstance.titulo = "Crear sedes";
  }
  onSuccess(event: any) {
    this.categoriaService.saveStatus(event);
  }
  isUpdate(event: any) {
    const modalRef = this.modalService.open(FormSedeComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
    });
    modalRef.componentInstance.titulo = "Actualizar sedes";
    modalRef.componentInstance.formSede = event?.data as Sede;
  }
}
