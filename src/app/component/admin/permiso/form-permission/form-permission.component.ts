import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { PermissionsService } from "@rdinvesiones/core/services/system/permissions.service";
import { ToastrService } from "ngx-toastr";
import { ListPage, Permissions, ResponseMessage } from "src/app/core";
@Component({
  selector: "app-form-permission",
  templateUrl: "./form-permission.component.html",
  styleUrls: ["./form-permission.component.scss"],
})
export class FormPermissionComponent implements OnInit {
  @Input() titulo: string = "";
  @Input() formPermission: Permissions = null;
  formGrupPermissions: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isLoading: boolean = false;
  permisionsModel: Permissions[] = [];
  permisos: ListPage;
  modulos: ListPage;

  constructor(
    private formBuilder: FormBuilder,
    private totastService: ToastrService,
    config: NgbModalConfig,
    private permissionService: PermissionsService,
    private modalService: NgbModal
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.formGrupPermissions = this.formBuilder.group({
      permissions: this.formBuilder.array([]),
    });
    this.getPermiso();
    if (this.formPermission) {
      this.setEdit();
    }
  }
  get permissions() {
    return this.formGrupPermissions.get("permissions") as FormArray;
  }
  agregar() {
    const permissions = this.formBuilder.group({
      permission_name: ["", Validators.required],
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
  // onSubmit() {
  //   this.submitted = true;
  //   if (this.formGrupPermissions.invalid) {
  //     return;
  //   }
  //   this.isLoading = true;
  //   const permissions = (
  //     this.formGrupPermissions?.value?.permissions as Permissions[]
  //   ).reduce((acc: Permissions[], permiso) => {
  //     if (!acc.some((p) => p.permission_name === permiso.permission_name)) {
  //       acc.push(permiso); // Si no existe, lo agrega (mantiene el primero)
  //     }
  //     return acc;
  //   }, []);
  //   const permisosFinales = permissions.map(({ module_id, ...per }) => ({
  //     ...per,
  //     modules: module_id
  //       ? module_id.map((idModulo) => ({
  //           module_id: idModulo,
  //         }))
  //       : [],
  //   }));
  //   if (this.formPermission.length === 0) this.save(permisosFinales);
  //   else this.update(permisosFinales);
  // }
  onSubmit() {
    this.submitted = true;
    if (this.formGrupPermissions.invalid) {
      return;
    }
    const permisos = this.formGrupPermissions?.value?.permissions as Permissions[];
    this.isLoading = true;
    if (!this.formPermission) {
      return this.save(permisos);
    }
    return this.update(permisos[0]);
  }
  save(permisos: Permissions[]) {
    this.permissionService.register(permisos).subscribe({
      next: (res: ResponseMessage) => {
        this.totastService.success(res?.message);
        this.formGrupPermissions.reset();
        this.modalService.dismissAll();
        this.permissionService.saveStatus(true);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.log("err ", err);
        this.isLoading = false;
        this.totastService.error(err?.error["0"]?.message);
      },
      complete: () => {
        console.log("finis");
      },
    });
  }
  update(permisos: Permissions) {
    this.permissionService
      .update(this.formPermission.permission_id, permisos)
      .subscribe({
        next: (res: ResponseMessage) => {
          this.totastService.success(res?.message);
          this.formGrupPermissions.reset();
          this.modalService.dismissAll();
          this.permissionService.saveStatus(true);
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
    const permissions = this.formBuilder.group({
      permission_name: ["", Validators.required],
    });
    permissions.patchValue({
      permission_name: this.formPermission.permission_name,
    });
    this.permissions.push(permissions);
  }

  async getPermiso() {
    this.permissionService.get().subscribe({
      next: (res) => {
        this.permisos = res.content;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
