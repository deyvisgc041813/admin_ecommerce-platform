import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { Modules } from "@rdinvesiones/core/interface/modulo.interface";
import { ToastrService } from "ngx-toastr";
import { ModulesService, ResponseMessage } from "src/app/core";
@Component({
  selector: "app-form-modules",
  templateUrl: "./form-modules.component.html",
  styleUrls: ["./form-modules.component.scss"],
})
export class FormModulesComponent implements OnInit {
  @Input() titulo: string = "";
  @Input() formModulo: Modules = null;

  formGrupModulo: FormGroup = new FormGroup({});
  submitted: boolean = false;
  isLoading: boolean = false;
  tipoSubCategoria: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private totastService: ToastrService,
    config: NgbModalConfig,
    private modulesService: ModulesService,
    private modalService: NgbModal // Inyecta NgbModal directamente aquí
  ) {
    config.backdrop = "static";
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.formGrupModulo = this.formBuilder.group({
      modules: this.formBuilder.array([]),
    });
    if (this.formModulo) {
      this.setIdit();
    }
  }
  get modules() {
    return this.formGrupModulo.get("modules") as FormArray;
  }
  agregar() {
    const permissions = this.formBuilder.group({
      module_name: ["", Validators.required],
    });
    if (this.modules.length >= 10) {
      this.totastService.error(
        "Está permitido registrar un máximo de 10 modulos por acción."
      );
      return;
    }
    this.modules.push(permissions);
    // this.subCategoria.setValidators(null)
  }
  eliminar(index: number) {
    this.modules.removeAt(index);
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        this.formGrupModulo.reset();
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.formGrupModulo.invalid) {
      return;
    }
    const modulos = this.formGrupModulo?.value?.modules as Modules[];
    this.isLoading = true
    if (!this.formModulo) {
     return this.save(modulos)
    }
    return this.update(modulos[0])
  }
  save(modulos: Modules[]) {
    this.modulesService.register(modulos).subscribe({
      next: (res: ResponseMessage) => {
        this.totastService.success(res?.message);
        this.formGrupModulo.reset();
        this.modalService.dismissAll();
        this.modulesService.saveStatus(true);
        this.isLoading = false
      },
      error: (err: any) => {
        console.log("err ", err);
        this.totastService.error(err?.error["0"]?.message);
        this.isLoading = false
      },
      complete: () => {
        console.log("finis");
      },
    });
  }
  update(modulos: Modules) {
    this.modulesService.update(this.formModulo.module_id, modulos).subscribe({
      next: (res: ResponseMessage) => {
        this.totastService.success(res?.message);
        this.formGrupModulo.reset();
        this.modalService.dismissAll();
        this.modulesService.saveStatus(true)
        this.isLoading = false
      },
      error: (err: any) => {
        this.totastService.error(err?.message);
        console.log(err)
        this.modalService.dismissAll();
        this.isLoading = false
      },
      complete: () => {
        console.log("finis")
      },
    })
  }
  get f() {
    return this.formGrupModulo;
  }
  setIdit() {
    const modules = this.formBuilder.group({
      module_name: ["", Validators.required],
    });
    modules.patchValue({
      module_name: this.formModulo.module_name,
    });
    this.modules.push(modules);
  }
}
