import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import { NgbAccordionModule, NgbAlertModule, NgbCollapseModule, NgbDatepickerModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreModule } from '../core/core.module';
import  {Ng2SearchPipeModule} from 'ng2-search-filter';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { TablesRoutingModule } from '../pages/tables/tables-routing.module';
import { UIModule } from '../shared/ui/ui.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { ListVentasComponent } from './ventas/list-ventas/list-ventas.component';
import { ViewVentasComponent } from './ventas/view-ventas/view-ventas.component';

import { FormProductComponent } from './mantenimiento/product/form/form.component';
import { ListProductComponent } from './mantenimiento/product/list/list.component';
import { ListCategoryComponent } from './mantenimiento/category/list/list.component';
import { FormCategoryComponent } from './mantenimiento/category/form/form.component';
import { FormSubCategoryComponent } from './mantenimiento/subcategory/form/form.component';
import { ListsubCategoryComponent } from './mantenimiento/subcategory/list/list.component';
import { ListMenuComponent } from './configuracion/operator-menu/list-menu/list-menu.component';
import { FormMenuComponent } from './configuracion/operator-menu/form-menu/form-menu.component';
import { MenuHomeComponent } from './configuracion/menu-home/menu-home.component';
import { NavegacionPrincipalComponent } from './configuracion/menu-home/navegacion-principal/navegacion-principal.component';
import { FormCompanyComponent } from './configuracion/company/form-company/form-company.component';
import { ListCompanyComponent } from './configuracion/company/list-company/list-company.component';
import { ListSedeComponent } from './configuracion/sede/list-sede/list-sede.component';
import { FormSedeComponent } from './configuracion/sede/form-sede/form-sede.component';
import { BannerConfComponent } from './configuracion/banner/banner-conf/banner.component';
import { FormBannerComponent } from './configuracion/banner/form-banner-conf/form-banner.component';
import { DestacadoComponent } from './configuracion/menu-home/destacado/destacado.component';
import { ListBrandComponent } from './mantenimiento/brand/list-brand/list-brand.component';
import { FormBrandComponent } from './mantenimiento/brand/form-brand/form-brand.component';
import { ListUsuarioComponent } from './admin/users/list-usuario/list-usuario.component';
import { FormUsuarioComponent } from './admin/users/form-usuario/form-usuario.component';
import { FormModulesComponent } from './admin/modules/form-modules/form-modules.component';
import { ListModulesComponent } from './admin/modules/list-modules/list-modules.component';
import { ListRoleComponent } from './admin/roles/list-role/list-role.component';
import { FormRoleComponent } from './admin/roles/form-role/form-role.component';
import { ErrorUsersComponent } from './modals/error-users/error-users.component';
import { ListRolPerModComponent } from './admin/rol-permisos-modulos/list-rol-per-mod/list-rol-per-mod.component';
import { FormRolPerModComponent } from './admin/rol-permisos-modulos/form-rol-per-mod/form-rol-per-mod.component';
import { ListPermissionComponent } from './admin/permiso/list-permission/list-permission.component';
import { FormPermissionComponent } from './admin/permiso/form-permission/form-permission.component';
import { DetallePermisoComponent } from './modals/detalle-permiso/detalle-permiso.component';
import { ListConfigurationComponent } from './configuracion/service-configurations/list-configuration/list-configuration.component';
import { FormConfigurationComponent } from './configuracion/service-configurations/form-configuration/form-configuration.component';

@NgModule({
  declarations: [
    PaginationComponent,
    FormProductComponent,
    ListProductComponent,
    ListCategoryComponent,
    FormCategoryComponent,
    FormSubCategoryComponent,
    ListsubCategoryComponent,
    ListMenuComponent,
    FormMenuComponent,
    MenuHomeComponent,
    NavegacionPrincipalComponent,
    FormCompanyComponent,
    ListCompanyComponent,
    ListSedeComponent,
    FormSedeComponent,
    BannerConfComponent,
    FormBannerComponent,
    ListVentasComponent,
    ViewVentasComponent,
    DestacadoComponent,
    ListBrandComponent,
    FormBrandComponent,
    ListUsuarioComponent,
    FormUsuarioComponent,
    FormModulesComponent,
    ListModulesComponent,
    ListRoleComponent,
    FormRoleComponent,
    ErrorUsersComponent,
    ListRolPerModComponent,
    FormRolPerModComponent,
    ListPermissionComponent,
    FormPermissionComponent,
    DetallePermisoComponent,
    ListConfigurationComponent,
    FormConfigurationComponent
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbTooltipModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbAccordionModule,
    Ng2SearchPipeModule,
    NgbPaginationModule,
    Ng2SmartTableModule,
    NgbTypeaheadModule,
    TablesRoutingModule,
    UIModule,
    NgxDropzoneModule,
    DropzoneModule,
    CoreModule
  ],

  exports: [
    PaginationComponent,
    FormProductComponent,
    ListProductComponent,
    ListCategoryComponent,
    FormCategoryComponent,
    FormSubCategoryComponent,
    ListsubCategoryComponent,
    Ng2SearchPipeModule,
    NgxDropzoneModule,
    DropzoneModule,
    ListMenuComponent,
    FormMenuComponent,
    MenuHomeComponent,
    NavegacionPrincipalComponent,
    FormCompanyComponent,
    ListCompanyComponent,
    ListConfigurationComponent,
    FormConfigurationComponent,
    ListSedeComponent,
    FormSedeComponent,
    FormBannerComponent,
    BannerConfComponent,
    ListVentasComponent,
    ViewVentasComponent,
    ListBrandComponent,
    ListUsuarioComponent,
    FormUsuarioComponent,
    FormModulesComponent,
    ListModulesComponent,
    ListRoleComponent,
    FormRoleComponent,
    ErrorUsersComponent,
    ListRolPerModComponent,
    FormRolPerModComponent,
    ListPermissionComponent,
    FormPermissionComponent,
    DetallePermisoComponent,
    UIModule
  ],
})
export class ComponentModule { }
