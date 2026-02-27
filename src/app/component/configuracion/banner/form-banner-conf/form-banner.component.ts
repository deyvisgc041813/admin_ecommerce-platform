import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { EcomerceService } from "@rdinvesiones/core/services/system/ecomerce.service";
import { ToastrService } from "ngx-toastr";
import {
  CompanyService,
  DataDefault,
  ListPage,
  ProductoService,
  SedeService,
  SubCategory,
  SubcategoryService,
} from "src/app/core";
@Component({
  selector: "app-form-ecomerce",
  templateUrl: "./form-banner.component.html",
  styleUrls: ["./form-banner.component.scss"],
})
export class FormBannerComponent implements OnInit {
  @Input() titulo: string;
  @Input() bannerUpdate: any;
  submitted: boolean = false;
  formBanner: FormGroup;
  selectedSedeId: number;
  selectedCompanyId: number;
  formPromociones: FormGroup;
  isLoading: boolean = false;
  products: any[];
  company: any[];
  subCategoria: ListPage;
  sedes: any[];
  promotionalPhrases: any = [];
  productSelect: any = {};
  filePrincipal: { file: File; preview: string }[] = [];
  filePrincipalPromo: { file: File; preview: string }[] = [];
  type: "PRINCIPAL" | "PROMOCION" = "PRINCIPAL";
  activeTab = 1;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    config: NgbModalConfig,
    private totastService: ToastrService,
    private sedeService: SedeService,
    private companyService: CompanyService,
    private productService: ProductoService,
    private ecomerceService: EcomerceService,
    private subCategoriaService: SubcategoryService,
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }

  ngOnInit() {
    this.promotionalPhrases = DataDefault.FRASES_PROMOCIONES;
    this.getEmpresa();
    this.getSubCategoria();
    this.formBanner = this.formBuilder.group({
      empresa: [""],
      sede: [""],
      banner: this.formBuilder.array([]),
    });
    this.formPromociones = this.formBuilder.group({
      promociones: this.formBuilder.array([]),
    });
    if (this.bannerUpdate) {
      this.setIdit();
    }
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        if (this.banner && this.banner.length > 0) {
          this.banner.clear();
        }

        if (this.promociones && this.promociones.length > 0) {
          this.promociones.clear();
        }
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }
  agregarBanner() {
    if (this.banner.length >= 5) {
      this.totastService.warning(
        "Solo puedes agregar máximo 5 banner por operación",
      );
      return;
    }
    const banner = this.formBuilder.group({
      title: ["", Validators.required],
      etiqueta: ["", Validators.required],
      subCategoria: ["", Validators.required],
      pathSubCate: ["", Validators.required],
      descripcion: ["", Validators.required],
      precio: ["", Validators.required],
      image: [null, Validators.required],
    });
    this.banner.push(banner);
  }

  agregarPromociones() {
    if (!this.selectedSedeId) {
      this.totastService.warning(
        "Debe seleccionar una compañía y una tienda antes de agregar promociones.",
      );
      return;
    }
    if (this.promociones.length >= 5) {
      this.totastService.warning(
        "Solo puedes agregar máximo 3 promociones por operación",
      );
      return;
    }

    const promociones = this.formBuilder.group({
      icon: ["", Validators.required],
      codProduct: ["", Validators.required],
      title: ["", Validators.required],
      productId: ["", Validators.required],
      etiqueta: ["", Validators.required],
      precio: ["", Validators.required],
      image: [null, Validators.required],
      promPrincipal: [false],
    });
    this.promociones.push(promociones);
  }
  get banner() {
    return this.formBanner?.get("banner") as FormArray;
  }
  get promociones() {
    return this.formPromociones?.get("promociones") as FormArray;
  }

  guardar() {
    this.submitted = true;

    if (!this.formBanner.value.empresa) {
      this.totastService.error("Seleccione una empresa válida.");
      return;
    }

    if (!this.selectedSedeId) {
      this.totastService.error("Seleccione una tienda válida.");
      return;
    }


    const formData = new FormData();
    formData.append("storeId", this.selectedSedeId.toString());
    formData.append("type", this.type);
    if (!this.bannerUpdate) {
      // if (!this.promociones || this.promociones.length !== 3) {
      //   this.totastService.error("Debe agregar exactamente 3 promociones.");
      //   return;
      // }
      // Validar que todas las promociones estén completas
          // if (!this.banner || this.banner.length === 0) {
    //   this.totastService.error("Debe agregar al menos un banner.");
    //   return;
    // }
    // // Validar que todos los banners estén completos
      if (!this.validateFormArray(this.banner, "Banner")) {
        return;
      }
      if (!this.validateFormArray(this.promociones, "Promoción")) {
        return;
      }
      // if (this.promociones.controls.length === 3) {
      //   const principales = this.promociones.controls.filter(
      //     (c) => c.get("promPrincipal")?.value === true,
      //   );
      //   if (principales.length === 0) {
      //     this.totastService.error("Debe seleccionar una promoción principal.");
      //     return;
      //   }
      //   if (principales.length > 1) {
      //     this.totastService.error(
      //       "Solo puede existir una promoción principal.",
      //     );
      //     return;
      //   }
      // }
      const bannerData = this.banner.controls.map(
        (group: any, index: number) => {
          const file = group.get("image")?.value;
          if (file) {
            formData.append(`bannerImage_${index}`, file);
          }
          return {
            index,
            title: group.value.title,
            subcategoryId: group.value.subCategoria,
            etiqueta: group.value.etiqueta,
            descripcion: group.value.descripcion,
            pathSubCate: group.value.pathSubCate,
            precio: group.value.precio,
          };
        },
      );
      const promoData = this.promociones.controls.map(
        (group: any, index: number) => {
          const file = group.get("image")?.value;
          if (file) {
            formData.append(`promoImage_${index}`, file);
          }
          return {
            index,
            productId: group.value.productId,
            promPrincipal: group.value.promPrincipal,
            title: group.value.title,
            etiqueta: group.value.etiqueta,
            precio: group.value.precio,
            icon: group.value.icon,
            codProduct: group.value.codProduct,
          };
        },
      );
      formData.append("banner", JSON.stringify(bannerData));
      formData.append("promociones", JSON.stringify(promoData));

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
        },
      });
    } else {
      if (this.type === "PRINCIPAL") {
        const banner = this.banner.at(0).value;
        formData.append("title", banner.title);
        formData.append("etiqueta", banner.etiqueta);
        formData.append("descripcion", banner.descripcion);
        formData.append("precio", banner.precio);
        formData.append("subcategoryId", banner.subCategoria);
        formData.append("pathSubCate", banner.pathSubCate);
        if (this.filePrincipal[0]?.file) {
          formData.append("image", this.filePrincipal[0].file);
          formData.append("publicId", this.bannerUpdate.public_id);
        }
      } else if (this.type === "PROMOCION") {
        const promo = this.promociones.at(0).value;
        formData.append("title", promo.title);
        formData.append("etiqueta", promo.etiqueta);
        formData.append("precio", promo.precio);
        formData.append("productId", promo.productId);
        //formData.append("promPrincipal", promo.promPrincipal);
        formData.append("icon", promo.icon);
        formData.append("codProduct", promo.codProduct);
        if (this.filePrincipalPromo[0]?.file) {
          formData.append("image", this.filePrincipalPromo[0].file);
          formData.append("publicId", this.bannerUpdate.public_id);
        }
      }
      this.ecomerceService
        .update(this?.bannerUpdate?.banner_id, formData)
        .subscribe({
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
          },
        });
    }
  }
  removeBanner(index: number) {
    this.filePrincipal.splice(index, 1);
    this.banner.removeAt(index);
  }
  removePromocion(index: number) {
    this.filePrincipalPromo.splice(index, 1);
    this.promociones.removeAt(index);
  }
  removeBannerImage(index: number) {
    this.filePrincipal[index] = null;
    const group = this.banner.at(index);
    group.get("image")?.setValue(null);
    group.get("image")?.markAsTouched();
    group.get("image")?.updateValueAndValidity();
  }
  removePromoImage(index: number) {
    this.filePrincipalPromo[index] = null;
    const group = this.promociones.at(index);
    group.get("image")?.setValue(null);
    group.get("image")?.markAsTouched();
    group.get("image")?.updateValueAndValidity();
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
  getSubCategoria() {
    this.subCategoriaService.getSubcategoriesWithCategories().subscribe({
      next: (res: ListPage) => {
        this.subCategoria = res.content;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  changeSede(companyId: number) {
    this.formBanner.patchValue({
      empresa: companyId,
    });
    this.sedeService.getByIDcompanySede(companyId).subscribe({
      next: (res: any) => {
        this.sedes = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  loadProductsBySede(sedeId: number) {
    this.getProductos(sedeId);
  }

  onProductChange(selected: any, index: number): void {
    this.promociones.at(index).patchValue({
      precio: selected.price || "",
      title: selected.name,
      codProduct: selected.codeProduct
    });
  }
  onSubCategoriaChange(selected: any, index: number): void {
    this.banner.at(index).patchValue({
      pathSubCate: selected.path || "",
    });
  }
  onEtiquetaChange(selected: any, index: number): void {
    this.promociones.at(index).patchValue({
      icon: selected.icon || "",
      etiqueta: selected.context
    });
  }
  setIdit() {
    this.selectedCompanyId = this?.bannerUpdate?.company_id;
    this.selectedSedeId = this?.bannerUpdate?.store_id;
    this.type = this?.bannerUpdate?.type;
    this.changeSede(this.selectedCompanyId);
    this.type = this.bannerUpdate?.type;

    if (this.type === "PRINCIPAL") {
      this.activeTab = 1;
      const banner = this.formBuilder.group({
        title: [this?.bannerUpdate?.title || ""],
        etiqueta: [this?.bannerUpdate?.etiqueta || ""],
        descripcion: [this?.bannerUpdate?.description || ""],
        precio: [this?.bannerUpdate?.price || ""],
        subCategoria: [this?.bannerUpdate?.subcategory_id || ""],
        pathSubCate: [this?.bannerUpdate?.sub_cate_path || ""],
        image: [null],
      });
      this.banner.clear();
      this.banner.push(banner);
      this.filePrincipal = [];
      // si quieres mostrar imagen existente
      if (this?.bannerUpdate?.image_path) {
        this.filePrincipal[0] = {
          file: null,
          preview: this?.bannerUpdate?.image_path,
        };
      }
    } else {
      this.activeTab = 2;
      this.loadProductsBySede(this.selectedSedeId)
      const promociones = this.formBuilder.group({
        title: [this?.bannerUpdate?.title || ""],
        productId: [this?.bannerUpdate?.product_id || ""],
        etiqueta: [this?.bannerUpdate?.etiqueta || ""],
        precio: [this?.bannerUpdate?.price || ""],
        promPrincipal: this?.bannerUpdate?.display_type === "CARD_LARGE",
        icon: this?.bannerUpdate?.icon,
        codProduct: this.bannerUpdate?.codProduct,
        image: [null],
      });
      this.promociones.clear();
      this.promociones.push(promociones);
      this.filePrincipalPromo = [];
      // si quieres mostrar imagen existente
      if (this?.bannerUpdate?.image_path) {
        this.filePrincipalPromo[0] = {
          file: null,
          preview: this?.bannerUpdate?.image_path,
        };
      }
    }
  }
  onSelect(event: any, index: number) {
    const file: File = event.addedFiles[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.filePrincipal[index] = {
        file,
        preview: e.target.result,
      };

      this.banner.at(index).patchValue({
        image: file,
      });
    };

    reader.readAsDataURL(file);
  }
  onSelectPromo(event: any, index: number) {
    const file: File = event.addedFiles[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.filePrincipalPromo[index] = {
        file,
        preview: e.target.result,
      };

      this.promociones.at(index).patchValue({
        image: file,
      });
    };

    reader.readAsDataURL(file);
  }
  private validateFormArray(formArray: FormArray, label: string): boolean {
    for (let i = 0; i < formArray.length; i++) {
      const group = formArray.at(i) as FormGroup;

      if (group.invalid) {
        group.markAllAsTouched();
        this.totastService.error(`${label} ${i + 1} tiene campos incompletos.`);
        return false;
      }

      if (!this.bannerUpdate && !group.get("image")?.value) {
        this.totastService.error(`${label} ${i + 1} debe tener una imagen.`);
        return false;
      }
    }

    return true;
  }

  applyPromosionPrincipal(index: number) {
    const promociones = this.formPromociones.get("promociones") as FormArray;

    promociones.controls.forEach((control, i) => {
      if (i !== index) {
        control.get("promPrincipal")?.setValue(false, { emitEvent: false });
      }
    });
  }
  getProductos(storeId: number) {
    this.productService.getNotPagineted(storeId).subscribe({
      next: (res: any) => {
        this.products = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
}
