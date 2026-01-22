import { Component, OnInit } from '@angular/core';
import { OrderService, ListPage, SubCategory, SubcategoryService } from 'src/app/core';
import { ViewVentasComponent } from '../view-ventas/view-ventas.component';
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-ventas',
  templateUrl: './list-ventas.component.html',
  styleUrls: ['./list-ventas.component.scss']
})
export class ListVentasComponent implements OnInit {

  textSearch: string = ""
  totalElements: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  list: ListPage
  constructor(private orderService: OrderService, private totastService: ToastrService, private modalService: NgbModal) { }

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
    this.orderService.get().subscribe({
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
    // this.subCategoriaService.getById(id).subscribe({
    //   next: (res: SubCategory) => {
    //     const response  = {
    //       opcion: 'edit',
    //       data: res
    //     }
    //     this.update.emit(response)
    //   },
    //   error: (err: any) => {
    //     this.totastService.error(err?.error?.error);
    //   },
    // });
  }
  obserbableOpertator() {
    this.orderService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        this.pageSize = 10;
        this.pageNumber = 1;
        if (res) this.listar(this.pageNumber, this.pageSize);
      }
    })
  }
  eliminar(id: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Seguro de Eliminar La venta?',
        text: `¡No podrás revertir esto!`,
        icon: 'warning',
        confirmButtonText: `Si, Eliminar!`,
        cancelButtonText: 'No!',
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.orderService.delete(id).subscribe({
            next: (res: any) => {
              this.totastService.success(res?.message);
            },
            error: (err: any) => {
              this.totastService.error(err?.error);
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
  onSearchDate() {
    // if (!this.filtros.fechaIni) {
    //   this.totastService.warning('La fecha Inicio no debe estar vacio');
    //   return;
    // }
    // if (!this.filtros.fechaFin) {
    //   this.totastService.warning('La fecha Fin no debe estar vacio');
    //   return;
    // }
    // this.listar(this.pageNumber, this.pageSize);
  }
  atender(id: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
    .fire({
      title: 'Seguro de dar por Finalizado la Venta?',
      text: `¡No podrás revertir esto!`,
      icon: 'warning',
      confirmButtonText: `Si!`,
      cancelButtonText: 'No!',
      showCancelButton: true,
    })
    .then((result) => {
      if (result.value) {
        this.orderService.atender(id).subscribe({
          next: (res: any) => {
            this.totastService.success(res?.message);
          },
          error: (err: any) => {
            this.totastService.error(err?.message);
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
  ver(id:number,totalDescuento:number,total:number, detalle:any) {
    const modalRef = this.modalService.open(ViewVentasComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
    });
    modalRef.componentInstance.titulo = "Ver Detalle Venta N°" + id;
    modalRef.componentInstance.lista = detalle;
    modalRef.componentInstance.descuento = totalDescuento;
    modalRef.componentInstance.total = total;
  }
}
