import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { AdminService, ListPage, ResponseMessage, TokenService } from 'src/app/core';
import { FormUsuarioComponent } from '../form-usuario/form-usuario.component';

@Component({
  selector: 'app-list-usuario',
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.scss']
})
export class ListUsuarioComponent implements OnInit {

  usuarios: ListPage; // Definir un Observable para los datos
  total: number = 0; // Número total de entradas
  searchTerm: string = ""
  tables$: Observable<ListPage>;
  total$: Observable<number>;
  user: ListPage;
  modulo: ListPage;
  filtros:any = {
    page: 1,
    pageSize: 10
  }
  permisos : any[] = []
  constructor(private adminService: AdminService, private modalService: NgbModal, private totastService: ToastrService,
     private tokenService: TokenService) { }
  ngOnInit(): void {
    // const rptaToken = this.tokenService.decodeToken()
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

    //   this.permisos = permisos
    // } else {
    //   this.totastService.error('no tiene permitido este modulo')
    // }
    // console.log(this.permisos)
    this.listar()
    this.obserbableOpertator()
  }

 async listar() {
    // this.adminService.getUser().subscribe({
    //   next:(res => {
    //     this.usuarios = res.content
    //   }),
    //   error: (error => {
    //     console.log("error ", error)

    //   })
    // })
    this.usuarios = await this.adminService.getUser();
    // this.total = this.usuarios.total;
  }
  
  obserbableOpertator() {
    this.adminService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        if (res) this.listar();
      }
    })
  }
 async edit(id: string) {
    this.user = await this.adminService.getUserById(id); // Llamada usando async/await
    const modalRef = this.modalService.open(FormUsuarioComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    modalRef.componentInstance.titulo = 'Actualizar Usuario';
    modalRef.componentInstance.formUsers = this.user
  }
  actualizarEstado(id: string, estado: string) {
    const messageEstado = estado  === "1" ? "Desactivar" : "Habilitar"
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title:  `Seguro de ${messageEstado} Este Usuario?` ,
        text: `¡No podrás revertir esto!`,
        icon: 'warning',
        confirmButtonText: `Si, ${messageEstado}!`,
        cancelButtonText: 'No, cerrar!',
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.adminService.changeStatus(id, estado).subscribe({
            next: (res: ResponseMessage) => {
              this.totastService.success(res?.message);
            },
            error: (err: any) => {
              this.totastService.error(err?.error);
            },
            complete: () => {
              this.listar();
            },
          });
        }
      });
  }
  actualizarPassword(id: number) {
     Swal.fire({
      title: "Escriba la nueva contraseña",
      input: "password",
      inputLabel: "",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Completa el campo!";
        } else {
          console.log('envia al servidor', value)
          this.adminService.changePasswordAdmin(id, value).subscribe({
            next: (res: ResponseMessage) => {
              this.totastService.success(res?.message);
            },
            complete: () => {
              this.listar();
            },
          });
        }
      }
    });
  }
  async verPermisos (id: string) {
    this.modulo = await this.adminService.getPermisos(id); // Llamada usando async/await
    // const modalRef = this.modalService.open(DetallePermisosComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl'});
    // modalRef.componentInstance.modulos = this.modulo;
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
