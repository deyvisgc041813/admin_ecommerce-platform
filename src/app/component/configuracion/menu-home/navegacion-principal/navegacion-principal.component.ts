import { Component, Input, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { BrandService } from "@rdinvesiones/core/services/system/brand.service";
import { MenuService } from "@rdinvesiones/core/services/system/menu.service";
import { ToastrService } from "ngx-toastr";
import {
  Color,
  DataDefault,
  ListPage,
  Marca,
  SubCategory,
  SubcategoryService,
} from "src/app/core";

@Component({
  selector: "app-navegacion-principal",
  templateUrl: "./navegacion-principal.component.html",
  styleUrls: ["./navegacion-principal.component.scss"],
})
export class NavegacionPrincipalComponent implements OnInit {
  @Input() categoryId: number = 0;
  submitted: boolean = false;
  formMenuGrup: FormGroup;
  isLoading: boolean = false;
  tipoMenuCategoria: string = "";
  menuCategory: any = [];
  parent_name: string = "";
  lsSubCategoria: SubCategory[];
  menuSelected: any[];
  subMenus: any[];
  isMultiple: boolean = true;
  marca: Marca[];
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private menuService: MenuService,
    config: NgbModalConfig,
    private totastService: ToastrService,
    private subCategoriaService: SubcategoryService,
    private brandService: BrandService
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }

  ngOnInit() {
    this.getMenuCategory();
    this.getSubCategory();
    this.getSubMenus();
    this.getMarca();
    this.formMenuGrup = this.formBuilder.group({
      sub_menu_id: ["", Validators.required],
      menuPrincipal: this.formBuilder.array([]),
      menuSecundario: this.formBuilder.array([
        // this.agregarMenuSecundario()
      ]),
    });
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService?.dismissAll();
        this.menuPrincipal?.setValue([]);
        this.menuSecundario?.setValue([]);
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }
  agregarMenuPrincipal() {
    const menu = this.formBuilder.group({
      titulo: ["", Validators.required],
      archivo: new FormControl(null),
    });
    this.menuPrincipal?.push(menu);
  }
  agregarMenuSecundario() {
    const menu = this.formBuilder.group({
      titulo: ["", Validators.required],
      filter: ["", Validators.required],
      menu_category: new FormControl(null),
      menuSelected: [[]],
      isMultiple: [false], // Local state for isMultiple
    });
    this.menuSecundario.push(menu);
  }
  get menuPrincipal() {
    return this.formMenuGrup?.get("menuPrincipal") as FormArray;
  }
  get menuSecundario() {
    return this.formMenuGrup?.get("menuSecundario") as FormArray;
  }
  get subMenu() {
    return this.formMenuGrup?.get("sub_menu_id");
  }
  eliminarImagen(menuFormGroup: FormGroup) {
    menuFormGroup.controls["archivo"].setValue(null); // Elimina los datos de la imagen
  }
  onArchivoCargado(event: any, index: number) {
    const archivos = event.addedFiles;
    const menuItem = this.menuPrincipal.controls[index] as FormGroup;
    menuItem.controls["archivo"].setValue(archivos); // Asigna los archivos al FormControl específico dentro del FormGroup
    this.mostrarImagen(menuItem, archivos[0]); // Llama a la función para mostrar la imagen
  }
  mostrarImagen(menuItem: FormGroup, archivo: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      menuItem.controls["archivo"].setValue({
        file: archivo,
        preview: e.target.result, // Establece la vista previa de la imagen en el FormControl
      });
    };
    reader.readAsDataURL(archivo); // Lee el archivo como base64
  }

  guardar() {
    if (this.menuSecundario.length === 0) {
      this.totastService.error("Menu secundario requerido");
      return;
    }
    this.submitted = true;
    if (this.formMenuGrup.invalid) {
      return;
    }
    const formData = new FormData();
    let menuPrincipal = [];
    let menuSecundario = [];
    this.formMenuGrup.value.menuPrincipal.forEach(
      (menu: any, index: number) => {
        if (menu.archivo) {
          formData.append(`file`, menu.archivo.file);
          const obj = {
            titulo: menu.titulo,
            fileName: menu.archivo.file.name,
          };
          menuPrincipal.push(obj);
        }
      }
    );
    this.formMenuGrup.value.menuSecundario.forEach(
      (menu: any, index: number) => {
        const obj = {
          descripcion: menu.titulo,
          menu_filters_id: menu.menu_category,
          filter: menu.filter,
        };
        menuSecundario.push(obj);
      }
    );
    formData.append("sub_menu_id", this.formMenuGrup.get("sub_menu_id").value);
    formData.append("menuSecundario", JSON.stringify(menuSecundario));
    formData.append("menuPrincipal", JSON.stringify(menuPrincipal));
    this.isLoading = true;
    this.menuService.register(formData).subscribe({
      next: (res) => {
        this.totastService.success(res?.message);
        this.formMenuGrup.reset();
        // this.menuPrincipal.setValue([])
        // this.menuSecundario.setValue([])
        this.submitted = false;
        this.modalService.dismissAll();
      },
      error: (err: any) => {
        console.log(err);
        this.totastService.success(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  eliminarMenuPrincipal(index: number) {
    this.menuPrincipal.removeAt(index);
  }
  eliminarMenuSecundario(index: number) {
    this.menuSecundario.removeAt(index);
  }
  getMenuCategory() {
    this.menuService.getMenuCategory().subscribe({
      next: (res: any) => {
        this.menuCategory = res?.filter(
          (me) => me.category_name.toLowerCase() !== "precio"
        );
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getSubCategory() {
    this.subCategoriaService.get().subscribe({
      next: (res: any) => {
        this.lsSubCategoria = res;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }
  getSubMenus() {
    this.menuService.getSubMenu(this.categoryId).subscribe({
      next: (res: any) => {
        this.subMenus = res;
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
        console.log("this.marca ", this.marca);
      },
      error: (err: any) => {},
    });
  }
  changeCategoriaMenu(event: any, index: number) {
    this.tipoMenuCategoria = event.category_name.toLowerCase();
    this.menuSelected = [];
    const currentGroup = this.menuSecundario.at(index) as FormGroup;
    currentGroup.patchValue({ filter: "" });
    const dataMap = {
      categoria: this.lsSubCategoria,
      "tipo de producto": this.lsSubCategoria,
      promociones: DataDefault.PROMOCIONESDEFAULT,
      marca: this.marca,
      capacidad: DataDefault.CAPACIDADLITROSDEFAULT,
      color: DataDefault.COLORDEFAULT,
      "capacidad de personas": DataDefault.CAPACIDADPERSONASDEFAULT.map(
        (sub) => ({
          ...sub,
          name: sub.name,
          param_filters: sub.name.toLowerCase().replace(/\s+/g, "-"),
        })
      ),
    };

    this.menuSelected = (dataMap[this.tipoMenuCategoria] || []).map((sub) => ({
      id: sub.id,
      name: sub?.subcategory_name || sub?.brand_name || sub?.name,
      param_filters:
        sub?.alias_subcategory || sub?.param_filters || sub?.name?.toLowerCase() || sub?.brand_name?.toLowerCase(),
    }));
    this.isMultiple = [
      "marca",
      "capacidad",
      "color",
      "capacidad de personas",
    ].includes(this.tipoMenuCategoria);
    currentGroup.patchValue({ titulo: event.category_name });
    currentGroup.patchValue({
      menuSelected: this.menuSelected,
      isMultiple: this.isMultiple,
    });
  }
}
