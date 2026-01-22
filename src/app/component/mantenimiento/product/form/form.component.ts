import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { DocumentService } from "@rdinvesiones/core/services/system/adjuntar.service";
import { BrandService } from "@rdinvesiones/core/services/system/brand.service";
import { ToastrService } from "ngx-toastr";
import {
  Category,
  Color,
  CompanyService,
  DataDefault,
  Garantia,
  ListPage,
  Marca,
  Producto,
  ResponseMessage,
  SedeService,
  SubCategory,
} from "src/app/core";
import { ProductoService } from "src/app/core/services/system/producto.service";
import { RequestStatus } from "src/app/core/type/status.type";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
  styleUrls: ["./form.component.scss"],
})
export class FormProductComponent implements OnInit {
  @Input() titulo: string = "";
  @Input() formProduct: any;
  active = 1;
  idProduct: number = 0;
  title: string = "Crear Producto";
  productFormGroup: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isLoading: boolean = false;
  categoria: any = [];
  product: Producto;
  imagesProduct: any = [];
  files: File[] = [];
  filePrincipal: any;
  status: RequestStatus = "init";
  subCategory: SubCategory[];
  marca: Marca[];
  color: Color[];
  garantia:Garantia[]

  extencionOld = "";
  filesDetailsDelete: Object[] = [];
  tienda: any = [];
  company: any = [];
  deleteStoretemporal: any = []
  storeTemporal: any = []
  accesorios: any = []
  companyId: number = 2
  constructor(
    private formBuilder: FormBuilder,
    private totastService: ToastrService,
    config: NgbModalConfig,
    private productService: ProductoService,
    private modalService: NgbModal,
    private documentService: DocumentService,
    private sedeService: SedeService,
    private companyService: CompanyService,
    private brandService: BrandService
  ) {
    config.backdrop = "static";
    config.keyboard = false;
    this.color = DataDefault.COLORDEFAULT;
    this.garantia = DataDefault.GARANTIADEFAULT

  }
  ngOnInit(): void {
    this.category();
    this.getEmpresa();
    this.getMarca()
    this.getAccesorios()
    this.productFormGroup = this.formBuilder.group({
      nombre: [null, Validators.required],
      codigo: [this.generarCodigoProducto(), [Validators.required]],
      categoria: ["", Validators.required],
      subCategoryId: ["", Validators.required],
      modelo: [null, Validators.required],
      descuento: [null],
      marcaId: [null, Validators.required],
      color: [null],
      garantia: [null],
      accesorios: [null],
      capacidad: [null],
      descripcion: ["", Validators.required],
      llevateHoy: [false],
      ofertaEspecial: [false],
      destacadoSemana: [false],
      nuevoProducto: [false],
      recojoDespacho: [false],
      isAccesorio: [false],
      empresa: ["", Validators.required],
      store: this.formBuilder.array([]),
    });
    if (this.formProduct) {
      this.setEdit();
    }
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        this.productFormGroup.reset();
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }
  onchangeSubcategory(cate: Category) {
    this.productService.getSubCategory(cate?.id).subscribe({
      next: (res: ListPage) => {
        this.subCategory = res?.content as SubCategory[];
      },
      error: (err: any) => {
        this.totastService.error(err?.error?.error);
      },
    });
  }
  agregarStore() {
    const store = this.formBuilder.group({
      tienda: ["", Validators.required],
      precio: ["0.00", [Validators.required, Validators.min(1)]],
      stock: ["0", [Validators.required, Validators.min(1)]],
    });
    this.store.push(store);
  }
  get store() {
    return this.productFormGroup?.get("store") as FormArray;
  }
  eliminarStore(index: number) {
    this.deleteStoretemporal.push(this.store?.value[index])
    this.store.removeAt(index);
  }
  guardar() {
    this.submitted = true;
    if (
      this.filePrincipal === null ||
      typeof this.filePrincipal === "undefined"
    ) {
      this.totastService.error("La imagen principal del producto es requerido");
      return;
    }
    if (this.files.length === 0) {
      this.totastService.error(
        "Las imagenes del detalle del producto son requeridos"
      );
      return;
    }
    if (this.productFormGroup.invalid) {
      return;
    }
    this.product = {
      nombre: this.productFormGroup.get("nombre")?.value,
      codigo: this.productFormGroup.get("codigo")?.value,
      subCategoria: this.productFormGroup.get("subCategoryId")?.value,
      modelo: this.productFormGroup.get("modelo")?.value,
      descuento: this.productFormGroup.get("descuento")?.value,
      marca: this.productFormGroup.get("marcaId")?.value,
      color: this.productFormGroup.get("color")?.value,
      capacidad: this.productFormGroup.get("capacidad")?.value,
      descripcion: this.productFormGroup.get("descripcion")?.value,
      llevateHoy: this.productFormGroup.get("llevateHoy")?.value,
      ofertaEspecial: this.productFormGroup.get("ofertaEspecial")?.value,
      destacadoSemana: this.productFormGroup.get("destacadoSemana")?.value,
      nuevoProducto: this.productFormGroup.get("nuevoProducto")?.value,
      is_accesorio: this.productFormGroup.get("isAccesorio")?.value ? "1" : "0",
      garantia: this.productFormGroup.get("garantia")?.value,
      accesorios: this.productFormGroup.get("accesorios")?.value,
      imageDetails: "",
      main_image_url: null,
      store: this.productFormGroup.value.store,
      recojoDespacho: this.productFormGroup.get("recojoDespacho")?.value
        ? "1"
        : "0",
    };
    if (this.product.ofertaEspecial && !this.product.descuento) {
      this.totastService.error("Campo descuento producto es obligatorio");
      return;
    }
    this.isLoading = true;
    if (this.idProduct === 0) {
      this.productService
        .register(this.product, this.filePrincipal?.file, this.files)
        .subscribe({
          next: (res: ResponseMessage) => {
            this.totastService.success(res?.message);
            this.productFormGroup.reset();
            this.modalService.dismissAll();
            this.productService.saveStatus(true);
            this.submitted = false;
          },
          error: (err: any) => {
            this.totastService.error(err?.message);
            this.submitted = false;
          },
          complete: () => {
            console.log("finis");
            this.isLoading = false;
          },
        });
    } else {
      this.product.imageDeleted = this.filesDetailsDelete;
      this.product.imageDetails = this.files.filter(
        (f) => !(f instanceof File)
      );
      this.files = this.files.filter((f) => f instanceof File);
      if (this.filePrincipal && !(this.filePrincipal.file instanceof File)) {
        this.product.main_image_url = this.filePrincipal.preview;
      }
      this.productService
        .update(
          this.idProduct,
          this.product,
          this.filePrincipal?.file,
          this.files,
          this.deleteStoretemporal
        )
        .subscribe({
          next: (res: ResponseMessage) => {
            this.totastService.success(res?.message);
            this.productFormGroup.reset();
            this.modalService.dismissAll();
            this.productService.saveStatus(true);
            this.submitted = false;
          },
          error: (err: any) => {
            this.totastService.error(err?.message);
            this.submitted = false;
          },
          complete: () => {
            console.log("finis");
            this.isLoading = false;
          },
        });
    }
  }
  get f() {
    return this.productFormGroup;
  }
  setEdit() {
    const storeArray = this.productFormGroup.get("store") as FormArray;
    storeArray.clear();
    this.formProduct?.store.forEach((storeItem: any) => {
      const storeControl = this.formBuilder.group({
        tienda: [storeItem.store_id || null],
        stock: [storeItem.stock_quantity || null],
        precio: [storeItem.precio || null],
      });
      storeArray.push(storeControl);
    });
    this.onchangeSubcategory({ id: this.formProduct.categoryId, type_category: ""});
    this.productFormGroup.setValue({
      nombre: this.formProduct?.name,
      codigo: this.formProduct?.codeProduct,
      modelo: this.formProduct?.model,
      descuento: this.formProduct?.discount,
      marcaId: this.formProduct?.brand_id,
      color: this.formProduct?.color,
      garantia: this.formProduct?.garantia,
      accesorios: this.formProduct?.accesorios,
      capacidad: this.formProduct?.capacidad,
      descripcion: this.formProduct?.description,
      categoria: this.formProduct?.categoryId,
      llevateHoy: this.formProduct?.llevateHoy,
      ofertaEspecial: this.formProduct?.ofertaEspecial,
      destacadoSemana: this.formProduct?.destacadoSemana,
      nuevoProducto: this.formProduct?.nuevoProducto,
      recojoDespacho: +this.formProduct?.recojoDespacho === 1 ? true : false,
      isAccesorio: this.formProduct?.is_accesorio === "1" ? true : false,
      empresa: this.formProduct?.store[0]?.companyId,
      subCategoryId: this.formProduct?.subcategory_id,
      store: storeArray.value,
    });
    this.idProduct = this.formProduct?.id || 0;
    const objectFileMain = {
      preview: this.formProduct.main_image_url,
      publicId: this.formProduct.publicId,
    };
    this.filePrincipal = objectFileMain;
    this.files = this.formProduct.detailsImage.map((ima) => {
      return {
        preview: ima.imageUrl,
        publicId: ima.publidId,
      };
    });
    this.getTiendaByCompany(this.formProduct?.store[0]?.companyId)
  }
  category() {
    this.productService.getCategory().subscribe({
      next: (res: ListPage) => {
        this.categoria = res?.content;
      },
      error: (err) => {},
    });
  }

