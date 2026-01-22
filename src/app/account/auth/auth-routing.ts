import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';

import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'reset-password',
        component: PasswordresetComponent
    },
    {
        path: 'not-autorized',
        component: NotAuthorizedComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
