import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Category, ListPage, Producto, ResponseMessage, UriConstante } from '../..';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {
   isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(UriConstante.CATEGORY_RESOURCE + `/${id}`);
  }
  register(category: Category): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(UriConstante.CATEGORY_RESOURCE + "/", category);
  }
  update(id: number, category: Category): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(
      `${UriConstante.CATEGORY_RESOURCE}/${id}`,
      category
    );
  }
  delete(id: number) {
    return this.http.delete<ResponseMessage>(UriConstante.CATEGORY_RESOURCE + `/${id}`);
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
    return this.http.post<ResponseMessage>(UriConstante.CATEGORY_RESOURCE + "/destacar-category", formData);
  }
}
