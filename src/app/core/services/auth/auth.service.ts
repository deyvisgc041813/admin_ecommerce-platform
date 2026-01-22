import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { TokenService } from '../token.service';
import { UriConstante } from '../../util/UriConstante';
import { ResponseMessage } from '@rdinvesiones/core/interface/message';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {
    constructor(private htpp: HttpClient, private tokenServ: TokenService) {
    }
    login(correo: string, password: string): Observable<ResponseMessage> {
      const typeLogin = "0" // Login admin
      return this.htpp.
      post<ResponseMessage>(UriConstante.AUTHENTICATION_RESOURCE + "/login", {correo, password, typeLogin})
      .pipe(tap(res => {
        this.tokenServ.saveToken(res.token)
      }));
    }
    logout(): void {
      this.tokenServ.removeToken()
      this.tokenServ.removeTokenApi()
    }
    registerAndLogin(user: any): Observable<any> {
      return this.htpp
      .post<any>('', user)
      .pipe(
        switchMap(() => this.login(user.us_email, user.us_password)),
        catchError((err: any) => of(err)),
      );
    }
}

