import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Category, ListPage, ResponseMessage, Sede, UriConstante } from "../..";
import { FilterList } from "@rdinvesiones/core/interface/general.interface";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  getById(id: number): Observable<Category> {
    return this.http.get<Category>(UriConstante.ORDER_RESOURCE + `/${id}`);
  }
  register(form: FormData): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      UriConstante.ORDER_RESOURCE + "/",
      form,
    );
  }
  update(id: number, category: Category): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(
      `${UriConstante.ORDER_RESOURCE}/${id}`,
      category,
    );
  }
  delete(id: number) {
    return this.http.delete<ResponseMessage>(
      UriConstante.ORDER_RESOURCE + `/eliminar/${id}`,
    );
  }
  updateOrderStatus(orderId: number, storeId: number, clientId:number, status: string) {
    const body = {
      storeId,
      status,
      clientId
    };

    return this.http.patch<ResponseMessage>(
      `${UriConstante.ORDER_RESOURCE}/${orderId}/status`,
      body,
    );
  }

  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  get(filter: FilterList): Observable<ListPage> {
    const params = new HttpParams()
      .append("page", filter.page)
      .append("size", filter.size);
    return this.http.get<ListPage>(UriConstante.ORDER_RESOURCE, { params });
  }
  getOrderDetails(orderId:number, clientId:number, storeId:number): Observable<any> {
    const params = new HttpParams()
      .append("clientId", clientId)
      .append("storeId", storeId);
    return this.http.get<any>(UriConstante.ORDER_RESOURCE + `/ecomerce/resumen/${orderId}`, { params });
  }
  registerSede(form: Sede): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      UriConstante.ORDER_RESOURCE + "/register-sede",
      form,
    );
  }
  getSede(): Observable<ListPage> {
    return this.http.get<ListPage>(
      UriConstante.ORDER_RESOURCE + "/obtener-sede",
    );
  }
}
