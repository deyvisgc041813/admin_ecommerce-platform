import { Component, Input, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ModalDismissReasons, NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { EcomerceService } from "@rdinvesiones/core/services/system/ecomerce.service";
import { ToastrService } from "ngx-toastr";
import {
  CompanyService,
  ListPage,
  ProductoService,
  SedeService
} from "src/app/core";
@Component({
  selector: 'app-form-ecomerce',
  templateUrl: './form-banner.component.html',
  styleUrls: ['./form-banner.component.scss']
})
export class FormBannerComponent implements OnInit {
  @Input() titulo: string;
  @Input() bannerUpdate: any;
  submitted: boolean = false;
  formBanner: FormGroup;
  isLoading: boolean = false;
  products: any[]
  company: any[]
  sedes: any[]
  promotionalPhrases: any = []
  productSelect: any = {}
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    config: NgbModalConfig,
    private totastService: ToastrService,
    private sedeService: SedeService,
    private companyService: CompanyService,
    private productService: ProductoService,
    private ecomerceService: EcomerceService
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }

  ngOnInit() {
    this.promotionalPhrases = [
      { context: "Oferta Especial" },
      { context: "Descuento Exclusivo" },
      { context: "Promoción del Día" },
      { context: "Precio Especial de Hoy" },
      { context: "Oferta Relámpago" },
      { context: "Oportunidad Única" },
      { context: "Precio Reducido" },
      { context: "Descuento de Temporada" },
      { context: "Edición Limitada" },
      { context: "Oferta por Lanzamiento" },
      { context: "Solo por Tiempo Limitado" },
      { context: "¡Últimas Unidades Disponibles!" }
    ];
    this.getProductos()
    this.getEmpresa()
    this.formBanner = this.formBuilder.group({
      empresa:["", Validators.required],
      sede:[""],
      banner: this.formBuilder.array([])
    });
    if (this.bannerUpdate) {
      this.setIdit()
    }

  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        this.banner.setValue([])
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
  agregarBanner() {
    const banner = this.formBuilder.group({
      productId: ["", Validators.required],
      etiqueta: ["", Validators.required],
      descripcion: ["", Validators.required],
      precio: ["", Validators.required]
    });
    this.banner.push(banner);
  }

  get banner() {
    return this.formBanner?.get("banner") as FormArray;
  }
  get empresa() {
    return this.formBanner?.get("empresa") as FormArray;
  }
  get sede() {
    return this.formBanner?.get("sede") as FormArray;
  }
  guardar() {
    this.submitted = true;
    if (this.formBanner.invalid) {
      return;
    }
    const formData = new FormData();
    formData.append("banner", JSON.stringify(this.formBanner.value.banner));
    formData.append("storeId", JSON.stringify(this.formBanner.value.sede));
    this.isLoading = true;
    if(!this.bannerUpdate) {
      this.ecomerceService.saveBanner(formData).subscribe({
        next: (res) => {
          this.totastService.success(res?.message);
          this.ecomerceService.saveStatus(true);
          this.formBanner.reset();
          this.submitted = false;
          this.modalService.dismissAll();
        },
        error: (err: any) => {
          this.totastService.error(err);
          this.isLoading = false;
          this.modalService.dismissAll();
        }
      });
    } else {
      this.ecomerceService.update(this?.bannerUpdate?.id, formData).subscribe({
        next: (res) => {
          this.totastService.success(res?.message);
          this.ecomerceService.saveStatus(true);
          this.formBanner.reset();
          this.submitted = false;
          this.modalService.dismissAll();
        },
        error: (err: any) => {
          this.totastService.error(err);
          this.isLoading = false;
          this.modalService.dismissAll();
        }
      });
    }
    
  }
  eliminarBanner(index: number) {
    this.banner.removeAt(index);
  }
  getProductos() {
    this.productService.getNotPagineted().subscribe({
      next: (res: any) => {
        this.products = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getEmpresa() {
    this.companyService.get().subscribe({
      next: (res: ListPage) => {
        this.company = res.content;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  changeSede(event: any) {
    this.sedeService.getByIDcompanySede(this.formBanner.value.empresa).subscribe({
      next: (res: any) => {
        this.sedes = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  onProductChange(selected: any, index: number): void {
    this.banner.at(index).patchValue({
      precio: selected.price || ''
    });
  }
  setIdit () {
    this.formBanner?.patchValue({
      empresa: this?.bannerUpdate?.company_id,
      sede: this?.bannerUpdate?.storeId
    })
    this.changeSede(null)
    const banner = this.formBuilder.group({
      productId: [this?.bannerUpdate?.productId || ''],
      etiqueta: [this?.bannerUpdate?.etiqueta || ''],
      descripcion: [this?.bannerUpdate?.descripcion || ''],
      precio: [this?.bannerUpdate?.precio || '']
    })
    this.banner.clear();
    this.banner.push(banner)
  }
}
