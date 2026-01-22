import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { CompanyComponent } from './system/configuracion/company/company.component';
import { CompanySedesComponent } from './system/configuracion/company-sedes/company-sedes.component';
import { BannerComponent } from './system/configuracion/ecomerce/banner/banner.component';
import { ProductComponent } from './system/mantenimiento/product/product.component';
import { SubcategriesComponent } from './system/mantenimiento/subcategries/subcategries.component';
import { OperatorMenuComponent } from './system/configuracion/operator-menu/operator-menu.component';
import { MenuComponent } from './system/configuracion/menu/menu.component';
import { CategoryComponent } from './system/mantenimiento/category/category.component';
import { VentasComponent } from './system/ventas/ventas.component';
import { BrandComponent } from './system/mantenimiento/brand/brand.component';
import { AdminComponent } from './system/admin/admin.component';
import { ProfileComponent } from './system/admin/profile/profile.component';
import { RoleAndModulesComponent } from './system/admin/role-and-modules/role-and-modules.component';
import { RolPermisoModuloComponent } from './system/admin/rol-permiso-modulo/rol-permiso-modulo.component';
import { AuthGuard } from '../core';
import { ServiceConfigurationsComponent } from './system/configuracion/service-configurations/service-configurations.component';

const rol = [
  "RESPONSABLE"
]
const routes: Routes = [
  { path: '', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  { path: 'charts', loadChildren: () => import('./chart/chart.module').then(m => m.ChartModule) },
  { path: "profile", loadChildren:() => import('./profile/profile.module').then(m=> m.ProfileModule)},
  { path: 'product', component: ProductComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']}},
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']}},
  { path: 'subcategory', component: SubcategriesComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']} },
  { path: 'menu-home', component: MenuComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']} },
  { path: 'configuration-service', component: ServiceConfigurationsComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']} },
  { path: 'store-oinline-menu/:id', component: OperatorMenuComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']} },
  { path: 'company', component: CompanyComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']} },
  { path: 'tiendas', component: CompanySedesComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']} },
  { path: 'banner', component: BannerComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']} },
  { path: 'ventas', component: VentasComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']}},
  { path: 'brand', component: BrandComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']}},
  { path: 'admin-users', component: AdminComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']}},
  { path: 'admin-profile', component: ProfileComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']}},
  { path: 'admin-roles-and-modules', component: RoleAndModulesComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']}},
  { path: 'admin-role-modules-permissions', component: RolPermisoModuloComponent, canActivate: [AuthGuard], data: { expectedRol: ['ADMIN']}},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
