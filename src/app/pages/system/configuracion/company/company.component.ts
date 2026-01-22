import { Component, inject, OnInit } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { Company } from "@rdinvesiones/core/interface/company.interface";
import { FormCompanyComponent } from "src/app/component/configuracion/company/form-company/form-company.component";
import { Category } from "src/app/core";
import { CategoryService } from "src/app/core/services/system/category.service";  



@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

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
     const modalRef = this.modalService.open(FormCompanyComponent, {
       ariaLabelledBy: "modal-basic-title",
       size: "lg",
     });
     modalRef.componentInstance.titulo = "Crear empresa";
   }
   onSuccess(event: any) {
     this.categoriaService.saveStatus(event);
   }
   isUpdate(event: any) {
     const modalRef = this.modalService.open(FormCompanyComponent, {
       ariaLabelledBy: "modal-basic-title",
       size: "lg"
     });
     modalRef.componentInstance.titulo = "Actualizar empresa";
     modalRef.componentInstance.formCompany = event?.data as Company;
   }

}
