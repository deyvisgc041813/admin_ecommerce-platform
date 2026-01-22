import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Configurations } from "@rdinvesiones/core/interface/configurations.interface";
import { FilterList } from "@rdinvesiones/core/interface/general.interface";
import { ConfigurationsService } from "@rdinvesiones/core/services/system/configurations.service";
import { ToastrService } from "ngx-toastr";
import { ListPage } from "src/app/core";
import Swal from "sweetalert2";

@Component({
  selector: "app-list-configuration",
  templateUrl: "./list-configuration.component.html",
  styleUrls: ["./list-configuration.component.scss"],
})
export class ListConfigurationComponent implements OnInit {
  @Output() update: EventEmitter<Object> = new EventEmitter<Object>();
  @ViewChild("urlsModalTpl", { static: true })
  urlsModalTpl!: TemplateRef<any>;
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
  urlsModal: { name_url: string; endpoint_url: string }[] = [];
  constructor(
    private configurationService: ConfigurationsService,
    private toastService: ToastrService,
    private modalService: NgbModal,
  ) {}
  ngOnInit(): void {
    this.listar();
    this.obserbableOpertator();
  }
  clearFilter() {}
  listar() {
    this.configurationService.get(this.filter).subscribe({
      next: (res: ListPage) => {
        this.list = res;
      },
      error: (err: any) => {},
    });
  }
  edit(id: number) {
    this.configurationService.getById(id).subscribe({
      next: (res: Configurations) => {
        const response = {
          opcion: "edit",
          data: res,
        };
        this.update.emit(response);
      },
      error: (err: any) => {
        this.toastService.error(err?.error?.error);
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
        title: `Seguro de eliminar esta configuración?`,
        text: `¡No podrás revertir esto!`,
        icon: "warning",
        confirmButtonText: `Si, eliminar!`,
        cancelButtonText: "No, cerrar!",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.configurationService.deleteConfig(id).subscribe({
            next: (res: any) => {
              this.toastService.success(res?.message);
              this.listar();
            },
            error: (err: any) => {
              this.toastService.error(err?.message);
            },
            complete: () => {
              this.setFilterDefault();
            },
          });
        }
      });
  }
  onPageChange(page: number): void {
    this.pageNumber = page;
    this.setFilterDefault();
    this.listar();
  }
  obserbableOpertator() {
    this.configurationService.isRegisterOrUpdate$.subscribe({
      next: (res: boolean) => {
        this.setFilterDefault();
        if (res) this.listar();
      },
    });
  }
  changeStatus(id: number, status: string) {
    const message = status === "Active" ? "Desabilitar" : "Habilitar";
    status = status === "Active" ? "1" : "0";
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger ms-2",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: `Seguro de ${message} esta configuración?`,
        text: `¡No podrás revertir esto!`,
        icon: "warning",
        confirmButtonText: `Si, ${message}!`,
        cancelButtonText: "No, cerrar!",
        showCancelButton: true,
      })
      .then((result) => {
        if (result.value) {
          this.configurationService.updateStatus(id, status).subscribe({
            next: (res: any) => {
              this.listar();
            },
            error: (err: any) => {
              this.toastService.error(err);
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
    this.filter.data = {};
  }

verUrls(endpointUrl: any[]): void {
  this.urlsModal = endpointUrl; 
  this.modalService.open(this.urlsModalTpl, {
    size: 'lg',
    centered: true,
  });
}

  copiar(url: string): void {
    navigator.clipboard.writeText(url);
  }
}
