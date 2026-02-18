import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ListPage, ResponseMessage, UriConstante } from "../..";
import { ParentMenu } from "@rdinvesiones/core/interface/parent_menu.interface";
import { GestionMenu } from "@rdinvesiones/core/interface/gestion-menu.interface";

@Injectable({
  providedIn: "root",
})
export class ParentMenuService {
  isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  getById(id: number): Observable<ParentMenu> {
    return this.http.get<ParentMenu>(
      UriConstante.PARENT_MENU_RESOURCE + `/${id}`,
    );
  }
  save(formData: FormData, parentId: number): Observable<ResponseMessage> {
    const isUpdate = parentId !== 0;
    const url = isUpdate
      ? `${UriConstante.PARENT_MENU_RESOURCE}/${parentId}`
      : UriConstante.PARENT_MENU_RESOURCE;
    return isUpdate
      ? this.http.put<ResponseMessage>(url, formData)
      : this.http.post<ResponseMessage>(url, formData);
  }
  assignCategoriesToMainMenu(body: GestionMenu): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${UriConstante.PARENT_MENU_RESOURCE}/asign-category-main-menu`, body);
  }
  changeStatus(id: string, status: string): Observable<ResponseMessage> {
    const url = UriConstante.PARENT_MENU_RESOURCE + `/${id}`;
    return this.http.patch<ResponseMessage>(url, { status });
  }
  delete(id: number) {
    return this.http.delete<ResponseMessage>(
      UriConstante.PARENT_MENU_RESOURCE + `/${id}`,
    );
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  fetchData(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.PARENT_MENU_RESOURCE);
  }
  fetchMainMenuConfig(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.PARENT_MENU_RESOURCE + "/config-menu");
  }
  
}
