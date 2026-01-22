import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './layouts/layout.component';
import { Page404Component } from './extrapages/page404/page404.component';
const routes: Routes = [
  { path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule) },
  // tslint:disable-next-line: max-line-length
  { path: '', canActivate: [AuthGuard], component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},
  { path: 'extraPages', canActivate: [AuthGuard], loadChildren: () => import('./extrapages/extrapages.module').then(m => m.ExtrapagesModule)},
  { path: '**', component: Page404Component },
  { path: '', redirectTo: 'pages/dashboard', pathMatch: 'full' },
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
