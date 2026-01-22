import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ListPage, Permissions, ResponseMessage, RoleModulos, UriConstante } from '../..';
@Injectable({
  providedIn: 'root',
})
export class PermissionsModulesService {
   isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  get(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.ROLES_MODULES_RESOURCE);
  }
  getByIdModulo(idModulo:number): Observable<RoleModulos[]> {
    const params = new HttpParams()
    .append('idModulo', idModulo) 
    return this.http.get<RoleModulos[]>(UriConstante.ROLES_MODULES_RESOURCE + `/idModule`, {params});
  }
  // getByIdPermisos(id: number): Observable<Sede> {
  //     return this.http.get<Sede>(UriConstante.SEDE_RESOURCE + `/${id}`);
  // }
  register(rolesModules: RoleModulos[]): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.ROLES_MODULES_RESOURCE + "/", rolesModules);
  }
  update(idModulo:number, permiso: RoleModulos): Observable<ResponseMessage> {
     const params = new HttpParams()
      .append('idModulo', idModulo) 
      return this.http.put<ResponseMessage>(`${UriConstante.ROLES_MODULES_RESOURCE}/update`, permiso, {params}, 
    );
  }
  
  updateStatus(id: number, status: string): Observable<ResponseMessage> {
    const body = { status };
    return this.http.patch<ResponseMessage>( `${UriConstante.ROLES_MODULES_RESOURCE}/status/${id}`, body);
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }

}
