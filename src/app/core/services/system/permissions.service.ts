import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ListPage, Permissions, ResponseMessage, UriConstante } from '../..';
@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
   isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  get(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.PERMISSIONS_RESOURCE);
  }
  getAsync() {
    return this.http.get<ListPage>(UriConstante.PERMISSIONS_RESOURCE).toPromise();
  }
  getById(id: number): Observable<Permissions> {
    return this.http.get<Permissions>(UriConstante.PERMISSIONS_RESOURCE + `/${id}`);
  }
  register(permiso: Permissions[]): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.PERMISSIONS_RESOURCE + "/", permiso);
  }
  update(id: number, permiso: Permissions): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(
      `${UriConstante.PERMISSIONS_RESOURCE}/${id}`,
      permiso
    );
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  updateStatus(id: number, status: string): Observable<ResponseMessage> {
    const body = { status };
    return this.http.patch<ResponseMessage>( `${UriConstante.PERMISSIONS_RESOURCE}/status/${id}`, body);
  }
}
