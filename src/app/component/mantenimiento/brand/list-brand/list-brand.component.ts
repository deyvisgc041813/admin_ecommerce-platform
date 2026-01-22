import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { FilterList } from "@rdinvesiones/core/interface/general.interface";
import { BrandService } from "@rdinvesiones/core/services/system/brand.service";
import { ToastrService } from "ngx-toastr";
import { ListPage, Marca } from "src/app/core";
import Swal from "sweetalert2";

@Component({
  selector: "app-list-brand",
  templateUrl: "./list-brand.component.html",
  styleUrls: ["./list-brand.component.scss"],
})
export class ListBrandComponent implements OnInit {
  @Output() update: EventEmitter<Object> = new EventEmitter<Object>();
  isCollapsed = true;
  textSearch: string = "";
  totalElements: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  list: ListPage;
  filter: FilterList = {
    page: 1,
    size: 10,
  };
  constructor(
    private brandService: BrandService,
    private totastService: ToastrService
  ) {}
  ngOnInit(): void {
    this.listar();
    this.obserbableOpertator();
  }
  clearFilter() {}
  listar() {
    this.brandService.get(this.filter).subscribe({
      next: (res: ListPage) => {
        this.list = res;
      },
      error: (err: any) => {},
    });
  }
  edit(id: number) {
    this.brandService.getById(id).subscribe({
      next: (res: Marca) => {
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
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.setFilterDefault();
    this.listar();
  }
  obserbableOpertator() {
    this.brandService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        this.setFilterDefault();
        if (res) this.listar();
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
        title: `Seguro de ${message} esta marca?`,
        text: `¡No podrás revertir esto!`,
        icon: "warning",
        confirmButtonText: `Si, ${message}!`,
        cancelButtonText: "No, cerrar!",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.brandService.updateStatus(id, status).subscribe({
            next: (res: any) => {
              this.listar();
            },
            error: (err: any) => {
              this.totastService.error(err);
            },
            complete: () => {
              this.setFilterDefault();
            },
          });
        }
      });
  }
  setFilterDefault() {
    this.filter.page = 1;
    this.filter.size = 10;
  }
}
