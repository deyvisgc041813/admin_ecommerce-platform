import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EcomerceService } from '@rdinvesiones/core/services/system/ecomerce.service';
import { ToastrService } from 'ngx-toastr';
import { ListPage, SubcategoryService } from 'src/app/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-banner-conf',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerConfComponent implements OnInit {
  @Output() update: EventEmitter<Object> = new EventEmitter<Object>();
  subCategoria: SubcategoryService
  textSearch: string = ""
  totalElements: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  list: ListPage
  constructor(private ecomerService: EcomerceService, private totastService: ToastrService) {
  }
  ngOnInit(): void {
    this.listar(this.pageNumber, this.pageSize);
    this.obserbableOpertator()
  }

  listar(page: number, size: number) {
    this.ecomerService.getBanner().subscribe({
      next: (res: ListPage) => {
        this.list = res
      },
      error: (err: any) => {
      }
    })
  }
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.listar(this.pageNumber, this.pageSize);
  }
  edit(id: number) {
    this.ecomerService.getBanerById(id).subscribe({
      next: (res: any) => {
        const response  = {
          opcion: 'edit',
          data: res
        }
        this.update.emit(response)
      },
      error: (err: any) => {
        this.totastService.error(err?.error?.error);
      },
    });
  }
  obserbableOpertator() {
    this.ecomerService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        this.pageSize = 10;
        this.pageNumber = 1;
        if (res) this.listar(this.pageNumber, this.pageSize);
      }
    })
  }
  changeStatus(id: number, status: string) {
    const message = +status === 1 ? "Desabilitar" : "Habilitar"
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: `Seguro de ${message} este banner?`,
        text: `¡No podrás revertir esto!`,
        icon: 'warning',
        confirmButtonText: `Si, ${message}!`,
        cancelButtonText: 'No, cerrar!',
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.ecomerService.updateBanerStatus(id, status).subscribe({
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
}
