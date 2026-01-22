import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormUsuarioComponent } from 'src/app/component/admin/users/form-usuario/form-usuario.component';
import { TokenService } from 'src/app/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>;
  permisos : any[] = []
  constructor(private modalService: NgbModal,private tokenService: TokenService, private toastr: ToastrService) {
  }
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Usuarios' }, { label: 'Lista de usuarios', active: true }];
    // const rptaToken = this.tokenService.decodeToken()
    // var permisos = []
    // let busca = rptaToken?.modulos.filter(m => m.descripcion === 'Administracion')
    // if (busca.length > 0) {
    //   for (var i = 0; i < busca[0].permisos.length; i++) {
    //     permisos.push(busca[0].permisos[i].descripcion.toLowerCase())    
    //   }
    //   this.permisos = permisos
    // } else {
    //   this.toastr.error('no tiene permitido este modulo')
    // }
  }
  openModal() {
    const modalRef = this.modalService.open(FormUsuarioComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    modalRef.componentInstance.titulo = 'Registrar Usuario';
  }

}
