import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Category, ListPage, Marca, ResponseMessage, UriConstante } from '../..';
import { FilterList } from '@rdinvesiones/core/interface/general.interface';


@Injectable({
  providedIn: 'root',
})
export class BrandService {
   isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  get(filter: FilterList): Observable<ListPage> {
        const params = new HttpParams()
        .append('page', filter.page)
        .append('size', filter.size)
        .append('storeId', filter.storeId)
   return this.http.get<ListPage>(UriConstante.BRAND_RESOURCE + "/", { params: params });
  }
  fetchAllBrands(): Observable<ListPage> {
   return this.http.get<ListPage>(UriConstante.BRAND_RESOURCE + "/", { params: {} });
  }
  getById(id: number): Observable<Marca> {
    return this.http.get<Marca>(UriConstante.BRAND_RESOURCE + `/${id}`);
  }
  register(brand: FormData): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.BRAND_RESOURCE + "/", brand);
    // return this.http.post<ResponseMessage>(UriConstante.ECOMERCE_RESOURCE + "/baner", formData);
  }
  update(id: number, formData: FormData): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(
      `${UriConstante.BRAND_RESOURCE}/${id}`,
      formData
    );
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  updateStatus(id: number, status: string): Observable<ResponseMessage> {
    const body = { status }; // Cuerpo de la solicitud
    return this.http.patch<ResponseMessage>( `${UriConstante.BRAND_RESOURCE}/change-status/${id}`, body);
  }

}
