import { Component, OnInit } from "@angular/core";
import {
  OrderService,
  ListPage,
  SubCategory,
  SubcategoryService,
  DataDefault,
} from "src/app/core";
import { ViewVentasComponent } from "../view-ventas/view-ventas.component";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";

@Component({
  selector: "app-list-ventas",
  templateUrl: "./list-ventas.component.html",
  styleUrls: ["./list-ventas.component.scss"],
})
export class ListVentasComponent implements OnInit {
  textSearch: string = "";
  totalElements: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  list: ListPage;
  metodoPago: any;
  operacion: any;
  estados: any;
  tipoPagoTable: any;
  constructor(
    private orderService: OrderService,
    private totastService: ToastrService,
    private modalService: NgbModal,
  ) {
    this.metodoPago = DataDefault.TIPOPAGO_ORDER;
    this.operacion = DataDefault.TIPOOPERACION_ORDER;
    this.estados = DataDefault.ESTADO_ORDER;
  }

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
    this.orderService.get().subscribe({
      next: (res: ListPage) => {
        this.list = res;
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
  getTipoOperacion(tipo: string) {
    return this.operacion[tipo] || { label: "Desconocido" };
  }
  getMetodoPago(metodo: string) {
    return this.metodoPago[metodo] || { label: "Desconocido" };
  }
  getEstado(estado: string) {
    return this.estados[estado] || { label: "Desconocido" };
  }
  getOrderActions(item: any) {
    switch (item.estado) {
      case DataDefault.ESTADO_ORDER.pending_payment.identifier:
      case DataDefault.ESTADO_ORDER.pending_transfer_validation.identifier:
      case DataDefault.ESTADO_ORDER.reserved.identifier:
        return [
          {
            label: "Confirmar pago",
            action: () => this.updateOrderStatus(item, 'paid'),
          },
          { label: "Cancelar", action: () => this.updateOrderStatus(item, 'cancelled') },
          { label: "Ver detalle", action: () => this.verDetalle(item) },
        ];
      case DataDefault.ESTADO_ORDER.paid.identifier: {
        const actions = [];
        if (item.envioDomicilio) {
          // Si es despacho → primero envío
          actions.push({
            label: "Confirmar envío",
            action: () => this.updateOrderStatus(item, 'shipped'),
          });
        } else {
          // Si NO es despacho → se entrega directo
          actions.push({
            label: "Confirmar entrega",
            action: () => this.updateOrderStatus(item, 'delivered'),
          });
        }
        actions.push(
          {
            label: "Reembolsar",
            action: () => this.updateOrderStatus(item, 'refunded'),
          },
          {
            label: "Ver detalle",
            action: () => this.verDetalle(item),
          },
        );
        return actions;
      }
      case DataDefault.ESTADO_ORDER.shipped.identifier:
        return [
          {
            label: "Confirmar entrega",
            action: () => this.updateOrderStatus(item, 'delivered'),
          },
          {
            label: "Reembolsar",
            action: () => this.updateOrderStatus(item, 'refunded'),
          },
          { label: "Ver detalle", action: () => this.verDetalle(item) },
        ];

      case DataDefault.ESTADO_ORDER.delivered.identifier:
        return [
          {
            label: "Reembolsar",
            action: () => this.updateOrderStatus(item, 'refunded'),
          },
          { label: "Ver detalle", action: () => this.verDetalle(item) },
        ];
      case DataDefault.ESTADO_ORDER.refunded.identifier:
      case DataDefault.ESTADO_ORDER.cancelled.identifier:
      case DataDefault.ESTADO_ORDER.rejected.identifier:
        return [{ label: "Ver detalle", action: () => this.verDetalle(item) }];

      default:
        return [{ label: "Ver detalle", action: () => this.verDetalle(item) }];
    }
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
        title: "Seguro de Eliminar La venta?",
        text: `¡No podrás revertir esto!`,
        icon: "warning",
        confirmButtonText: `Si, Eliminar!`,
        cancelButtonText: "No!",
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
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger ms-2",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: "Seguro de dar por Finalizado la Venta?",
        text: `¡No podrás revertir esto!`,
        icon: "warning",
        confirmButtonText: `Si!`,
        cancelButtonText: "No!",
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
  verDetalle(item: any) {
    //orderId: number, tiendaId: number, companyId: number
    const modalRef = this.modalService.open(ViewVentasComponent, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
    });
    //modalRef.componentInstance.titulo = "Ver Detalle Venta N°" + id;
    // modalRef.componentInstance.lista = detalle;
    // modalRef.componentInstance.descuento = totalDescuento;
    // modalRef.componentInstance.total = total;
  }
  updateOrderStatus(item: any, status:string) {
    console.log("item ", item);
    // llamada API
  }
}
