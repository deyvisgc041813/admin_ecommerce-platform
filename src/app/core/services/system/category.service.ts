import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Category, ListPage, ResponseMessage, UriConstante } from "../..";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(UriConstante.CATEGORY_RESOURCE + `/${id}`);
  }
  save(categoryId: number, formData: FormData): Observable<ResponseMessage> {
    const isUpdate = categoryId !== 0;
    const url = isUpdate
      ? `${UriConstante.CATEGORY_RESOURCE}/${categoryId}`
      : UriConstante.CATEGORY_RESOURCE;
    return isUpdate
      ? this.http.put<ResponseMessage>(url, formData)
      : this.http.post<ResponseMessage>(url, formData);
  }
  delete(id: number, publicId: string) {
    return this.http.delete<ResponseMessage>(
      `${UriConstante.CATEGORY_RESOURCE}/${id}`,
      { params: { publicId } },
    );
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  get(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.CATEGORY_RESOURCE);
  }
  getMenuHome(): Observable<ListPage> {
    return this.http.get<ListPage>(UriConstante.MENU_RESOURCE + "/menu-home");
  }
  addDestacar(formData: FormData): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      UriConstante.CATEGORY_RESOURCE + "/destacar-category",
      formData,
    );
  }
}
