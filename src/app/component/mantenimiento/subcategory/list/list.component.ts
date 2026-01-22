import { Component, EventEmitter, Output, inject } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ListPage, SubCategory, SubcategoryService } from 'src/app/core';


@Component({
  selector: 'app-subCategoryService-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListsubCategoryComponent {
  @Output() update: EventEmitter<Object> = new EventEmitter<Object>();
  subCategoria: SubcategoryService
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
  textSearch: string = ""
  totalElements: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  list: ListPage
  constructor(private subCategoriaService: SubcategoryService, private totastService: ToastrService) {
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
    this.subCategoriaService.getSubcategoriesWithCategories().subscribe({
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
    this.subCategoriaService.getById(id).subscribe({
      next: (res: SubCategory) => {
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
    this.subCategoriaService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        this.pageSize = 10;
        this.pageNumber = 1;
        if (res) this.listar(this.pageNumber, this.pageSize);
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
}
