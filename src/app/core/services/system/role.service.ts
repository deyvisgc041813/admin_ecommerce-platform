import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ListPage, ResponseMessage, UriConstante } from '../..';
import { Roles } from '@rdinvesiones/core/interface/role.interface';
@Injectable({
  providedIn: 'root',
})
export class RolesService {
   isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  get(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.ROLES_RESOURCE);
  }
  getAsync() {
    return this.http.get<ListPage>(UriConstante.ROLES_RESOURCE).toPromise();
  }
  getById(id: number): Observable<Roles> {
    return this.http.get<Roles>(UriConstante.ROLES_RESOURCE + `/${id}`);
  }
  register(roles: Roles[]): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.ROLES_RESOURCE + "/", roles);
  }
  update(id: number, roles: Roles): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(
      `${UriConstante.ROLES_RESOURCE}/${id}`,
      roles
    );
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  updateStatus(id: number, status: string): Observable<ResponseMessage> {
    const body = { status };
    return this.http.patch<ResponseMessage>( `${UriConstante.ROLES_RESOURCE}/status/${id}`, body);
  }
}
