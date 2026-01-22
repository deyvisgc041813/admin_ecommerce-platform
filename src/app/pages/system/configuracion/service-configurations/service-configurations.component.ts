import { Component, OnInit } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { Configurations } from "@rdinvesiones/core/interface/configurations.interface";
import { FormConfigurationComponent } from "src/app/component/configuracion/service-configurations/form-configuration/form-configuration.component";

@Component({
  selector: "app-service-configurations",
  templateUrl: "./service-configurations.component.html",
  styleUrls: ["./service-configurations.component.scss"],
})
export class ServiceConfigurationsComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;
  constructor(
    //private categoriaService: SubcategoryService,
    config: NgbModalConfig,
    private modalService: NgbModal, // Inyecta NgbModal directamente aquí
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }
  ngOnInit() {
    this.breadCrumbItems = [
      { label: "Configuracion" },
      { label: "Lista de configuraciones del sistema ecomerce", active: true },
    ];
  }
  open() {
    const modalRef = this.modalService.open(FormConfigurationComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
    });
    modalRef.componentInstance.titulo = "Crear configuración";
  }
  onSuccess(event: any) {
    //this.categoriaService.saveStatus(event);
  }
  isUpdate(event: any) {
    const modalRef = this.modalService.open(FormConfigurationComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
    });
    modalRef.componentInstance.titulo = "Actualizar configuración";
    modalRef.componentInstance.formConfig = event?.data as Configurations;
  }
}
