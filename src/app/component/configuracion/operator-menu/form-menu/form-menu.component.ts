import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { BrandService } from '@rdinvesiones/core/services/system/brand.service';
import { MenuService } from '@rdinvesiones/core/services/system/menu.service';
import { ToastrService } from 'ngx-toastr';
import { DataDefault, ListPage, Marca, SubCategory, SubcategoryService } from 'src/app/core';

@Component({
  selector: 'app-form-menu',
  templateUrl: './form-menu.component.html',
  styleUrls: ['./form-menu.component.scss']
})
export class FormMenuComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() form: any;
  active = 1;
  idProduct: number = 0
  formMenu: FormGroup = new FormGroup({});
  submitted: boolean = false
  isLoading: boolean = false
  lsSubCategoria: SubCategory[]
  menuSelected: any[]
  isMultiple: boolean = true
  menuCategory: any = []
  tipoMenuCategoria: string = ''
  marca: Marca[];
  constructor(private formBuilder: FormBuilder,
    private menuService: MenuService, private totastService: ToastrService,
    private subCategoriaService: SubcategoryService, private modalService: NgbModal, private brandService: BrandService) { }

  ngOnInit(): void {
    this.formMenu = this.formBuilder.group({
      menuPrincipal: this.formBuilder.array([]),
      menuSecundario: this.formBuilder.array([])
    });
    this.getMarca()
    this.getMenuCategory()
    this.getSubCategory()
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        this.formMenu.reset();
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
  getMenuCategory() {
    this.menuService.getMenuCategory().subscribe({
      next: (res: any) => {
        this.menuCategory = res?.filter(me => me.category_name.toLowerCase() !== 'precio')
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }
  getSubCategory() {
    this.subCategoriaService.get().subscribe({
      next: (res: any) => {
        this.lsSubCategoria = res
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }
  getMarca() {
    this.brandService.fetchAllBrands().subscribe({
      next: (res: ListPage) => {
        this.marca = res.content as Marca[];
        console.log("this.marca ", this.marca);
      },
      error: (err: any) => {},
    });
  }
  get menuPrincipal() {
    return this.formMenu?.get('menuPrincipal') as FormArray;
  }
  get menuSecundario() {
    return this.formMenu?.get('menuSecundario') as FormArray;
  }
  eliminarImagen(menuFormGroup: FormGroup) {
    menuFormGroup.controls['archivo'].setValue(null); // Elimina los datos de la imagen
  }
  onArchivoCargado(event: any, index: number) {
    const archivos = event.addedFiles;
    const menuItem = this.menuPrincipal.controls[index] as FormGroup;
    menuItem.controls['archivo'].setValue(archivos); // Asigna los archivos al FormControl específico dentro del FormGroup
    this.mostrarImagen(menuItem, archivos[0]); // Llama a la función para mostrar la imagen
  }

  mostrarImagen(menuItem: FormGroup, archivo: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      menuItem.controls['archivo'].setValue({
        file: archivo,
        preview: e.target.result // Establece la vista previa de la imagen en el FormControl
      });
    };
    reader.readAsDataURL(archivo); // Lee el archivo como base64
  }
  agregarMenuPrincipal() {
    const menu = this.formBuilder.group({
      titulo: ['', Validators.required],
      filter_parameter: ['', Validators.required],
      archivo: new FormControl(null)
    });
    this.menuPrincipal?.push(menu);
  }
  agregarMenuSecundario() {
    const menu = this.formBuilder.group({
      titulo: ['', Validators.required],
      filter_parameter: ['', Validators.required],
      menu_category: new FormControl(null),
      menuSelected: [[]],
      isMultiple: [false] // Local state for isMultiple
    });
    this.menuSecundario.push(menu);
  }

  eliminarMenuPrincipal(index: number) {
    this.menuPrincipal.removeAt(index);
  }
  eliminarMenuSecundario(index: number) {
    this.menuSecundario.removeAt(index);
  }
  changeCategoriaMenu(event: any, index: number) {
    this.tipoMenuCategoria = event.category_name.toLowerCase()
    this.menuSelected = []
    const currentGroup = this.menuSecundario.at(index) as FormGroup;
    currentGroup.patchValue({ filter_parameter: '' });
    const dataMap = {
      'categoria': this.lsSubCategoria,
      'tipo de producto': this.lsSubCategoria,
      'promociones': DataDefault.PROMOCIONESDEFAULT,
      'marca': this.marca,
      'capacidad': DataDefault.CAPACIDADLITROSDEFAULT,
      'color': DataDefault.COLORDEFAULT,
      'capacidad de personas': DataDefault.CAPACIDADPERSONASDEFAULT.map(sub => ({
        ...sub,
        name: sub.name,
        param_filters: sub.name.toLowerCase().replace(/\s+/g, '-')
      }))
    };

    this.menuSelected = (dataMap[this.tipoMenuCategoria] || []).map(sub => ({
      id: sub.id,
      name: sub.subcategory_name || sub.name,
      param_filters: sub.alias_subcategory || sub.param_filters || sub.name.toLowerCase()
    }));
    this.isMultiple = ['marca', 'capacidad', 'color', 'capacidad de personas'].includes(this.tipoMenuCategoria);
    currentGroup.patchValue({ titulo: event.category_name });
    currentGroup.patchValue({ menuSelected: this.menuSelected, isMultiple: this.isMultiple });
  }

  guardar() {
    this.submitted = true
    if (this.formMenu.invalid) {
      return;
    }
    const formData = new FormData();
    let menuPrincipal = []
    this.formMenu.value.menuPrincipal.forEach((menu: any, index: number) => {
      if (menu.archivo) {
        formData.append(`file`, menu.archivo.file);
        const obj = {
          titulo: menu.titulo,
          filter_parameter: menu.filter_parameter,
          fileName: menu.archivo.file.name
        }
        menuPrincipal.push(obj)
      }
    });
    formData.append("parentId", this.form?.general?.id)
    formData.append("menuPrincipal", JSON.stringify(menuPrincipal))
    formData.append("menuSecundario", JSON.stringify(this.formMenu.value.menuSecundario))
    this.isLoading = true
    this.menuService.register(formData).subscribe({
      next: (res) => {
        this.totastService.success(res?.message);
        this.formMenu.reset();
        this.submitted = false
        this.modalService.dismissAll();
        this.menuService.saveStatus(true)
      },
      error: (err: any) => {
        console.log(err)
        this.totastService.error(err);
      },
      complete: () => {
        this.isLoading = false
      }
    })

  }



}
