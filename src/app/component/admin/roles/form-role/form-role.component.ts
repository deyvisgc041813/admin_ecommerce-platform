import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { Roles } from "@rdinvesiones/core/interface/role.interface";
import { ToastrService } from "ngx-toastr";
import { ResponseMessage, RolesService } from "src/app/core";
@Component({
  selector: "app-form-role",
  templateUrl: "./form-role.component.html",
  styleUrls: ["./form-role.component.scss"],
})
export class FormRoleComponent implements OnInit {
  @Input() titulo: string = "";
  @Input() formRoles: Roles = null;

  formGrupRoles: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isLoading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private totastService: ToastrService,
    config: NgbModalConfig,
    private roleService: RolesService,
    private modalService: NgbModal // Inyecta NgbModal directamente aquí
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.formGrupRoles = this.formBuilder.group({
      roles: this.formBuilder.array([]),
    });
    if (this.formRoles) {
      this.setIdit();
    }
  }
  get roles() {
    return this.formGrupRoles.get("roles") as FormArray;
  }
  agregar() {
    const roles = this.formBuilder.group({
      role_name: ["", Validators.required],
    });
    if (this.roles.length >= 10) {
      this.totastService.error(
        "Está permitido registrar un máximo de 10 roles por acción."
      );
      return;
    }
    this.roles.push(roles);
  }
  eliminar(index: number) {
    this.roles.removeAt(index);
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        this.formGrupRoles.reset();
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.formGrupRoles.invalid) {
      return;
    }
    const roles = this.formGrupRoles?.value?.roles as Roles[];
    this.isLoading = true;
    if (!this.formRoles) {
      return this.save(roles);
    }
    return this.update(roles[0]);
  }
  save(roles: Roles[]) {
    this.roleService.register(roles).subscribe({
      next: (res: ResponseMessage) => {

        this.totastService.success(res?.message);
        this.formGrupRoles.reset();
        this.modalService.dismissAll();
        this.roleService.saveStatus(true);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.log("err ", err);
        this.totastService.error(err?.error["0"]?.message);
        this.isLoading = false;
      },
      complete: () => {
        console.log("finis");
      },
    });
  }
  update(roles: Roles) {
    this.roleService.update(this.formRoles.role_id, roles).subscribe({
      next: (res: ResponseMessage) => {
        this.totastService.success(res?.message);
        this.formGrupRoles.reset();
        this.modalService.dismissAll();
        this.roleService.saveStatus(true);
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
    return this.formGrupRoles;
  }
  setIdit() {
    const roles = this.formBuilder.group({
      role_name: ["", Validators.required],
    });
    roles.patchValue({
      role_name: this.formRoles.role_name,
    });
    this.roles.push(roles);
  }
}
