import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormPermissionComponent } from 'src/app/component/admin/permiso/form-permission/form-permission.component';
import { FormRolPerModComponent } from 'src/app/component/admin/rol-permisos-modulos/form-rol-per-mod/form-rol-per-mod.component';

@Component({
  selector: 'app-rol-permiso-modulo',
  templateUrl: './rol-permiso-modulo.component.html',
  styleUrls: ['./rol-permiso-modulo.component.scss']
})
export class RolPermisoModuloComponent {

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
  openPermiso() {
    const modalRef = this.modalService.open(FormPermissionComponent, {
      ariaLabelledBy: "modal-basic-title"
    });
    modalRef.componentInstance.titulo = "Crear Permiso";
  }
  openRolPermisoModulo() {
    const modalRef = this.modalService.open(FormRolPerModComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg"
    });
    modalRef.componentInstance.titulo = "Asignar accesos al rol";
  }
}
