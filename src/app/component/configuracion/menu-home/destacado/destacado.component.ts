import { Component, Input, OnInit } from "@angular/core";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CategoryService, ResponseMessage } from "src/app/core";

@Component({
  selector: "app-destacado",
  templateUrl: "./destacado.component.html",
  styleUrls: ["./destacado.component.scss"],
})
export class DestacadoComponent implements OnInit {
  @Input() categoryId: any;
  files: File[] = [];
  filePrincipal: any;
  isLoading = false;
  constructor(
    private modalService: NgbModal,
    private totastService: ToastrService,
    private categoriaService: CategoryService
  ) {}

  ngOnInit(): void {}
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }
  upload() {
    if (
      this.filePrincipal === null ||
      typeof this.filePrincipal === "undefined"
    ) {
      this.totastService.error("La imagen de la categoria es obligatorio");
      return;
    }
    const formData = new FormData();
    formData.append("categoyid", this.categoryId);
    formData.append("file", this.filePrincipal?.file);
    this.isLoading = true;
    this.categoriaService.addDestacar(formData).subscribe({
      next: (res: ResponseMessage) => {
        this.totastService.success(res?.message);
        this.modalService.dismissAll();
        this.categoriaService.saveStatus(true);
        this.isLoading = false;
      },
      error: (err: any) => {
        this.totastService.error(err?.message);
        this.isLoading = false;
      },
      complete: () => {
        console.log("finis");
        this.isLoading = false;
      },
    });
  }

  onSelect(event) {
    for (let file of event.addedFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const filePreview = {
          file: file,
          preview: e.target.result,
        };
        this.filePrincipal = filePreview;
      };
      reader.readAsDataURL(file);
    }
  }

  onRemove() {
    this.filePrincipal = null;
  }
}
