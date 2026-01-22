import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Company } from '@rdinvesiones/core/interface/company.interface';
import { ToastrService } from 'ngx-toastr';
import { Category, CompanyService, DataDefault, ResponseMessage } from 'src/app/core';

@Component({
  selector: 'app-form-company',
  templateUrl: './form-company.component.html',
  styleUrls: ['./form-company.component.scss']
})
export class FormCompanyComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() formCompany: Company = null;
  archivo
  preview
  title: string = 'Crear Categoria';
  formGrup: FormGroup = new FormGroup({});
  formGrupBank: FormGroup = new FormGroup({});
  submitted: boolean = false
  isLoading : boolean = false
  categoria: Category
  tipoSubCategoria: any = []
  isChangeImage: boolean = false
  banks: any = []
  moneda: any = []
  constructor(
    private formBuilder: FormBuilder,
    private totastService: ToastrService,
    config: NgbModalConfig,
    private companyService: CompanyService,
    private modalService: NgbModal, // Inyecta NgbModal directamente aquí
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.banks = DataDefault.BANK
    this.moneda = DataDefault.MONEDA
  }
  ngOnInit(): void {
    this.formGrup = this.formBuilder.group({
      ruc: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      razon_social: [''],
      nombre: ['', Validators.required],
      telefono: ['', [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      facebook: [""],
      tictock: [""],
      instagram:[""],
      twitter:[""]
    });
    this.formGrupBank = this.formBuilder.group({
      bank: ["BBVA", Validators.required],
      num_cuenta: ["", Validators.required],
      cci: ["", [Validators.required, Validators.minLength(20), Validators.maxLength(20)]],
      moneda: ["Soles", Validators.required],
    });
    if (this.formCompany) {
      this.setIdit()
    }
    this.tipoSubCategoria = [
      {
        val: "1",
        descripcion: "Sub Categoria Prinicipal Home"
      },
      {
        val: "2",
        descripcion: "Sub Categoria Por Seccion del sistema"
      }
    ]
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
    if (this.formGrupBank.invalid) {
      return;
    }
    if (!this.archivo) {
      this.totastService.warning("Logo es requerido");
      return
    }
    const formData = new FormData()
    formData.append("ruc", this.formGrup.get("ruc")?.value)
    formData.append("razon_social", this.formGrup.get("razon_social")?.value)
    formData.append("nombre", this.formGrup.get("nombre")?.value)
    formData.append("telefono", this.formGrup.get("telefono")?.value)
    formData.append("email", this.formGrup.get("email")?.value)
    formData.append("facebook", this.formGrup.get("facebook")?.value)
    formData.append("tictock", this.formGrup.get("tictock")?.value)
    formData.append("instagram", this.formGrup.get("instagram")?.value)
    formData.append("twitter", this.formGrup.get("twitter")?.value)
    formData.append("bank", this.formGrupBank.get("bank")?.value)
    formData.append("num_cuenta", this.formGrupBank.get("num_cuenta")?.value)
    formData.append("cci", this.formGrupBank.get("cci")?.value)
    formData.append("moneda", this.formGrupBank.get("moneda")?.value)
    if(!this.formCompany) {
      formData.append("logo", this.archivo)
      return this.saveEmpresa(formData)
    }
    return this.updateEmpresa(formData)
  }
  get f() {
    return this.formGrup;
  }
  get bank() {
    return this.formGrupBank;
  }
  saveEmpresa(formData: FormData) {
    this.companyService.register(formData).subscribe({
      next: (res: ResponseMessage) => {
        this.totastService.success(res?.message);
        this.formGrup.reset();
        this.modalService.dismissAll();
        this.companyService.saveStatus(true)
      },
      error: (err: any) => {
        this.totastService.error(err?.message);
        console.log(err)
      },
      complete: () => {
        console.log("finis")
      },
    })
  }
  updateEmpresa(formData: FormData) {
    // formData.append("logo", this.formCompany.logo)
    formData.append("publicId", this.formCompany.publicId)
    if(this.isChangeImage) formData.append("logo", this.archivo)
    this.companyService.update(this.formCompany.company_id, formData)
    .subscribe({
      next: (res: ResponseMessage) => {
        this.totastService.success(res?.message);
        this.formGrup.reset();
        this.modalService.dismissAll();
        this.companyService.saveStatus(true)
      },
      error: (err: any) => {
        this.totastService.error(err?.message);
        console.log(err)
      },
      complete: () => {
        console.log("finis")
      },
    })
  }
  setIdit () {
    this.formGrup?.setValue({
      ruc: this.formCompany?.ruc,
      razon_social: this.formCompany.razon_social,
      nombre: this.formCompany.name,
      telefono: this.formCompany.phone,
      email: this.formCompany.email,
      facebook: this.formCompany.email,
      tictock: this.formCompany.tictock,
      instagram: this.formCompany.instagram,
      twitter:this.formCompany.twitter
    })
    this.formGrupBank?.setValue({
      bank: this.formCompany?.bank_name,
      num_cuenta: this.formCompany?.account_number,
      cci: this.formCompany?.interbank_account_number,
      moneda: this.formCompany.currency
    })
    this.preview = this.formCompany.logo
    this.archivo = this.formCompany.logo
  }
  onArchivoCargado(event: any) {
    const archivos = event.addedFiles;
    this.mostrarImagen(archivos[0]); // Llama a la función para mostrar la imagen

  }
  mostrarImagen(archivo: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.preview = e.target.result
      this.archivo = archivo
    };
    reader.readAsDataURL(archivo); // Lee el archivo como base64
    this.isChangeImage = true
  }

}
