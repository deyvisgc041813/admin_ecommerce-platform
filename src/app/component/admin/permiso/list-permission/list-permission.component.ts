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
  TokenService,
} from "src/app/core";
import { FormPermissionComponent } from "../form-permission/form-permission.component";

@Component({
  selector: 'app-list-permission',
  templateUrl: './list-permission.component.html',
  styleUrls: ['./list-permission.component.scss']
})
export class ListPermissionComponent implements OnInit {

  permissionModule: ListPage; // Definir un Observable para los datos
  total: number = 0; // Número total de entradas
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
    private permissionService: PermissionsService,
    private modalService: NgbModal,
    private totastService: ToastrService,
    private tokenService: TokenService
  ) {}
  ngOnInit(): void {
    this.listar();
    this.obserbableOpertator();
    console.log(this.permisos);
  }

  async listar() {
    this.permissionService.get().subscribe({
      next: (res) => {
        this.permissionModule = res.content;
      },
    });
  }

  obserbableOpertator() {
    this.permissionService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        if (res) this.listar();
      },
    });
  }
  async edit(id:number) {
    this.permissionService.getById(id).subscribe({
      next: (res: Permissions) => {
        const modalRef = this.modalService.open(FormPermissionComponent, { ariaLabelledBy: 'modal-basic-title'});
        modalRef.componentInstance.titulo = 'Actualizar Permisos';
        modalRef.componentInstance.formPermission = res as Permissions
      },
    });
  
  }
  actualizarEstado(id: number, status: string) {
    const message = +status === 1 ? "Desabilitar" : "Habilitar";
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger ms-2",
          },
          buttonsStyling: false,
        });
        swalWithBootstrapButtons
          .fire({
            title: `Seguro de ${message} este permiso?`,
            text: `¡No podrás revertir esto!`,
            icon: "warning",
            confirmButtonText: `Si, ${message}!`,
            cancelButtonText: "No, cerrar!",
            showCancelButton: true,
          })
          .then((result) => {
            if (result.value) {
              this.permissionService.updateStatus(id, status).subscribe({
                next: (res: any) => {
                  this.listar();
                },
                error: (err: any) => {
                  this.totastService.error(err);
                },
                complete: () => {
                },
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
