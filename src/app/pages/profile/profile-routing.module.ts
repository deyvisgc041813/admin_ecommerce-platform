import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './component/index/index.component';

const routes: Routes = [
  {
    path: "index",
    component: IndexComponent
  },
  // {
  //   path: "admin",
  //   component: AdminComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
