import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import {
  Category,
  ListPage,
  ResponseMessage,
  SubCategory,
  UriConstante,
} from "../..";

@Injectable({
  providedIn: "root",
})
export class SubcategoryService {
  isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  getById(id: number): Observable<SubCategory> {
    return this.http.get<SubCategory>(
      UriConstante.SUBCATEGORY_RESOURCE + `/${id}`,
    );
  }
  getByCategoryId(id: number): Observable<ListPage> {
    return this.http.get<ListPage>(
      `${UriConstante.SUBCATEGORY_RESOURCE}/category/${id}`,
    );
  }
  register(category: SubCategory[]): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      UriConstante.SUBCATEGORY_RESOURCE + "/",
      category,
    );
  }
  update(id: number, subCate: SubCategory): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(
      `${UriConstante.SUBCATEGORY_RESOURCE}/${id}`,
      subCate,
    );
  }
  delete(id: number) {
    return this.http.delete<ResponseMessage>(
      UriConstante.SUBCATEGORY_RESOURCE + `/${id}`,
    );
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  getSubcategoriesWithCategories(): Observable<ListPage> {
    return this.http.get<ListPage>(
      UriConstante.SUBCATEGORY_RESOURCE + "/subcategories-categories",
    );
  }
}
