import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { Filter } from 'ng2-smart-table';
import { UriConstante } from '../../util/UriConstante';
import { Producto, ResponseMessage } from '../..';
import { FilterList } from '@rdinvesiones/core/interface/general.interface';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '@rdinvesiones/core/interface/api.response';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) { }
  getAll(filter: FilterList): Observable<any> {
    const params = new HttpParams()
      .append('page', filter.page)
      .append('size', filter.size)
      .append('storeId', filter.storeId)
    return this.http.get(UriConstante.PRODUCT_RESOURCE + "/show-product", { params: params });
  }
  getNotPagineted(): Observable<any> {
    return this.http.get(UriConstante.PRODUCT_RESOURCE + "/not-paginated", { params: {} });
  }
  getAccesorio(companyId: number): Observable<Producto[]> {
    return this.http.get<ApiResponse<Producto[]>>(`${UriConstante.PRODUCT_RESOURCE}/accesorio-compania/${companyId}`)
     .pipe( map(response => response.data));;
  }
  getById(productId: number, storeId: number): Observable<Producto> {
    return this.http.get<ApiResponse<Producto>>(`${UriConstante.PRODUCT_RESOURCE}/${productId}/stores/${storeId}`)
      .pipe( map(response => response.data));
  }
  register(product: Producto, imagenPrincipal: any, details: File[]): Observable<ResponseMessage> {
    const formData = new FormData()
    formData.append("product", JSON.stringify(product))
    details.forEach((file, index) => {
      formData.append("fileDetails", file);
    });
    formData.append("file", imagenPrincipal)
    return this.http.post<ResponseMessage>(UriConstante.PRODUCT_RESOURCE + "/", formData);
  }
  update(id: number, product: Producto, imagenPrincipal: any, details: File[], deleteStoretemporal: any): Observable<ResponseMessage> {
    const formData = new FormData()
    formData.append("product", JSON.stringify(product))
    formData.append("deleteStoretemporal", JSON.stringify(deleteStoretemporal))

    details.forEach((file, index) => {
      formData.append("fileDetails", file);
    });
    formData.append("file", imagenPrincipal)
    return this.http.put<ResponseMessage>(
      `${UriConstante.PRODUCT_RESOURCE}/${id}`,
      formData
    );
  }
  delete(id: number) {
    return this.http.delete<ResponseMessage>(UriConstante.PRODUCT_RESOURCE + `/${id}`);
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  getCategory(): Observable<any> {
    return this.http.get<any>(UriConstante.CATEGORY_RESOURCE);
  }
  getSubCategory(categoryId: number): Observable<any> {
    return this.http.get<any>(UriConstante.SUBCATEGORY_RESOURCE + `/category/${categoryId}`);
  }

}
