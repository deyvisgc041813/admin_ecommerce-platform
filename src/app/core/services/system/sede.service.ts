import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ListPage, ResponseMessage, Sede, UriConstante } from '../..';


@Injectable({
  providedIn: 'root',
})
export class SedeService {
  isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  get(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.SEDE_RESOURCE + "/");
  }
  getById(id: number): Observable<Sede> {
    return this.http.get<Sede>(UriConstante.SEDE_RESOURCE + `/${id}`);
  }
  register(form: Sede): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.SEDE_RESOURCE, form);
  }
  update(storeId:number, form: Sede): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(`${UriConstante.SEDE_RESOURCE}/${storeId}` , form);
  }
  getByIDcompanySede(id: number): Observable<any>  {
    return this.http.get<any>(UriConstante.SEDE_RESOURCE + `/company-sede/${id}`);
  }
  updateStatus(id: number, status: string): Observable<ResponseMessage> {
    const body = { status };
    return this.http.patch<ResponseMessage>( `${UriConstante.SEDE_RESOURCE}/status/${id}`, body);
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
}
