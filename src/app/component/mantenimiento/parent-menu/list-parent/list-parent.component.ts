import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { ParentMenu } from "@rdinvesiones/core/interface/parent_menu.interface";
import { ParentMenuService } from "@rdinvesiones/core/services/system/parent-menu.service";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { Category, ListPage, ResponseMessage } from "src/app/core";
import { AdvancedSortableDirective } from "src/app/pages/tables/advancedtable/advanced-sortable.directive";
import { AdvancedService } from "src/app/pages/tables/advancedtable/advanced.service";
import Swal from "sweetalert2";
import { DecimalPipe } from "@angular/common";
import { FilterList } from "@rdinvesiones/core/interface/general.interface";
@Component({
  selector: "app-list-parent",
  templateUrl: "./list-parent.component.html",
  styleUrls: ["./list-parent.component.scss"],
  providers: [AdvancedService, DecimalPipe],
})
export class ListParentComponent implements OnInit {
  @Output() update: EventEmitter<Object> = new EventEmitter<Object>();
  @ViewChildren(AdvancedSortableDirective)
  headers: QueryList<AdvancedSortableDirective>;
  categoria: Category;
  isCollapsed = true;
  textSearch: string = "";
  totalElements: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  list: ListPage;
  filtros: FilterList = {
    page: 1,
    size: 10,
  };
  constructor(
    private parentService: ParentMenuService,
    private totastService: ToastrService,
    public service: AdvancedService,
  ) {}
  ngOnInit(): void {
    this.fetchData();
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
  fetchData() {
    this.parentService.fetchData().subscribe({
      next: (res: ListPage) => {
        this.list = res;
        this.totalElements = res.totalElements;
      },
      error: (err: any) => {},
    });
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
    this.fetchData();
  }
  edit(id: number) {
    this.parentService.getById(id).subscribe({
      next: (res: ParentMenu) => {
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
    this.parentService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        if (res) this.fetchData();
      },
    });
  }
  eliminar(id: number) {
    // const swalWithBootstrapButtons = Swal.mixin({
    //   customClass: {
    //     confirmButton: 'btn btn-success',
    //     cancelButton: 'btn btn-danger ms-2',
    //   },
    //   buttonsStyling: false,
    // });
    // swalWithBootstrapButtons
    //   .fire({
    //     title: 'Seguro de Eliminar Este Producto?',
    //     text: `¡No podrás revertir esto!`,
    //     icon: 'warning',
    //     confirmButtonText: `Si, Eliminar!`,
    //     cancelButtonText: 'No, cerrar!',
    //     showCancelButton: true,
    //   })
    //   .then((result) => {
    //     if (result.value) {
    //       this.categoria.delete(id).subscribe({
    //         next: (res: any) => {
    //           this.totastService.success(res?.message);
    //         },
    //         error: (err: any) => {
    //           this.totastService.error(err?.error);
    //         },
    //         complete: () => {
    //           this.pageSize = 10;
    //           this.pageNumber = 1;
    //           this.listar(this.pageNumber, this.pageSize);
    //         },
    //       });
    //     }
    //   });
  }
  onSort({ column, direction }: any) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
  // Método para manejar el cambio del tamaño de página
  onPageSizeChange(size: number) {
    this.filtros.size = size;
    this.filtros.page = 1; // Reinicia a la primera página
    this.fetchData();
  }
  actualizarEstado(id: string, estado: string) {
    const messageEstado = estado === "Active" ? "Desactivar" : "Habilitar";
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger ms-2",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: `Seguro de ${messageEstado} Este menu?`,
        text: `¡No podrás revertir esto!`,
        icon: "warning",
        confirmButtonText: `Si, ${messageEstado}!`,
        cancelButtonText: "No, cerrar!",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.parentService.changeStatus(id, estado).subscribe({
            next: (res: ResponseMessage) => {
              this.totastService.success(res?.message);
            },
            error: (err: any) => {
              this.totastService.error(err?.error);
            },
            complete: () => {
              this.fetchData();
            },
          });
        }
      });
  }
}
