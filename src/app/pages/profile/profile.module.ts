import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { IndexComponent } from './component/index/index.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
