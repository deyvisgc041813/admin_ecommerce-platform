import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AdvancedService } from 'src/app/pages/tables/advancedtable/advanced.service';
import { DecimalPipe } from '@angular/common';
import { MenuService } from '@rdinvesiones/core/services/system/menu.service';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'ng-apexcharts';
interface Menu {
  general: {},
  menuPrincipal: [],
  menuSecundario:[]
}
@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrls: ['./list-menu.component.scss'],
  providers: [AdvancedService, DecimalPipe]
})

export class ListMenuComponent implements OnInit {
  @Output() update: EventEmitter<Object> = new EventEmitter<Object>();
  public isCollapsed = true;
  category_alias: string = ""
  breadCrumbItems: Array<{}>;

  revenueBarChart: ChartType;
  menu: Menu
  statData;
  totalElements: number = 0;
  pageSize: number = 10
  pageNumber: number = 1;
  constructor(private menuService: MenuService,
    private route: ActivatedRoute,
    public service: AdvancedService
  ) {
    this.category_alias = this.route.snapshot.paramMap.get('id');
  }
  ngOnInit(): void {
    this.listar();
    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Profile', active: true }];
  }
  onPageChange(page: number): void {
    this.pageNumber = page;
  }
  listar() {
  }
  edit(id: any) {
  }
  
  eliminar(id: number, tipoMenu: string) {
  }
}
