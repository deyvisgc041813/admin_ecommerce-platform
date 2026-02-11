import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  OrderService,
  ListPage,
  DataDefault,
  ResponseMessage,
} from "src/app/core";
import { ViewVentasComponent } from "../view-ventas/view-ventas.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { FilterList } from "@rdinvesiones/core/interface/general.interface";
import { PaymentService } from "@rdinvesiones/core/services/system/payment.service";

@Component({
  selector: "app-list-ventas",
  templateUrl: "./list-ventas.component.html",
  styleUrls: ["./list-ventas.component.scss"],
})
export class ListVentasComponent implements OnInit {
  @ViewChild("receiptModal") receiptModal!: TemplateRef<any>;
  textSearch: string = "";
  totalElements: number = 0;
  list: ListPage;
  metodoPago: any;
  operacion: any;
  estados: any;
  tipoPagoTable: any;
  filtros: FilterList = {
    page: 1,
    size: 10,
  };
  receiptUrl: string | null = null;
  loading = false;
  constructor(
    private orderService: OrderService,
    private paymentService: PaymentService,
    private totastService: ToastrService,
    private modalService: NgbModal,
  ) {
    this.metodoPago = DataDefault.TIPOPAGO_ORDER;
    this.operacion = DataDefault.TIPOOPERACION_ORDER;
    this.estados = DataDefault.ESTADO_ORDER;
  }

  ngOnInit(): void {
    this.listar();
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
  listar() {
    this.orderService.get(this.filtros).subscribe({
      next: (res: ListPage) => {
        this.list = res;
        this.totalElements = res.totalElements;
      },
      error: (err: any) => {},
    });
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
      case DataDefault.ESTADO_ORDER.reserved.identifier: {
        {
          const actions = [
            {
              label: "Confirmar pago",
              action: () => this.updateOrderStatus(item, "paid"),
            },
            {
              label: "Cancelar",
              action: () => this.updateOrderStatus(item, "cancelled"),
            },
            { label: "Ver detalle", action: () => this.verDetalle(item) },
          ];

          // Solo agregar si es transferencia pendiente
          if (
            item.estado ===
            DataDefault.ESTADO_ORDER.pending_transfer_validation.identifier
          ) {
            actions.unshift({
              label: "Revisar comprobante",
              action: () => this.verComprobante(item?.pedidoId),
            });
          }

          return actions;
        }
      }

      case DataDefault.ESTADO_ORDER.paid.identifier: {
        const actions = [];
        if (item.envioDomicilio) {
          // Si es despacho → primero envío
          actions.push({
            label: "Confirmar envío",
            action: () => this.updateOrderStatus(item, "shipped"),
          });
        } else {
          // Si NO es despacho → se entrega directo
          actions.push({
            label: "Confirmar entrega",
            action: () => this.updateOrderStatus(item, "delivered"),
          });
        }
        actions.push(
          {
            label: "Reembolsar",
            action: () => this.updateOrderStatus(item, "refunded"),
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
            action: () => this.updateOrderStatus(item, "delivered"),
          },
          {
            label: "Reembolsar",
            action: () => this.updateOrderStatus(item, "refunded"),
          },
          { label: "Ver detalle", action: () => this.verDetalle(item) },
        ];

      case DataDefault.ESTADO_ORDER.delivered.identifier:
        return [
          {
            label: "Reembolsar",
            action: () => this.updateOrderStatus(item, "refunded"),
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
    this.filtros.page = page;
    this.listar();
  }
  obserbableOpertator() {
    this.orderService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        this.filtros.size = 10;
        this.filtros.page = 1;
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
              this.filtros.size = 10;
              this.filtros.page = 1;
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
  verDetalle(item: any) {
    this.orderService
      .getOrderDetails(item?.pedidoId, item.clienteId, item?.tiendaId)
      .subscribe({
        next: (res: any) => {
          //this.list = res;
          //this.totalElements = res.totalElements;
          const modalRef = this.modalService.open(ViewVentasComponent, {
            ariaLabelledBy: "modal-basic-title",
            size: "lg",
          });
          modalRef.componentInstance.titulo = `Pedido N° ${res[0]?.codigoPedido}`;
          modalRef.componentInstance.lista = res[0]?.detallesPedido;
          modalRef.componentInstance.descuento = res[0]?.totalDescuento;
          modalRef.componentInstance.total = res[0]?.total;
        },
        error: (err: any) => {},
      });
  }
  updateOrderStatus(item: any, status: string) {
    const orderStatus = this.estados[status];
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger ms-2",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: orderStatus?.confirmText,
        text: `¡No podrás revertir esto!`,
        icon: "warning",
        confirmButtonText: `Si, ${orderStatus?.labelBooton}!`,
        cancelButtonText: "No, cerrar!",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.orderService
            .updateOrderStatus(
              item?.pedidoId,
              item?.tiendaId,
              item.clienteId,
              status,
            )
            .subscribe({
              next: (res: ResponseMessage) => {
                this.totastService.success(res?.message);
              },
              error: (err: any) => {
                this.totastService.error(err?.message || err.error);
              },
              complete: () => {
                this.listar();
              },
            });
        }
      });
  }
  // Método para manejar el cambio del tamaño de página
  onPageSizeChange(size: number) {
    this.filtros.size = size;
    this.filtros.page = 1; // Reinicia a la primera página
    this.listar();
  }
  verComprobante(paymentId: number) {
    this.loading = true;
    this.receiptUrl = null;

    this.modalService.open(this.receiptModal, {
      size: "lg",
      centered: true,
    });

    this.paymentService.getReceipt(paymentId).subscribe((response: any) => {
      // si backend devuelve array
      const data = Array.isArray(response) ? response[0] : response;

      this.receiptUrl = data?.receiptUrl ?? null;
      this.loading = false;
    });
  }
}
