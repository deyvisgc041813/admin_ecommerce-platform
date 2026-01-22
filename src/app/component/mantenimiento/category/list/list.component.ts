import { DecimalPipe } from '@angular/common';
import { Component, EventEmitter, Output, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Category, ListPage } from 'src/app/core';
import { CategoryService } from 'src/app/core/services/system/category.service';
import { AdvancedSortableDirective } from 'src/app/pages/tables/advancedtable/advanced-sortable.directive';
import { AdvancedService } from 'src/app/pages/tables/advancedtable/advanced.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-list-category',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})
export class ListCategoryComponent {
  @Output() update: EventEmitter<Object> = new EventEmitter<Object>();
  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;
  categoria: Category
  isCollapsed = true;
  textSearch: string = ''
  totalElements: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  list: ListPage
  tables$: Observable<ListPage[]>;
  total$: Observable<number>;
  tableData: Category[];
  constructor(private categoryService: CategoryService, private totastService: ToastrService, public service: AdvancedService) {
  }
  ngOnInit(): void {
    this.listar();
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
  listar() {
    this.categoryService.get().subscribe({
      next: (res: ListPage) => {
        this.tables$ = res?.content
        this.total$ = res?.content.length;
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
    this.listar();
  }
  edit(id: number) {
    this.categoryService.getById(id).subscribe({
      next: (res: Category) => {
        const response = {
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
    this.categoryService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        if (res) this.listar();
      }
    })
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
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

}
