import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from "@angular/core";

import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { ListPage, Producto } from "src/app/core";
import { ProductoService } from "src/app/core/services/system/producto.service";
import { AdvancedSortableDirective } from "src/app/pages/tables/advancedtable/advanced-sortable.directive";
import { AdvancedService } from "src/app/pages/tables/advancedtable/advanced.service";
import Swal from "sweetalert2";
import { DecimalPipe } from "@angular/common";
import { FilterList } from "@rdinvesiones/core/interface/general.interface";

@Component({
  selector: "app-product-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  providers: [AdvancedService, DecimalPipe],
})
export class ListProductComponent implements OnInit, OnChanges {
  @Output() update: EventEmitter<Object> = new EventEmitter<Object>();
  @Input() storeId!: number; // Recibe el valor del padre

  @ViewChildren(AdvancedSortableDirective)
  headers: QueryList<AdvancedSortableDirective>;
  categoria: any = [];
  public isCollapsed = true;
  textSearch: string = "";
  totalElements: number = 0;
  filter: FilterList = {
    page: 1,
    size: 10,
    storeId: 0,
  };
  pageSize: number = 100; // aqui va 10;
  pageNumber: number = 1;
  lsproducto: ListPage;
  total$: Observable<number>;
  editableTable: any;
  constructor(
    private productService: ProductoService,
    private totastService: ToastrService,
    public service: AdvancedService
  ) {
    this.total$ = service.total$;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["storeId"] && changes["storeId"].currentValue) {
      this.filter.storeId = this.storeId;
      this.listar();
    }
  }
  ngOnInit(): void {
    this.obserbableOpertator();
    this.category();
  }
  clearFilter() {
    this.listar();
  }
  listar() {
    this.productService.getAll(this.filter).subscribe({
      next: (res: ListPage) => {
        this.lsproducto = res.content;
        this.total$ = res.content.length;
        this.totalElements = res.totalElements;
        this.pageNumber = res.number + 1;
      },
      error: (err: any) => {
        this.totastService.error(err?.message);
        console.log(err);
      },
    });
  }
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.listar();
  }
  edit(idProduct: any, storeId: number) {
    this.productService.getById(idProduct, storeId).subscribe({
      next: (res: Producto) => {
        const response = {
          opcion: "edit",
          data: res,
        };
        this.update.emit(response);
        return;
      },
      error: (error: any) => {
        this.totastService.error(error?.message);
      },
    });
  }
  obserbableOpertator() {
    this.productService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        this.setFilterDefault();
        if (res) this.listar();
      },
    });
  }
  eliminar(id: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger ms-2",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Seguro de Eliminar Este Producto?",
        text: `¡No podrás revertir esto!`,
        icon: "warning",
        confirmButtonText: `Si, Eliminar!`,
        cancelButtonText: "No, cerrar!",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.productService.delete(id).subscribe({
            next: (res) => {
              this.totastService.success(res?.message);
            },
            error: (err) => {
              this.totastService.error(err?.error);
            },
            complete: () => {
              this.setFilterDefault();
              this.listar();
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
  onSearchCategory() {
    // if (!this.filtros.categoria) {
    //   this.totastService.warning('Debe seleccionar una categoria a filtrar');
    //   return;
    // }
    // this.listar(this.pageNumber, this.pageSize);
  }
  category() {
    // this.productService.getCategory().subscribe({
    //   next: (res: any) => {
    //     this.categoria = res
    //   },
    //   error: (err) => {
    //   }
    // })
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
  setFilterDefault() {
    this.filter.page = 1;
    this.filter.size = 10;
    this.filter.storeId = this.storeId;
  }
}
