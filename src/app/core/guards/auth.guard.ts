import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    realRol = ""
    constructor(
        private router: Router, private tokenServ: TokenService,
        private toastService: ToastrService,
    ) { }

    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const expectedRol = route.data["expectedRol"];
        const role = this.tokenServ.getRol()
          if (!role) {
          this.toastService.error(
            "Error de Acceso",
            "Este usuario no cuenta con roles generados; verifique sus módulos"
          );

          this.router.navigate(['/account/login']);
          setTimeout(() => window.location.reload(), 2000);

          return false;
        }

        this.realRol = '';
        if (!this.tokenServ.isLoggedInUser() ) {
          this.router.navigate(['/account/login']);
          return false;
        }
        role.forEach((r: any) => this.realRol = r);
        if (expectedRol && expectedRol.indexOf(this.realRol) === -1) {
          this.router.navigate(['/account/not-autorized']); // envia no authorizado
          return false;
        }
      return true;
    }
}
