import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Filter } from 'ng2-smart-table';
import { UriConstante } from '../../util/UriConstante';
import { ListPage, Producto, ResponseMessage } from '../..';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) { }
  getAll(
    page: number,
    size: number,
    filtros: Filter
  ): Observable<any> {
    // let fechaIni = '';
    // let fechaFin = '';
    // if (
    //   filtros?.fechaIni?.day !== 0 &&
    //   filtros?.fechaIni?.year !== 0 &&
    //   filtros?.fechaIni?.month !== 0
    // ) {
    //   const dayIni =
    //     filtros?.fechaIni?.day < 10
    //       ? `0${filtros?.fechaIni?.day}`
    //       : filtros?.fechaIni?.day;
    //   const dayFin =
    //     filtros?.fechaFin?.day < 10
    //       ? `0${filtros?.fechaFin?.day}`
    //       : filtros?.fechaFin?.day;
    //   fechaIni = `${filtros?.fechaIni?.year}-${filtros?.fechaIni?.month}-${dayIni}`;
    //   fechaFin = `${filtros?.fechaFin?.year}-${filtros?.fechaFin?.month}-${dayFin}`;
    // }
    // const params = new HttpParams()
    //   .append('page', page)
    //   .append('size', size)
    //   .append('fechaIni', fechaIni)
    //   .append('fechaFin', fechaFin)
    //   // .append('any', filtros?.any);
    return this.http.get(UriConstante.PRODUCT_RESOURCE, { params: {} });
  }
  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(UriConstante.PRODUCT_RESOURCE + `/${id}`);
  }
  register(formData: FormData): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.MENU_RESOURCE + "/", formData);
  }
  saveBanner(formData: FormData): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.MENU_RESOURCE + "/", formData);
  }
  update(id: number, product: Producto, imagenPrincipal: any, details: File[]): Observable<ResponseMessage> {
    const formData = new FormData()
    formData.append("product", JSON.stringify(product))
    details.forEach((file, index) => {
      formData.append("fileDetails", file);
    });
    formData.append("file", imagenPrincipal)
    return this.http.put<ResponseMessage>(
      `${UriConstante.PRODUCT_RESOURCE}/${id}`,
      formData
    );
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  getMenuCategory(): Observable<any> {
    return this.http.get<any>(UriConstante.MENU_RESOURCE + "/menu-category");
  }
  getSubCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(UriConstante.SUBCATEGORY_RESOURCE + `/category/${categoryId}`);
  }
  getSubMenu(categoryId: number): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.MENU_RESOURCE + "/sub-menus/"+ `${categoryId}`);
  }
  getMainMenu(): Observable<ListPage> {
    return this.http.get<ListPage>(`${UriConstante.MENU_RESOURCE}/main`);
  }
}
