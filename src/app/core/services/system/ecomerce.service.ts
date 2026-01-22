import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UriConstante } from '../../util/UriConstante';
import { ResponseMessage } from '../..';

@Injectable({
  providedIn: 'root',
})
export class EcomerceService {
  isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) { }
  getBanner(): Observable<any> {
    return this.http.get<any>(UriConstante.ECOMERCE_RESOURCE + "/show-banner");
  }
  getBanerById(id: number): Observable<any> {
    return this.http.get<any>(UriConstante.ECOMERCE_RESOURCE + `/show-banner/${id}`);
  }
  saveBanner(formData: FormData): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.ECOMERCE_RESOURCE + "/baner", formData);
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  update(id: number, banner: FormData): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>( `${UriConstante.ECOMERCE_RESOURCE}/baner/${id}`, banner);
  }
  updateBanerStatus(id: number, status: string): Observable<ResponseMessage> {
    const body = { status }; // Cuerpo de la solicitud
    return this.http.patch<ResponseMessage>( `${UriConstante.ECOMERCE_RESOURCE}/baner-status/${id}`, body);
  }
}
