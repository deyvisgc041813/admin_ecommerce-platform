import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import {
  ListPage,
  ModulesService,
  ResponseMessage,
  TokenService,
} from "src/app/core";
import { FormModulesComponent } from "../form-modules/form-modules.component";
import { Modules } from "@rdinvesiones/core/interface/modulo.interface";

@Component({
  selector: "app-list-modules",
  templateUrl: "./list-modules.component.html",
  styleUrls: ["./list-modules.component.scss"],
})
export class ListModulesComponent implements OnInit {
  total: number = 0; // Número total de entradas
  searchTerm: string = "";
  searchTermPerfil: string = "";
  tables$: Observable<ListPage>;
  total$: Observable<number>;
  user: ListPage;
  modulos: ListPage;
  filtros: any = {
    page: 1,
    pageSize: 10,
  };
  permisos: any[] = [];
  constructor(
    private moduleService: ModulesService,
    private modalService: NgbModal,
    private totastService: ToastrService,
    private tokenService: TokenService
  ) {}
  ngOnInit(): void {
    this.listar();
    this.obserbableOpertator();
    const rptaToken = this.tokenService.decodeToken();
    // var permisos = []
    // let busca = rptaToken?.modulos.find(m => m.label === 'Administracion')
    // if (busca) {
    //   for (var i = 0; i < busca.menu.length; i++) {
    //     if (busca.menu[i].label.toLowerCase() === 'usuario') {
    //       for (var j = 0; j < busca.menu[i].permisos.length; j++) {
    //         permisos.push(busca.menu[i].permisos[j].descripcion.toLowerCase())
    //       }
    //     }
    //   }
    //   this.listar()
    //
    //   this.permisos = permisos
    // } else {
    //   this.totastService.error('no tiene permitido este modulo')
    // }
    // console.log(this.permisos)
  }

  async listar() {
    this.moduleService.get().subscribe({
      next: (res) => {
        this.modulos = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  obserbableOpertator() {
    this.moduleService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        if (res) this.listar();
      },
    });
  }
  edit(id: number) {
    this.moduleService.getById(id).subscribe({
      next: (res) => {
        const modalRef = this.modalService.open(FormModulesComponent, {
          ariaLabelledBy: "modal-basic-title",
        });
        modalRef.componentInstance.titulo = "Actualizar Modulo";
        modalRef.componentInstance.formModulo = res as Modules;
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
        title: `Seguro de ${message} este modulo?`,
        text: `¡No podrás revertir esto!`,
        icon: "warning",
        confirmButtonText: `Si, ${message}!`,
        cancelButtonText: "No, cerrar!",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.moduleService.updateStatus(id, status).subscribe({
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
