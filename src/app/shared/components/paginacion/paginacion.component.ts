import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  templateUrl: './paginacion.component.html',
  styleUrls: ['./paginacion.component.scss']
})
export class PaginacionComponent implements OnInit {
  @Input("pageSizeTable") pageSizeTable: number
  @Input("page") page: number
  @Input("pageSize") pageSize: number
  @Output() pageOutput = new EventEmitter<number>();
  NumberPaginacion = []
  constructor() { }

  ngOnInit(): void {
    this.addPaginacion()
  }
  public get pagePie() {
    if(this.page === 1){
      return this.page;
    } else {
      return ((this.page - 1) * this.pageSize) + 1;
    }
  }
  public anterior(): void {
    if (this.page === 1) return
    else {
      if (this.page > 5) {
        for (let index = 0; index < this.NumberPaginacion.length; index++) {
          this.NumberPaginacion[index] -= 1
        }
      }
      this.page -= 1
      this.pageOutput.emit(this.page)
    }
  }

  public siguiente(page: number): void {
    if (this.ultimoPage === this.page && page === 0) return
    if (page > 0) {
      this.page = page
      this.pageOutput.emit(this.page)
    }
    else {
      this.page += 1
      if (this.page > 5) {
        for (let index = 0; index < this.NumberPaginacion.length; index++) {
          this.NumberPaginacion[index] += 1
        }
      }
      this.pageOutput.emit(this.page)
    }
  }
  public get ultimoPage() {
    return Math.ceil(this.pageSizeTable/this.pageSize)
  }
  addPaginacion() {
    if (this.pageSizeTable < 10) {
      this.NumberPaginacion = [1]
    } else if (this.pageSizeTable <= 20) {
      this.NumberPaginacion = [1, 2]
    } else if (this.pageSizeTable <= 30) {
      this.NumberPaginacion = [1, 2, 3]
    } else if (this.pageSizeTable <= 40) {
      this.NumberPaginacion = [1, 2, 3, 4]
    } else if (this.pageSizeTable >= 50 ) {
      this.NumberPaginacion = [1, 2, 3, 4, 5]
    }
  }
}
