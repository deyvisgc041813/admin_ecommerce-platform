import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SimplebarAngularModule } from 'simplebar-angular';
import { PopupComponent } from './components/popup/popup.component';
import { ArchwizardModule } from 'angular-archwizard';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PaginacionComponent } from './components/paginacion/paginacion.component';

@NgModule({
  declarations: [ PaginacionComponent, PopupComponent],
  imports: [
CommonModule,
    UIModule,
    WidgetModule,
    NgSelectModule,
    UIModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDropdownModule,
    FormsModule,
    Ng2SmartTableModule,
    NgbNavModule,
    ReactiveFormsModule,
    SimplebarAngularModule,
    ArchwizardModule,
    NgbTooltipModule,
    NgxDropzoneModule,
    DropzoneModule,
    CarouselModule,
    TranslateModule,
    NgApexchartsModule,
    WidgetModule
  ],
  exports: [
    PaginacionComponent,
    NgSelectModule,
    UIModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDropdownModule,
    FormsModule,
    Ng2SmartTableModule,
    NgbNavModule,
    ReactiveFormsModule,
    SimplebarAngularModule,
    PopupComponent,
    NgbTooltipModule,
    ArchwizardModule,
    NgxDropzoneModule,
    DropzoneModule,
    CarouselModule,
    TranslateModule,
    NgApexchartsModule,
    WidgetModule
  ]
})

export class SharedModule { }
