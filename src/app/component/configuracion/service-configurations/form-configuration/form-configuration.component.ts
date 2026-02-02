import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { Configurations } from "@rdinvesiones/core/interface/configurations.interface";
import { ConfigurationsService } from "@rdinvesiones/core/services/system/configurations.service";
import { ToastrService } from "ngx-toastr";
import {
  Company,
  CompanyService,
  DataDefault,
  ListPage,
  ResponseMessage,
} from "src/app/core";

@Component({
  selector: "app-form-configuration",
  templateUrl: "./form-configuration.component.html",
  styleUrls: ["./form-configuration.component.scss"],
})
export class FormConfigurationComponent implements OnInit {
  @Input() titulo: string = "";
  @Input() configurationId: number = 0;
  @Input() formConfig: Configurations;
  submitted: boolean = false;
  isLoading: boolean = false;
  formGrupConfig: FormGroup;
  tipoServicio: any = [];
  tiposServicioUrl: any = [];
  companys: Company[];
  constructor(
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    config: NgbModalConfig,
    private configurationService: ConfigurationsService,
    private modalService: NgbModal, // Inyecta NgbModal directamente aquí
    private companyService: CompanyService,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    this.tipoServicio = DataDefault.TIPO_SERVICIO;
    this.tiposServicioUrl = DataDefault.TIPOS_SERVICIO_URL
    this.validateForm();
  }
  ngOnInit(): void {
    this.fetchCompany();
    if (this.formGrupConfig) {
      this.setIdit();
    }
  }

  validateForm() {
    this.formGrupConfig = this.formBuilder.group({
      name_service: [null, Validators.required],
      type_service: [null, Validators.required],
      public_key: [null],
      private_key: [null],
      company_id: [null, Validators.required],
      expiration_date: [null],
      description: [null],
      endpoint_url: this.formBuilder.array([]),
    });
  }
  get urls() {
    return this.formGrupConfig.get("endpoint_url") as FormArray;
  }
  agregarUrls() {
    if (this.urls.length >= 10) {
      this.toastService.error(
        "Está permitido registrar un máximo de 10 urls por acción.",
      );
      return;
    }

    this.urls.push(
      this.formBuilder.group({
        name_url: ["", Validators.required],
        endpoint_url: ["", Validators.required],
        type_servicio_url: [""]
      }),
    );
  }

  eliminar(index: number) {
    this.urls.removeAt(index);
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        this.formGrupConfig.reset();
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }
  guardar() {
  this.submitted = true;
  const expirationCtrl = this.formGrupConfig.get('expiration_date');

  if (expirationCtrl?.value === '') {
    expirationCtrl.setValue(null);
  }
  this.formGrupConfig.markAllAsTouched();
  console.log(this.formGrupConfig)
  if (this.formGrupConfig.invalid) {
    return;
  }
  const data = { ...this.formGrupConfig.value };

  // Formatear fecha SOLO si existe
  data.expiration_date = data.expiration_date
    ? this.formatDate(data.expiration_date)
    : null;

  // (opcional) clonar FormArray
  data.endpoint_url = [...data.endpoint_url];

  if (!this.formConfig) {
    // CREATE
    this.configurationService.register(data).subscribe({
      next: (res: ResponseMessage) => {
        this.toastService.success(res?.message);
        this.formGrupConfig.reset();
        this.modalService.dismissAll();
        this.configurationService.saveStatus(true);
        this.submitted = false;
      },
      error: (err: any) => {
        this.toastService.error(err?.message || 'Error al registrar');
        this.submitted = false;
      },
    });
  } else {
    // UPDATE
    console.log("data ", data)
    this.configurationService
      .update(this.formConfig.configuration_id, data)
      .subscribe({
        next: (res: ResponseMessage) => {
          this.toastService.success(res?.message);
          this.formGrupConfig.reset();
          this.modalService.dismissAll();
          this.configurationService.saveStatus(true);
        },
        error: (err: any) => {
          this.toastService.error(err?.message || 'Error al actualizar');
          this.modalService.dismissAll();
        },
      });
  }
}

  // guardar() {
  //   this.submitted = true;
  //   console.log(this.formGrupConfig)
  //   if (this.formGrupConfig.invalid) {
  //     return;
  //   }
  //   let data = this.formGrupConfig.value;
  //   if (!this.formConfig) {
  //     data.expiration_date = this.formatDate(data?.expiration_date);
  //     this.configurationService.register(data).subscribe({
  //       next: (res: ResponseMessage) => {
  //         this.toastService.success(res?.message);
  //         this.formGrupConfig.reset();
  //         this.modalService.dismissAll();
  //         this.configurationService.saveStatus(true);
  //         this.submitted = false;
  //       },
  //       error: (err: any) => {
  //         this.toastService.error(err?.message || err);
  //         this.submitted = false;
  //       },
  //       complete: () => {
  //         this.submitted = false;
  //       },
  //     });
  //   } else {
  //     data.expiration_date = this.formatDate(data?.expiration_date);
  //     this.configurationService.update(this.formConfig?.configuration_id, data)
  //       .subscribe({
  //         next: (res: ResponseMessage) => {
  //           this.toastService.success(res?.message);
  //           this.formGrupConfig.reset();
  //           this.modalService.dismissAll();
  //           this.configurationService.saveStatus(true);
  //         },
  //         error: (err: any) => {
  //           this.toastService.error(err?.message);
  //           this.modalService.dismissAll();
  //         },
  //         complete: () => {
  //           console.log("finis");
  //         },
  //       });
  //   }
  // }
  get f() {
    return this.formGrupConfig.controls;
  }
  setIdit() {
    this.formGrupConfig?.patchValue({
      name_service: this.formConfig?.name_service,
      type_service: this.formConfig?.type_service,
      public_key: this.formConfig?.public_key,
      private_key: this.formConfig?.private_key,
      company_id: this.formConfig?.company_id,
      expiration_date: this.parseDate(this.formConfig?.expiration_date),
      description: this.formConfig?.description,
      endpoint_url: this.formConfig?.endpoint_url,
    });
    this.setEndpointUrls(this.formConfig?.endpoint_url);
  }
  setEndpointUrls(urls: any) {
    const array = this.urls;
    array.clear();

    urls?.forEach((url: any) => {
      array.push(
        this.formBuilder.group({
          name_url: [url.name_url || "", Validators.required],
          endpoint_url: [url.endpoint_url || "", Validators.required],
          type_servicio_url: [url.type_servicio_url || ""],
        }),
      );
    });
  }
  parseDate(date: string) {
    if(!date) return ""
    const d = new Date(date);
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
  }

  fetchCompany() {
    this.companyService.get().subscribe({
      next: (res: ListPage) => {
        this.companys = res.content as Company[];
      },
      error: (err: any) => {},
    });
  }
  formatDate(date: { year: number; month: number; day: number }): string {
    const month = String(date.month).padStart(2, "0");
    const day = String(date.day).padStart(2, "0");
    return `${date.year}-${month}-${day}`;
  }
}
