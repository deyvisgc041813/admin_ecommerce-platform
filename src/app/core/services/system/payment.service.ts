import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Category, ListPage, ResponseMessage, Sede, UriConstante } from "../..";
import { FilterList } from "@rdinvesiones/core/interface/general.interface";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  constructor(private http: HttpClient) {}
  getById(id: number): Observable<any> {
    return this.http.get<Category>(UriConstante.PAYMENT_RESOURCE + `/${id}`);
  }
  getReceipt(id: number): Observable<any> {
    return this.http.get<any>(UriConstante.PAYMENT_RESOURCE + `/payment/receipt/${id}`);
  }
  get(filter: FilterList): Observable<ListPage> {
    const params = new HttpParams()
      .append("page", filter.page)
      .append("size", filter.size);
    return this.http.get<ListPage>(UriConstante.PAYMENT_RESOURCE, { params });
  }
}
