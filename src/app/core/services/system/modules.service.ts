import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ListPage, ResponseMessage, UriConstante } from '../..';
import { Modules } from '@rdinvesiones/core/interface/modulo.interface';
@Injectable({
  providedIn: 'root',
})
export class ModulesService {
   isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  get(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.MODULES_RESOURCE);
  }
  getAsync() {
    return this.http.get<ListPage>(UriConstante.MODULES_RESOURCE).toPromise();
  }
  getModuloWithPermissionsAsync() {
    return this.http.get<ListPage>(UriConstante.MODULES_RESOURCE + "/modules-with-permissions").toPromise();
  }
  
  getById(id: number): Observable<Modules> {
    return this.http.get<Modules>(UriConstante.MODULES_RESOURCE + `/${id}`);
  }
  register(modules: Modules[]): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.MODULES_RESOURCE + "/", modules);
  }
  update(id: number, modules: Modules): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(
      `${UriConstante.MODULES_RESOURCE}/${id}`,
      modules
    );
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  updateStatus(id: number, status: string): Observable<ResponseMessage> {
    const body = { status };
    return this.http.patch<ResponseMessage>( `${UriConstante.MODULES_RESOURCE}/status/${id}`, body);
  }
}
