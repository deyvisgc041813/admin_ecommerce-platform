import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Sede } from '@rdinvesiones/core/interface/sedes.interface';
import { ToastrService } from 'ngx-toastr';
import { CompanyService, ListPage, SedeService, SubcategoryService } from 'src/app/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-sede',
  templateUrl: './list-sede.component.html',
  styleUrls: ['./list-sede.component.scss']
})
export class ListSedeComponent implements OnInit {

  @Output() update: EventEmitter<Object> = new EventEmitter<Object>();
  subCategoria: SubcategoryService
  isCollapsed = true;
  textSearch: string = ""
  totalElements: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  list: ListPage
  constructor(private sedeService: SedeService, private totastService: ToastrService) {
  }
  ngOnInit(): void {
    this.listar(this.pageNumber, this.pageSize);
    this.obserbableOpertator()
  }
  clearFilter() {
    // this.filtros = {
    //   fechaIni: {
    //     year: dayjs().subtract(1, 'month').year(),
    //     month: dayjs().subtract(1, 'month').month() + 1, // Los meses en NgbDateStruct van de 1 a 12
    //     day: dayjs().date(),
    //   },
    //   fechaFin: {
    //     year: dayjs().year(),
    //     month: dayjs().month() + 2,
    //     day: dayjs().date(),
    //   },
    // };
    // this.listar(this.pageNumber, this.pageSize);
  }
  listar(page: number, size: number) {
    this.sedeService.get().subscribe({
      next: (res: ListPage) => {
        this.list = res
      },
      error: (err: any) => {
      }
    })
    // this.productService.getAll(page - 1, size, this.filtros)
    // .subscribe({
    //   next: (res: ListPage) => {
    //     this.list = res;
    //     this.totalElements = res.totalElements;
    //     this.pageNumber = res.number + 1;
    //   },
    //   error: (err: any) => {
    //    console.log(err)
    //   },
    // })
  }
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.listar(this.pageNumber, this.pageSize);
  }
  edit(id: number) {
    this.sedeService.getById(id).subscribe({
        next: (res: Sede) => {
          const response = {
            opcion: "edit",
            data: res,
          };
          this.update.emit(response);
        },
        error: (err: any) => {
          this.totastService.error(err?.error?.error);
        },
    });
  }
   changeStatus(id: number, status: string) {
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
          title: `Seguro de ${message} esta sede?`,
          text: `¡No podrás revertir esto!`,
          icon: "warning",
          confirmButtonText: `Si, ${message}!`,
          cancelButtonText: "No, cerrar!",
          showCancelButton: true,
        })
        .then((result) => {
          if (result.value) {
            this.sedeService.updateStatus(id, status).subscribe({
              next: (res: any) => {
                this.totastService.success(res?.message);
                this.listar(this.pageNumber, this.pageSize);
              },
              error: (err: any) => {
                this.totastService.error(err);
              },
              complete: () => {
                this.pageSize = 10;
                this.pageNumber = 1;
                this.listar(this.pageNumber, this.pageSize);
              },
            });
          }
        });
    }
  obserbableOpertator() {
    this.sedeService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        this.pageSize = 10;
        this.pageNumber = 1;
        if (res) this.listar(this.pageNumber, this.pageSize);
      }
    })
  }

}
