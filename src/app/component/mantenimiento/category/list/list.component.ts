import { DecimalPipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Output,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { FilterList } from "@rdinvesiones/core/interface/general.interface";
import { ToastrService } from "ngx-toastr";
import { Category, ListPage } from "src/app/core";
import { CategoryService } from "src/app/core/services/system/category.service";
import { AdvancedSortableDirective } from "src/app/pages/tables/advancedtable/advanced-sortable.directive";
import { AdvancedService } from "src/app/pages/tables/advancedtable/advanced.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-list-category",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  providers: [AdvancedService, DecimalPipe],
})
export class ListCategoryComponent {
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
  readonly STATUS_CONFIG: Record<number, { label: string; class: string }> = {
  1: { label: 'Activo', class: 'bg-success' },
  0: { label: 'Deshabilitado', class: 'bg-danger' }
};
  filtros: FilterList = {
    page: 1,
    size: 10,
  };
  constructor(
    private categoryService: CategoryService,
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
    this.categoryService.get().subscribe({
      next: (res: ListPage) => {
        this.list = res;
        this.totalElements = res.totalElements;
      },
      error: (err: any) => {
        this.totastService.error(err?.error?.error);
      },
    });
  }
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.fetchData();
  }
  getCategoryTypeLabel(type: number | string): string {
    const categoryTypes: Record<number, string> = {
      1: "Menú Principal",
      2: "Catálogo",
    };
    return categoryTypes[+type] || "No definido";
  }

  edit(id: number) {
    this.categoryService.getById(id).subscribe({
      next: (res: Category) => {
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
    this.categoryService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        if (res) this.fetchData();
      },
    });
  }
  eliminar(id: number, publicId:string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Seguro de Eliminar Esta categoria?',
        text: `¡No podrás revertir esto!`,
        icon: 'warning',
        confirmButtonText: `Si, Eliminar!`,
        cancelButtonText: 'No, cerrar!',
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.categoryService.delete(id, publicId).subscribe({
            next: (res: any) => {
              this.totastService.success(res?.message);
            },
            error: (err: any) => {
              this.totastService.error(err?.error);
            },
            complete: () => {
              this.pageSize = 10;
              this.pageNumber = 1;
              this.fetchData();
            },
          });
        }
      });
  }
  onPageSizeChange(size: number) {
    this.filtros.size = size;
    this.filtros.page = 1; // Reinicia a la primera página
    this.fetchData();
  }
  actualizarEstado(id: string, estado: string) {
    const messageEstado = estado === "1" ? "Desactivar" : "Habilitar";
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
          // this.categoryService.changeStatus(id, estado).subscribe({
          //   next: (res: ResponseMessage) => {
          //     this.totastService.success(res?.message);
          //   },
          //   error: (err: any) => {
          //     this.totastService.error(err?.error);
          //   },
          //   complete: () => {
          //     this.fetchData();
          //   },
          // });
        }
      });
  }
}
