import { Component, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Roles } from "@rdinvesiones/core/interface/role.interface";
import { ToastrService } from "ngx-toastr";
import { AdminService, CompanyService, DataDefault, ResponseMessage, RolesService, Users } from "src/app/core";
import { RequestStatus } from "src/app/core/type/status.type";
import { Company } from "src/app/core/interface/company.interface";

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.scss']
})
export class FormUsuarioComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() formUsers: any;
  breadCrumbItems: Array<{}>;
  form: FormGroup;
  textSearch: any;
  submitted = false;
  status: RequestStatus;
  user: any[] = [];
  page = 1;
  pageSize = 10;
  role: Roles[] = [];
  tipoDocumento: any = []
  modulos: any = [];
  company: Company[] = []
  usuario: Users
  isLoading: boolean = false
  isPermisos: boolean = false
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private adminService: AdminService,
    private totastService: ToastrService,
    private rolesService: RolesService,
    private companyService: CompanyService
  ) {
    this.validateForm();
  }

  ngOnInit(): void {
    this.obtenerDatosAdicionales()
    if (this.formUsers) {
      this.setForm()
    }
  }

  validateForm() {
    
    this.form = this.fb.group({
      nombre: ["", Validators.required],
      correo: ["", [Validators.required, Validators.email]],
      clave: ["", Validators.required],
      telefono: ["", [Validators.required, Validators.maxLength(9), Validators.minLength(9)]],
      personal_email: ["", [Validators.required, Validators.email]],
      tipoDocumento: [1, Validators.required],
      numDocumento: ["", Validators.required],
      role_id: [1, Validators.required],
      company_id: ["", Validators.required]
    });
  }
  get f() {
    return this.form.controls;
  }
  guardar() {
    if (this.form.invalid) {
      this.submitted = true;
    } else {
      this.isLoading = true
      this.usuario = this.form.value
      // this.modulos.forEach(modulo => {
      //   delete modulo.open;
      // });
      // this.usuario.modules = this.modulos
      if(!this.formUsers) {
        this.save()
      } else {
        this.update()
      }
    }
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }

  // // Método para expandir o contraer los elementos del padre
  // toggleParent(item: any) {
  //   item.open = !item.open;
  // }

  // // Método para expandir o contraer los elementos del hijo
  // toggleChild(menu: any) {
  //   menu.open = !menu.open;
  // }

  save() {
    this.adminService.register(this.usuario).subscribe({
      next: (res: ResponseMessage) => {
        this.totastService.success(res?.message);
        this.form.reset();
        this.modalService.dismissAll();
        this.adminService.saveStatus(true)
        this.isLoading = false
      },
      error: (error: any) => {
        this.isLoading = false
        const msjError = error && error?.errors?.length == 1 ? error?.errors[0].message : error?.message
        
        // if (error?.errors?.length > 1) {
        //   const modalRef = this.modalService.open(ErrorUsersComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg'});
        //   modalRef.componentInstance.titulo = 'Errores al registrar Usuario';
        //   modalRef.componentInstance.errors = error?.errors
        //   return
        // } 
        this.totastService.error(msjError);
      },
      complete: () => {
        console.log("finis")
      },
    })
  }
  update() {
    this.usuario.user_id = this.formUsers.user_id
    this.adminService.update(this.formUsers.person_id, this.usuario).subscribe({
      next: (res: ResponseMessage) => {
        this.totastService.success(res?.message);
        this.form.reset();
        this.modalService.dismissAll();
        this.adminService.saveStatus(true)
        this.isLoading = false
      },
      error: (err: any) => {
        this.isLoading = false
        this.totastService.error(err?.errors?.message)
      },
      complete: () => {
        console.log("finis")
      },
    })
  }
  setForm() {
    this.form.patchValue({
      nombre: this.formUsers?.full_name,
      correo: this.formUsers?.email,
      telefono: this.formUsers?.phone,
      personal_email: this.formUsers?.personal_email,
      role_id: this.formUsers?.role_id,
      tipoDocumento: +this.formUsers?.type_document,
      numDocumento: this.formUsers?.num_document,
      company_id: this.formUsers.company_id
    })
    this.form.get("clave").clearValidators()
    this.form.get("clave").updateValueAndValidity()
  }
   selectAllPermissions(menu: any) {
    menu.permisos.forEach((permiso: any) => {
      permiso.checked = menu.selectAllChecked;
    });
  }
 async obtenerDatosAdicionales() {
    this.role = (await this.rolesService.getAsync()).content
    this.tipoDocumento = DataDefault.TIPO_DOCUMENTO
    this.company =  (await this.companyService.getAsync()).content
    // this.modulos = (await this.modulesService.getModuloWithPermissionsAsync()).content
    // this.modulos.forEach(modulo => {
    //   modulo.permisos?.forEach(permiso => {
    //     if ([4, 'leer'].includes(permiso.permission_id || permiso.permission_name.toLowerCase())) {
    //       permiso.checked = true;
    //     }
    //   });
    // });

  }
  // getIconClass(permissionName: string): string {
  //   switch (permissionName.toLowerCase()) {
  //     case 'crear':
  //       return 'fas fa-plus-circle text-success';
  //     case 'actualizar':
  //       return 'fas fa-edit text-warning';
  //     case 'desactivar y desactivar':
  //       return 'fas fa-ban text-danger';
  //     case 'leer':
  //       return 'fas fa-eye text-primary';
  //     default:
  //       return 'fas fa-question-circle';
  //   }
  // }
  
}
