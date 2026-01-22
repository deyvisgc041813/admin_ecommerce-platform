import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { UbigeoService } from '@rdinvesiones/core/services/system/ubigeo.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyService, ListPage, ResponseMessage, Sede, SedeService } from 'src/app/core';
@Component({
  selector: 'app-form-sede',
  templateUrl: './form-sede.component.html',
  styleUrls: ['./form-sede.component.scss']
})
export class FormSedeComponent implements OnInit {

  @Input() titulo: string = '';
  @Input() formSede: Sede = null;
  idCategory: number = 0
  title: string = 'Crear Categoria';
  formGrup: FormGroup = new FormGroup({});
  submitted: boolean = false
  isLoading : boolean = false
  sede: Sede
  company: any = []
  departament: any = []
  province: any = []
  district: any = []
  constructor(
    private formBuilder: FormBuilder,
    private totastService: ToastrService,
    config: NgbModalConfig,
    private modalService: NgbModal, // Inyecta NgbModal directamente aquí
    private sedeService: SedeService,
    private companyService: CompanyService,
    private ubigeoService: UbigeoService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit(): void {
    this.formGrup = this.formBuilder.group({
      company: ['', [Validators.required]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      departament: ['', [Validators.required]],
      province: ['', [Validators.required]],
      district: ['', [Validators.required]],
    });

    if (this.formSede) {
      this.setIdit()
    }
    this.getCompany()
    this.getDepartament()
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        this.formGrup.reset();
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
  onSubmit() {
    this.submitted = true;
    if (this.formGrup.invalid) {
      return;
    }
    this.sede = {
      company_id: this.formGrup.get("company")?.value,
      name: this.formGrup.get("name")?.value,
      address: this.formGrup.get("address")?.value,
      email: this.formGrup.get("email")?.value,
      phone: this.formGrup.get("phone")?.value,
      departament_id: this.formGrup.get("departament")?.value,
      province_id: this.formGrup.get("province")?.value,
      district_id: this.formGrup.get("district")?.value,
    }
    if(!this.formSede) {
      return this.save(this.sede)
    }
    return this.update(this.sede)
  }
  save(sede: Sede) {
    this.sedeService.register(sede).subscribe({
      next: (res: ResponseMessage) => {
        this.totastService.success(res?.message);
        this.formGrup.reset();
        this.modalService.dismissAll();
        this.sedeService.saveStatus(true)
      },
      error: (err: any) => {
        this.totastService.error(err?.message);
      },
      complete: () => {
        console.log("finis")
      },
    })
  }
  update(sede: Sede) {
    this.sedeService.update(this.formSede.store_id, sede).subscribe({
      next: (res: ResponseMessage) => {
        this.totastService.success(res?.message);
        this.formGrup.reset();
        this.modalService.dismissAll();
        this.sedeService.saveStatus(true)
      },
      error: (err: any) => {
        this.totastService.error(err?.message);
      },
      complete: () => {
        console.log("finis")
      },
    })
  }
  get f() {
    return this.formGrup;
  }
 async setIdit () {
    this.formGrup?.setValue({
      company: this.formSede?.company_id,
      name:  this.formSede?.name,
      address: this.formSede.address,
      phone: this.formSede.phone,
      email: this.formSede.email,
      departament: this.formSede.departament_id,
      province: this.formSede.province_id,
      district: this.formSede.district_id
    })
   await this.getProvincia({id: this.formSede.departament_id})
   await this.getDistrito({id: this.formSede.province_id})
  }
  getCompany() {
    this.companyService.get().subscribe({
      next: (res: ListPage) => {
        this.company = res.content
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
  getDepartament() {
    this.ubigeoService.getDepartament().subscribe({
      next: (res: any) => {
        this.departament = res
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
  async getProvincia(departament: any) {
    this.ubigeoService.getProvincia(departament.id).subscribe({
      next: (res: any) => {
        this.province = res
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
  getDistrito(province: any) {
    this.ubigeoService.getDistrict(province.id).subscribe({
      next: (res: any) => {
        this.district = res
      },
      error: (err: any) => {
        console.log(err)
      }
    })
  }
}
