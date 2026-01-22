import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberOnlyDirective } from './directive/number-only.directive';
import { NumberDecimalsDirective } from './directive/number-decimals.directive';
import { NumberOnly20DijitosDirective } from './directive/number-only-20-digitos.directive';

@NgModule({
  declarations: [NumberDecimalsDirective, NumberOnlyDirective, NumberOnly20DijitosDirective],
  imports: [
    CommonModule
  ],
  exports: [
    NumberDecimalsDirective, NumberOnlyDirective, NumberOnly20DijitosDirective
  ]
})
export class CoreModule { }
