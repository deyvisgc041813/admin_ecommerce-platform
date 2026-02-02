import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ListPage, ResponseMessage, UriConstante } from "../..";
import { FilterList } from "@rdinvesiones/core/interface/general.interface";
import { Configurations } from "@rdinvesiones/core/interface/configurations.interface";

@Injectable({
  providedIn: "root",
})
export class ConfigurationsService {
  isRegisterOrUpdate$: Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient) {}
  get(filter: FilterList): Observable<ListPage> {
    const params = new HttpParams()
      .append("page", filter.page)
      .append("size", filter.size)
      .append("entity", filter?.data?.entity)
      .append("companyId", filter?.data?.companyId);
    return this.http.get<ListPage>(UriConstante.CONFIGURATIONS_RESOURCE + "/", {
      params: params,
    });
  }
  getById(id: number): Observable<Configurations> {
    return this.http.get<Configurations>(
      UriConstante.CONFIGURATIONS_RESOURCE + `/${id}`,
    );
  }
  register(data: Configurations): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      UriConstante.CONFIGURATIONS_RESOURCE + "/",
      data,
    );
  }
  update(id: number, data: Configurations): Observable<ResponseMessage> {
    return this.http.put<ResponseMessage>(
      `${UriConstante.CONFIGURATIONS_RESOURCE}/${id}`,
      data,
    );
  }
  saveStatus(status: boolean) {
    this.isRegisterOrUpdate$.next(status);
  }
  updateStatus(id: number, status: string): Observable<ResponseMessage> {
    const body = { status };
    return this.http.patch<ResponseMessage>(
      `${UriConstante.CONFIGURATIONS_RESOURCE}/change-status/${id}`,
      body,
    );
  }
  updateConnectWhatsapp(
    companyId: number,
    connect: string,
    session: string,
  ): Observable<ResponseMessage> {
    const body = {
      connect,
      session,
    };

    return this.http.patch<ResponseMessage>(
      `${UriConstante.CONFIGURATIONS_RESOURCE}/${companyId}/whatsapp-connection`,
      body,
    );
  }
    updateSessionWhatsapp(
    companyId: number,
    session: string,
  ): Observable<ResponseMessage> {
    const body = { session };
    return this.http.patch<ResponseMessage>(
      `${UriConstante.CONFIGURATIONS_RESOURCE}/${companyId}/whatsapp-session`,
      body,
    );
  }

  deleteConfig(id: number): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(
      `${UriConstante.CONFIGURATIONS_RESOURCE}/${id}`,
    );
  }
}
