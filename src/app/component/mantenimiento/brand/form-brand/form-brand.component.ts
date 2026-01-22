import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BrandService } from '@rdinvesiones/core/services/system/brand.service';
import { ToastrService } from 'ngx-toastr';
import { Category, Marca, ResponseMessage, SubCategory } from 'src/app/core';

@Component({
  selector: 'app-form-brand',
  templateUrl: './form-brand.component.html',
  styleUrls: ['./form-brand.component.scss']
})
export class FormBrandComponent implements OnInit {
 @Input() titulo: string = '';
  @Input() categoriaId: number = 0;
  @Input() formBrand: Marca
  
  title: string = 'Crear Sub Categoria';
  formGrupBrand: FormGroup = new FormGroup({});
  submitted: boolean = false
  isLoading: boolean = false
  subCateModel: SubCategory
  categoria: Category[] = []
  tipoSubCategoria: any = []
  imagenes: any = []
  deleteImgtemporal: any = []
  constructor(
    private formBuilder: FormBuilder,
    private totastService: ToastrService,
    config: NgbModalConfig,
    private brandService: BrandService,
    private modalService: NgbModal, // Inyecta NgbModal directamente aquí
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.formGrupBrand = this.formBuilder.group({
      brand: this.formBuilder.array([]),
    });
    if (this.formBrand) {
      this.setIdit()
    }
  }
  get brand() {
    return this.formGrupBrand.get('brand') as FormArray;
  }
  agregarSubCategory() {
    const brand = this.formBuilder.group({
      brand_name: ['', Validators.required],
      brand_img_url: ['',  Validators.required]
    });
    if (this.brand.length >= 10) {
      this.totastService.error("Está permitido registrar un máximo de 10 marcas por acción.");
      return
    }
    this.brand.push(brand);
  }
  eliminar(index: number) {
    this.brand.removeAt(index);
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        this.formGrupBrand.reset();
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
  onSubmit() {
    this.submitted = true
    if (this.formGrupBrand.invalid) {
      return;
    }
    const formData = new FormData();
    const brandsData = this.formGrupBrand.value.brand.map((brand: any, index: number) => ({
      brand_name: brand.brand_name,
      image_index: index, // Vincula el archivo con su índice
    }));
    
    // Agregar los datos de texto como JSON
    formData.append("brands", JSON.stringify(brandsData));
    
    // Agregar archivos
    this.formGrupBrand.value.brand.forEach((brand: any, index: number) => {
      if (brand.brand_img_url?.preview) {
        const file = this.base64ToFile(brand.brand_img_url.preview, `brand_${index}.jpg`);
        formData.append(`files[${index}]`, file);
      }
    });
    if (!this.formBrand) {
      
      this.brandService.register(formData).subscribe({
        next: (res: ResponseMessage) => {
          this.totastService.success(res?.message);
          this.formGrupBrand.reset();
          this.modalService.dismissAll();
          this.brandService.saveStatus(true)
          this.submitted = false
        },
        error: (err: any) => {
          this.totastService.error(err?.message || err);
          this.submitted = false
        },
        complete: () => {
          this.submitted = false
        },
      })
    } else {
      formData.append("deleteImgtemporal", this.deleteImgtemporal)
      formData.append("publicId_img", this.formBrand?.publicId_img)
      this.brandService.update(this.formBrand?.id, formData).subscribe({
        next: (res: ResponseMessage) => {
          this.totastService.success(res?.message);
          this.formGrupBrand.reset();
          this.modalService.dismissAll();
          this.brandService.saveStatus(true)
        },
        error: (err: any) => {
          this.totastService.error(err?.message);
          console.log(err)
          this.modalService.dismissAll();
        },
        complete: () => {
          console.log("finis")
        },
      })
    }
    
  }
  get f() {
    return this.formGrupBrand;
  }
  setIdit () {
    const brand = this.formBuilder.group({
      brand_name: [this?.formBrand?.brand_name || ''],
      brand_img_url: [this?.formBrand?.brand_img_url || ''],
    })
    this.brand.clear();
    this.brand.push(brand)
    
  }
 
  eliminarImagen(menuFormGroup: FormGroup) {
    this.deleteImgtemporal.push(menuFormGroup.controls["brand_img_url"].value)
    menuFormGroup.controls["brand_img_url"].setValue(null); // Elimina los datos de la imagen
  }
  onArchivoCargado(event: any, index: number) {
    const archivos = event.addedFiles;
    const brand = this.brand.controls[index] as FormGroup;
    brand.controls["brand_img_url"].setValue(archivos); // Asigna los archivos al FormControl específico dentro del FormGroup
    this.mostrarImagen(brand, archivos[0]); // Llama a la función para mostrar la imagen
  }
  mostrarImagen(brand: FormGroup, archivo: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      brand.controls["brand_img_url"].setValue({
        file: archivo,
        preview: e.target.result, // Establece la vista previa de la imagen en el FormControl
      });
    };
    reader.readAsDataURL(archivo); // Lee el archivo como base64
  }
  base64ToFile(base64: string, fileName: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
  
    return new File([u8arr], fileName, { type: mime });
  }
  
}

