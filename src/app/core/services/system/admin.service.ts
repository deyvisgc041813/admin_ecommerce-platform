import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UriConstante } from '../../util/UriConstante';
import { ListPage } from '@rdinvesiones/core/interface/listPage';
import { ResponseMessage } from '@rdinvesiones/core/interface/message';
import { Users } from '@rdinvesiones/core/interface/users.interface';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) { }
  getUser() {
    // const params = new HttpParams()
    // .set('page', filtro.page)
    // .set('pageSize', filtro.pageSize);
    return this.http.get<ListPage>(UriConstante.USERS_RESOURCE).toPromise();
    // return this.http.get<ListPage>(UriConstante.USERS_RESOURCE);
  }
  async getPermisos(id: string) {
    return this.http.get<ListPage>(UriConstante.USERS_RESOURCE + "permisos/" + id).toPromise();
  }
  changeStatus(id: string, status: string): Observable<ResponseMessage> {
    const url = UriConstante.USERS_RESOURCE + "/change-status/" + id
    return this.http.patch<ResponseMessage>(url, { status });
  }
  changePasswordAdmin(id: number, password: string): Observable<ResponseMessage> {
    const url = UriConstante.USERS_RESOURCE + "/change-password/" + id
    return this.http.patch<ResponseMessage>(url, {password});
  }
  async getUserById(id: string): Promise<ListPage> {
    // Convertir el Observable a una Promesa usando 'toPromise'
    return this.http.get<ListPage>(UriConstante.USERS_RESOURCE + `/${id}`).toPromise();
  }
  register(users: Users): Observable<ResponseMessage> {
    const url = UriConstante.USERS_RESOURCE
    return this.http.post<ResponseMessage>(url, users);
  }
  update(id: string, users: Users): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(`${UriConstante.USERS_RESOURCE}/${id}`, users);
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
}
