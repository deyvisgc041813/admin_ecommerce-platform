import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ListPage, ResponseMessage, UriConstante } from '../..';
import { Company } from '@rdinvesiones/core/interface/company.interface';


@Injectable({
  providedIn: 'root',
})
export class CompanyService {
   isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  get(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.COMPANY_RESOURCE + "/");
  }
 async getAsync() {
    return this.http.get<ListPage>(UriConstante.COMPANY_RESOURCE + "/").toPromise();
  }
  constructor(private http: HttpClient) {}
  getById(id: number): Observable<Company> {
    return this.http.get<Company>(UriConstante.COMPANY_RESOURCE + `/${id}`);
  }
  register(form: FormData): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.COMPANY_RESOURCE + "/", form);
  }
  update(id: number, form: FormData): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(`${UriConstante.COMPANY_RESOURCE}/${id}`, form);
  }
  updateStatus(id: number, status: string): Observable<ResponseMessage> {
    const body = { status };
    return this.http.patch<ResponseMessage>( `${UriConstante.COMPANY_RESOURCE}/status/${id}`, body);
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
}
