import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import {
  AdminService,
  ListPage,
  Permissions,
  PermissionsService,
  ResponseMessage,
  RoleModulesPermissionsService,
  TokenService,
} from "src/app/core";
import { FormPermissionComponent } from "../../permiso/form-permission/form-permission.component";
import { DetallePermisoComponent } from "src/app/component/modals/detalle-permiso/detalle-permiso.component";
import { FormRolPerModComponent } from "../form-rol-per-mod/form-rol-per-mod.component";
@Component({
  selector: "app-list-rol-per-mod",
  templateUrl: "./list-rol-per-mod.component.html",
  styleUrls: ["./list-rol-per-mod.component.scss"],
})
export class ListRolPerModComponent implements OnInit {
  roleModulepermissions: ListPage;
  total: number = 0;
  searchTerm: string = "";
  searchTermPerfil: string = "";
  tables$: Observable<ListPage>;
  total$: Observable<number>;
  user: ListPage;
  modulo: ListPage;
  filtros: any = {
    page: 1,
    pageSize: 10,
  };
  permisos: any[] = [];
  constructor(
    private rolePermissionsModulesService: RoleModulesPermissionsService,
    private modalService: NgbModal,
    private totastService: ToastrService,
    private tokenService: TokenService
  ) {}
  ngOnInit(): void {
    this.listar();
    this.obserbableOpertator();
  }

  async listar() {
    this.rolePermissionsModulesService.get().subscribe({
      next: (res) => {
        this.roleModulepermissions = res.content;
      },
    });
  }

  obserbableOpertator() {
    this.rolePermissionsModulesService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        if (res) this.listar();
      },
    });
  }
  async edit(roleId: number, moduleId: number) {
    this.rolePermissionsModulesService.getById(roleId, moduleId).subscribe({
      next: (res: any) => {
        const modalRef = this.modalService.open(FormRolPerModComponent, {
          ariaLabelledBy: "modal-basic-title",
          size: "lg",
        });
        modalRef.componentInstance.titulo = "Actualizar Permisos";
        modalRef.componentInstance.formRoleModulePermision = res;
      },
    });
  }
  async verPermisos(roleId: number, moduleId: number) {
    this.rolePermissionsModulesService.getById(roleId, moduleId).subscribe({
      next: (res) => {
        const modalRef = this.modalService.open(DetallePermisoComponent, {
          ariaLabelledBy: "modal-basic-title",
        });
        modalRef.componentInstance.data = res;
      },
    });
  }
  delete(roleId: number, moduleId: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger ms-2",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: `Seguro de eliminar este acceso?`,
        text: `¡No podrás revertir esto!`,
        icon: "warning",
        confirmButtonText: `Si, eliminar!`,
        cancelButtonText: "No, cerrar!",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.rolePermissionsModulesService
            .delete(roleId, moduleId)
            .subscribe({
              next: (res: ResponseMessage) => {
                this.totastService.success(res.message);
                this.listar();
              },
              error: (err: any) => {
                this.totastService.error(err);
              },
              complete: () => {},
            });
        }
      });
  }
  // Método para manejar los cambios de página
  onPageChange(page: number) {
    this.filtros.page = page;
    this.listar(); // Actualizar los datos al cambiar la página
  }
  // Método para manejar el cambio del tamaño de página
  onPageSizeChange(size: number) {
    this.filtros.pageSize = size;
    this.filtros.page = 1; // Reinicia a la primera página
    this.listar();
  }
}
