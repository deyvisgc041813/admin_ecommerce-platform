import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbNavModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule , NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import bootstrapPlugin from "@fullcalendar/bootstrap";
import { LightboxModule } from 'ngx-lightbox';

import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';

import { PagesRoutingModule } from './pages-routing.module';

import { DashboardsModule } from './dashboards/dashboards.module';
import { TablesModule } from './tables/tables.module';
import { ChartModule } from './chart/chart.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CompanyComponent } from './system/configuracion/company/company.component';
import { CompanySedesComponent } from './system/configuracion/company-sedes/company-sedes.component';
import { BannerComponent } from './system/configuracion/ecomerce/banner/banner.component';
import { VentasComponent } from './system/ventas/ventas.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CategoryComponent } from './system/mantenimiento/category/category.component';
import { ProductComponent } from './system/mantenimiento/product/product.component';
import { SubcategriesComponent } from './system/mantenimiento/subcategries/subcategries.component';
import { OperatorMenuComponent } from './system/configuracion/operator-menu/operator-menu.component';
import { MenuComponent } from './system/configuracion/menu/menu.component';
import { ComponentModule } from '../component/component.module';
import { BrandComponent } from './system/mantenimiento/brand/brand.component';
import { AdminComponent } from './system/admin/admin.component';
import { ProfileComponent } from './system/admin/profile/profile.component';
import { RoleAndModulesComponent } from './system/admin/role-and-modules/role-and-modules.component';
import { RolPermisoModuloComponent } from './system/admin/rol-permiso-modulo/rol-permiso-modulo.component';
import { ServiceConfigurationsComponent } from './system/configuracion/service-configurations/service-configurations.component';
import { WhatsappComponent } from './system/configuracion/whatsapp/whatsapp.component';
import { WebsocketService } from '@rdinvesiones/core/services/system/websocket.service';


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin
]);

@NgModule({
  declarations: [CategoryComponent, ProductComponent, SubcategriesComponent,
     OperatorMenuComponent, MenuComponent, CompanyComponent, CompanySedesComponent, 
     BannerComponent, VentasComponent, BrandComponent, AdminComponent, ProfileComponent, RoleAndModulesComponent, RolPermisoModuloComponent, 
     ServiceConfigurationsComponent, WhatsappComponent],
  imports: [
    ComponentModule,
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbModalModule,
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DashboardsModule,
    HttpClientModule,
    UIModule,
    TablesModule,
    ChartModule,
    WidgetModule,
    FullCalendarModule,
    NgbNavModule,
    NgbTooltipModule,
    NgbCollapseModule,
    SimplebarAngularModule,
    LightboxModule,

    NgSelectModule // borrar esto
  ]
})
export class PagesModule { }
