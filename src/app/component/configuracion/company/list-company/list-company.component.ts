import { Component, EventEmitter, OnInit, Output, inject } from "@angular/core";
import { NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
import { Company } from "@rdinvesiones/core/interface/company.interface";
import { ToastrService } from "ngx-toastr";
import {
  CompanyService,
  ListPage,
  SubCategory,
  SubcategoryService,
} from "src/app/core";
import Swal from "sweetalert2";

@Component({
  selector: "app-list-company",
  templateUrl: "./list-company.component.html",
  styleUrls: ["./list-company.component.scss"],
})
export class ListCompanyComponent implements OnInit {
  @Output() update: EventEmitter<Object> = new EventEmitter<Object>();
  subCategoria: SubcategoryService;
  isCollapsed = true;
  // today = inject(NgbCalendar).getToday();
  // filtros = {
  //   fechaIni: {
  //     year: dayjs().subtract(1, 'month').year(),
  //     month: dayjs().subtract(1, 'month').month() + 1,
  //   },
  //   fechaFin: {
  //     year: dayjs().year(),
  //     month: dayjs().month() + 2,
  //     day: dayjs().date(),
  //   },
  // }
  textSearch: string = "";
  totalElements: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  list: ListPage;
  constructor(
    private companyService: CompanyService,
    private totastService: ToastrService
  ) {}
  ngOnInit(): void {
    this.listar(this.pageNumber, this.pageSize);
    this.obserbableOpertator();
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
    this.companyService.get().subscribe({
      next: (res: ListPage) => {
        this.list = res;
      },
      error: (err: any) => {},
    });
  }
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.listar(this.pageNumber, this.pageSize);
  }
  edit(id: number) {
    this.companyService.getById(id).subscribe({
      next: (res: Company) => {
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
  obserbableOpertator() {
    this.companyService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        this.pageSize = 10;
        this.pageNumber = 1;
        if (res) this.listar(this.pageNumber, this.pageSize);
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
        title: `Seguro de ${message} esta compania?`,
        text: `¡No podrás revertir esto!`,
        icon: "warning",
        confirmButtonText: `Si, ${message}!`,
        cancelButtonText: "No, cerrar!",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.companyService.updateStatus(id, status).subscribe({
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