  onSelect(event, typeFile: string) {
    let existFile;
    if (typeFile === "principal") {
      existFile = this.filePrincipal?.name === event.addedFiles[0].name;
    } else {
      existFile = this.files.find((f) => f.name === event.addedFiles[0].name);
    }

    if (existFile) {
      this.totastService.error(
        "No puedes subir 2 veces el archivo " + existFile.name,
        "Error!"
      );
      return;
    } else if (this.files.length >= 7) {
      this.totastService.error(
        "El numero maximo de adjuntar archivos adjuntados es 7.",
        "Error!"
      );
      return;
    } else {
      for (let file of event.addedFiles) {
        const reader = new FileReader();
        if (typeFile === "principal") {
          reader.onload = (e: any) => {
            const filePreview = {
              file: file,
              preview: e.target.result,
            };
            this.filePrincipal = filePreview;
          };
          reader.readAsDataURL(file);
        } else {
          reader.onload = (e: any) => {
            file.preview = e.target.result;
            this.files.push(file);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  onRemove(event, typeFile: string) {
    if (this.idProduct > 0) {
      // update
      const object = {
        url: event?.preview,
        publicId: event?.publicId,
      };
      this.filesDetailsDelete.push(object);
    }
    if (typeFile === "principal") {
      this.filePrincipal = null;
    } else {
      this.files.splice(this.files.indexOf(event), 1);
    }
  }
  sendFile() {
    const key = "files";
    if (this.files.length === 0) {
      this.totastService.error("Minimo un archivo debe adjuntar", "Error!");
    } else {
      const formData = new FormData();
      this.files.forEach((file, index) => {
        formData.append(key, file);
      });
      formData.append("isStatic", "true");
      formData.append("code_person", "292323212");
      this.uploadFile(formData);
    }
  }
  uploadFile(formData: FormData) {
    this.status = "loading";
    this.documentService.upload(formData).subscribe(
      (res) => {
        this.totastService.success(res.message, "Exito");
        this.status = "init";
      },
      (error) => {
        this.totastService.error(error.message, "Error!");
        this.status = "init";
      }
    );
  }
  updateFile(formData: FormData) {
    formData.append("id", "1");
    this.status = "loading";
    this.documentService.update(formData).subscribe(
      (res) => {
        this.files = [];
        this.totastService.success(res.message, "Exito");
        this.status = "init";
      },
      (error) => {
        this.totastService.error(error.message, "Error!");
        this.status = "init";
      }
    );
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
  async getAccesorios() {
   this.productService.getAccesorio(this.companyId).subscribe({
      next: (res: any) => {
        this.accesorios = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getMarca() {
    this.brandService.fetchAllBrands().subscribe({
      next: (res: ListPage) => {
        this.marca = res.content as Marca[];
        console.log("this.marca ", this.marca)
      },
      error: (err: any) => {},
    });
  }
  getTiendaByCompany(id: number) {
    this.sedeService.getByIDcompanySede(id).subscribe({
      next: (res: any) => {
        this.tienda = res;
        if(this.idProduct === 0) this.agregarStore();

      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  generarCodigoProducto() {
    // Prefijo para el código del producto
    const prefijo = "PROD";
    // Generar un número aleatorio de 4 dígitos
    const numeroAleatorio = Math.floor(Math.random() * 10000);
    // Completar el número aleatorio con ceros a la izquierda si es necesario
    const numeroFormateado = numeroAleatorio.toString().padStart(4, "0");
    // Crear el código del producto combinando el prefijo y el número aleatorio
    const codigoProducto = `${prefijo}-${numeroFormateado}`;
    return codigoProducto;
  }
  changeStore(index: number) {
    const obj = {
      tienda: this.formProduct?.store[index].store_id
    }
    this.deleteStoretemporal.push(obj)
  }
}
