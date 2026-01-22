import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { Roles } from "@rdinvesiones/core/interface/role.interface";
import { PermissionsService } from "@rdinvesiones/core/services/system/permissions.service";
import { ToastrService } from "ngx-toastr";
import {
  ListPage,
  ModulesService,
  ProfileModulesPermissions,
  ResponseMessage,
  RoleModulesPermissionsService,
  RolesService,
} from "src/app/core";
@Component({
  selector: 'app-form-rol-per-mod',
  templateUrl: './form-rol-per-mod.component.html',
  styleUrls: ['./form-rol-per-mod.component.scss']
})
export class FormRolPerModComponent implements OnInit {
  @Input() titulo: string = "";
  @Input() formRoleModulePermision: ProfileModulesPermissions = null;

  formGrupPermissions: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isLoading: boolean = false;
  permisos: ListPage;
  modulos: ListPage;
  role: Roles[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private totastService: ToastrService,
    config: NgbModalConfig,
    private permissionService: PermissionsService,
    private rolePermissionsModulesService: RoleModulesPermissionsService,
    private moduleService: ModulesService,
   private rolesService: RolesService,
    private modalService: NgbModal
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.formGrupPermissions = this.formBuilder.group({
      permissions: this.formBuilder.array([]),
    });
    if (this.formRoleModulePermision) {
      this.setEdit();
    }
    this.obtenerDatosAdicionales();
  }
  get permissions() {
    return this.formGrupPermissions.get("permissions") as FormArray;
  }
  agregar() {
    const permissions = this.formBuilder.group({
      permission_id: ["", Validators.required],
      module_id: ["", Validators.required],
      role_id: ["", Validators.required],
    });
    if (this.permissions.length >= 10) {
      this.totastService.error(
        "Está permitido registrar un máximo de 10 permisos por acción."
      );
      return;
    }
    this.permissions.push(permissions);
  }
  eliminar(index: number) {
    this.permissions.removeAt(index);
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        this.formGrupPermissions.reset();
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.formGrupPermissions.invalid) {
      return;
    }
    this.isLoading = true;
    const permissions = ( this.formGrupPermissions?.value?.permissions as ProfileModulesPermissions[])
    const uniquePermissions = permissions.reduce((acc: ProfileModulesPermissions[], acceso) => {
      if (!acc.some((p) => p.role_id === acceso.role_id && p.module_id === acceso.module_id)) {
        acc.push(acceso); // Si no existe, lo agrega (mantiene el primero)
      }
      return acc;
    }, []) as ProfileModulesPermissions[];
    console.log("this.formRoleModulePermision ", this.formRoleModulePermision)
    if (!this.formRoleModulePermision) this.save(uniquePermissions);
    else this.update(uniquePermissions[0]);
  }

  save(acceso: ProfileModulesPermissions[]) {
    this.rolePermissionsModulesService.register(acceso)
    .subscribe({
      next: (res: ResponseMessage) => {
        console.log("res ", res.message)
        this.totastService.success(res?.message);
        this.formGrupPermissions.reset();
        this.modalService.dismissAll();
        this.rolePermissionsModulesService.saveStatus(true);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.log("err ", err);
        this.isLoading = false;
        this.totastService.error(err?.message);
      },
      complete: () => {
        console.log("finis");
      },
    });
  }
  update(acceso: ProfileModulesPermissions) {
    this.rolePermissionsModulesService
     .update(this.formRoleModulePermision.role_id, this.formRoleModulePermision.module_id, acceso)
      .subscribe({
        next: (res: ResponseMessage) => {
          this.totastService.success(res?.message);
          this.formGrupPermissions.reset();
          this.modalService.dismissAll();
          this.rolePermissionsModulesService.saveStatus(true);
          this.isLoading = false;
        },
        error: (err: any) => {
          this.totastService.error(err?.message);
          console.log(err);
          this.modalService.dismissAll();
          this.isLoading = false;
        },
        complete: () => {
          console.log("finis");
        },
      });
  }
  get f() {
    return this.formGrupPermissions;
  }
 async setEdit() {
    const acceso = this.formBuilder.group({
      role_id: ["", Validators.required],
      module_id: ["", Validators.required],
      permission_id: [null, Validators.required]
    });
    const permisosSeleccionados = this.formRoleModulePermision.permisos.map((permiso: any) => permiso.permission_id);
    acceso.patchValue({
      role_id: this.formRoleModulePermision.role_id,
      module_id: this.formRoleModulePermision.module_id,
      permission_id: permisosSeleccionados,
    });
    this.permissions.push(acceso);
  }
  
  async obtenerDatosAdicionales() {
    this.role = (await this.rolesService.getAsync()).content
    this.modulos = (await this.moduleService.getAsync()).content
    this.permisos = (await this.permissionService.getAsync()).content
  }

}
