import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import {
  ListPage,
  RolesService,
} from "src/app/core";
import { Modules } from "@rdinvesiones/core/interface/modulo.interface";
import { FormRoleComponent } from "../form-role/form-role.component";
import { Roles } from "@rdinvesiones/core/interface/role.interface";
@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss']
})
export class ListRoleComponent implements OnInit {
  total: number = 0; // Número total de entradas
  searchTerm: string = "";
  searchTermPerfil: string = "";
  tables$: Observable<ListPage>;
  total$: Observable<number>;
  user: ListPage;
  roles: ListPage;
  filtros: any = {
    page: 1,
    pageSize: 10,
  };
  permisos: any[] = [];
  constructor(
    private rolesService: RolesService,
    private modalService: NgbModal,
    private totastService: ToastrService
  ) {}
  ngOnInit(): void {
    this.listar();
    this.obserbableOpertator();
  }

  async listar() {
    this.rolesService.get().subscribe({
      next: (res) => {
        this.roles = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  obserbableOpertator() {
    this.rolesService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        if (res) this.listar();
      },
    });
  }
  edit(id: number) {
    this.rolesService.getById(id).subscribe({
      next: (res) => {
        const modalRef = this.modalService.open(FormRoleComponent, {
          ariaLabelledBy: "modal-basic-title",
        });
        modalRef.componentInstance.titulo = "Actualizar Rol";
        modalRef.componentInstance.formRoles = res as Roles;
      },
      error: (err) => {},
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
        title: `Seguro de ${message} este rol?`,
        text: `¡No podrás revertir esto!`,
        icon: "warning",
        confirmButtonText: `Si, ${message}!`,
        cancelButtonText: "No, cerrar!",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.rolesService.updateStatus(id, status).subscribe({
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
