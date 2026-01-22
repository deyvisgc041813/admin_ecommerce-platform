import { Component } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { Modules } from "@rdinvesiones/core/interface/modulo.interface";
import { FormModulesComponent } from "src/app/component/admin/modules/form-modules/form-modules.component";
import { FormRoleComponent } from "src/app/component/admin/roles/form-role/form-role.component";
import { Permissions } from "src/app/core";

@Component({
  selector: 'app-role-and-modules',
  templateUrl: './role-and-modules.component.html',
  styleUrls: ['./role-and-modules.component.scss']
})
export class RoleAndModulesComponent {

  breadCrumbItems: Array<{}>;
   constructor(
     config: NgbModalConfig,
     private modalService: NgbModal
   ) {
     config.backdrop = "static";
     config.keyboard = false;
     this.breadCrumbItems = [
       { label: "Permisos y Perfiles" },
       { label: "Historial de Permisos y Perfiles", active: true },
     ];
   }
   openModulo() {
     const modalRef = this.modalService.open(FormModulesComponent, {
       ariaLabelledBy: "modal-basic-title",
     });
     modalRef.componentInstance.titulo = "Crear Modulo";
   }
   isUpdateModulo(event: any) {
     const modalRef = this.modalService.open(FormModulesComponent, {
       ariaLabelledBy: "modal-basic-title",
     });
     modalRef.componentInstance.titulo = "Actualizar Modulo";
     modalRef.componentInstance.formModulo = event?.data as Modules;
   }
   openPermisoRole() {
     const modalRef = this.modalService.open(FormRoleComponent, {
       ariaLabelledBy: "modal-basic-title",
     });
     modalRef.componentInstance.titulo = "Asignación de Permiso";
   }
 
   isUpdateRole(event: any) {
     const modalRef = this.modalService.open(FormRoleComponent, {
       ariaLabelledBy: "modal-basic-title",
     });
     modalRef.componentInstance.titulo = "Actualizar Permisos del Módulo";
     modalRef.componentInstance.formPermiso = event?.data as Permissions;
   }
}
