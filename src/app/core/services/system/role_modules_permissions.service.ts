import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ListPage, ProfileModulesPermissions, ResponseMessage, UriConstante } from '../..';
@Injectable({
  providedIn: 'root',
})
export class RoleModulesPermissionsService {
   isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  get(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.ROLES_PERMISSIONS_MODULES_RESOURCE);
  }
  getById(idRole:number, idModule:number): Observable<any> {
    const params = new HttpParams()
    .append('id_role', idRole) 
    .append('id_module', idModule) 
    return this.http.get<any>(UriConstante.ROLES_PERMISSIONS_MODULES_RESOURCE + `/ids`, {params});
  }
  register(acceso: ProfileModulesPermissions[]): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.ROLES_PERMISSIONS_MODULES_RESOURCE + "/", acceso);
  }
  update(idRole:number, idModule:number, acceso: ProfileModulesPermissions): Observable<ResponseMessage> {
     const params = new HttpParams()
     .append('id_role', idRole) 
     .append('id_module', idModule) 
      return this.http.put<ResponseMessage>(`${UriConstante.ROLES_PERMISSIONS_MODULES_RESOURCE}/update`, acceso, {params}, 
    );
  }
  delete(idRole:number, idModule:number): Observable<ResponseMessage> {
    const params = new HttpParams()
    .append('id_role', idRole) 
    .append('id_module', idModule) 
    return this.http.delete<ResponseMessage>( `${UriConstante.ROLES_PERMISSIONS_MODULES_RESOURCE}/`, {params});
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }

}
