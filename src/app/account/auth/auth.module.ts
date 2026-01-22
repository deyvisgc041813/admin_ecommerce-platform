import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { UIModule } from '../../shared/ui/ui.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { AuthRoutingModule } from './auth-routing';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { SharedModule } from '@rdinvesiones/shared';
@NgModule({
  declarations: [LoginComponent, SignupComponent, PasswordresetComponent, NotAuthorizedComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbAlertModule,
    UIModule,
    AuthRoutingModule,
    SharedModule,
    CarouselModule
  ]
})
export class AuthModule { }
