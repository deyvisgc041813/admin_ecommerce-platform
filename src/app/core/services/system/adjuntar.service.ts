import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../token.service';
import { UriConstante } from '../../util/UriConstante';
import { ResponseMessage } from '../..';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  upload(file: FormData): Observable<ResponseMessage> {
    const url = UriConstante.URL_UPLOAD_FILE_DEFAULT
    return this.http.post<ResponseMessage>(url, file)
  }
  update(file: FormData): Observable<ResponseMessage> {
    const url = UriConstante.URL_UPLOAD_FILE_DEFAULT
    return this.http.put<ResponseMessage>(url, file)
  }
  get(): Observable<any> {
    const url = UriConstante.URL_UPLOAD_FILE_DEFAULT
    return this.http.get<any>(url)
  }
  delete(id: string): Observable<ResponseMessage> {
    return this.http.delete<ResponseMessage>(UriConstante.URL_UPLOAD_FILE_DEFAULT +  "/delete/" + id)
  }
  generateCartaPresentacion(carta: any): Observable<ResponseMessage>  {
    return this.http.post<ResponseMessage>('' + "/generate-carta-aceptacion", carta)
  }
}