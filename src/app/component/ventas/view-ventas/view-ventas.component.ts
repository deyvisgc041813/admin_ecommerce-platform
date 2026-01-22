import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-ventas',
  templateUrl: './view-ventas.component.html',
  styleUrls: ['./view-ventas.component.scss']
})
export class ViewVentasComponent implements OnInit {

  @Input() titulo: string = '';
  @Input() descuento: number;
  @Input() total: number;
  @Input() lista: [];
  
  idCategory: number = 0
  title: string = 'Crear Categoria';
  formGrup: FormGroup = new FormGroup({});
  submitted: boolean = false
  isLoading : boolean = false
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
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
}
