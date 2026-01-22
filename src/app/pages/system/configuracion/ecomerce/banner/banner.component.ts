import { Component, inject, OnInit } from "@angular/core";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { FormBannerComponent } from "src/app/component/configuracion/banner/form-banner-conf/form-banner.component";
import { CategoryService } from "src/app/core/services/system/category.service";
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
 // bread crum data
 breadCrumbItems: Array<{}>;

 constructor(
   private categoriaService: CategoryService,
   config: NgbModalConfig,
   private modalService: NgbModal // Inyecta NgbModal directamente aquí
 ) {
   config.backdrop = "static";
   config.keyboard = false;
   this.breadCrumbItems = [
     { label: "Banner" },
     { label: "Configuración", active: true },
   ];
 }
 ngOnInit(): void {

 }
 open() {
   const modalRef = this.modalService.open(FormBannerComponent, {
     ariaLabelledBy: "modal-basic-title",
     size: "lg"
   });
   modalRef.componentInstance.titulo = "Crear Banner";
 }
 onSuccess(event: any) {
   this.categoriaService.saveStatus(event);
 }
 isUpdate(event: any) {
   const modalRef = this.modalService.open(FormBannerComponent, {
     ariaLabelledBy: "modal-basic-title",
     size: "lg"
   });
   modalRef.componentInstance.titulo = "Actualizar Banner";
   modalRef.componentInstance.bannerUpdate = event?.data;
 }

}
