import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Category, ListPage, ResponseMessage, UriConstante } from '../..';


@Injectable({
  providedIn: 'root',
})
export class UbigeoService {
   isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(UriConstante.COMPANY_RESOURCE + `/${id}`);
  }
  register(form: FormData): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.COMPANY_RESOURCE + "/", form);
  }
  update(id: number, category: Category): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(
      `${UriConstante.COMPANY_RESOURCE}/${id}`,
      category
    );
  }
  delete(id: number) {
    return this.http.delete<ResponseMessage>(UriConstante.COMPANY_RESOURCE + `/${id}`);
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  getDepartament(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.DEPARTAMENT_RESOURCE);
  }
  getProvincia(id: number): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.PROVINCIA_RESOURCE + `/${id}`);
  }
  getDistrict(id: number): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.DISTRITO_RESOURCE + `/${id}`);
  }
}
