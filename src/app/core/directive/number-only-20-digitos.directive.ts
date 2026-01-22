import { Directive, ElementRef, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appNumberOnly20dijitos]'
})
export class NumberOnly20DijitosDirective {
  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event) {
    const value = this._el.nativeElement.value
    this._el.nativeElement.value = value.substring(0, 20).replace(/[a-zA-Z/\W|_]/g,'')
    const valueNew = this._el.nativeElement.value
    if (value !== valueNew) {
      event.stopPropagation()
    }
  }

}
