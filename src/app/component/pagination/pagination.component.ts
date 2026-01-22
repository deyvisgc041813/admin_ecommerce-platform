import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit{
  ngOnInit(): void {
  }
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  totalPages: number = 0;
  pages: number[] = [];

  //Se ejecuta automaticamente cada ves que hay cambios en el componente
  ngOnChanges() {
    //Math.ceil redondea el resultado hacia arriba al siguiente número entero
    this.totalPages = Math.ceil(this.totalItems / this.pageSize); // calculo el tamaño total de la pagina
    this.pages = Array(this.totalPages).fill(0).map((x, i) => i + 1); //Creo una Lista de Números de Página
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.pageChange.emit(page);
  }
}
