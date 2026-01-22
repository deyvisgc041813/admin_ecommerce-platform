import { Component, Input, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error-users',
  templateUrl: './error-users.component.html',
  styleUrls: ['./error-users.component.scss']
})
export class ErrorUsersComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() errors: any = [];
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    console.log(this.errors)
  }
  getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.BACKDROP_CLICK:
        this.modalService.dismissAll();
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }
}
