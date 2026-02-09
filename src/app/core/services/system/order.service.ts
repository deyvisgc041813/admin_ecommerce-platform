import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Category, ListPage, ResponseMessage, Sede, UriConstante } from '../..';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
   isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(UriConstante.ORDER_RESOURCE + `/${id}`);
  }
  register(form: FormData): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.ORDER_RESOURCE + "/", form);
  }
  update(id: number, category: Category): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(
      `${UriConstante.ORDER_RESOURCE}/${id}`,
      category
    );
  }
  delete(id: number) {
    return this.http.delete<ResponseMessage>(UriConstante.ORDER_RESOURCE + `/eliminar/${id}`);
  }
  atender(id: number) {
    return this.http.get<ResponseMessage>(UriConstante.ORDER_RESOURCE + `/atender/${id}`);
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  get(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.ORDER_RESOURCE);
  }
  registerSede(form: Sede): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.ORDER_RESOURCE + "/register-sede", form);
  }
  getSede(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.ORDER_RESOURCE + "/obtener-sede");
  }
}
