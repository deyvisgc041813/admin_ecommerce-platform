import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberDecimals]'
})
export class NumberDecimalsDirective {
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  constructor(private _el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this._el.nativeElement.value;
    const position = this._el.nativeElement.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
    // const value = this._el.nativeElement.value
    // var regexp = /^\d+(\.\d{1,2})?$/;
    // this._el.nativeElement.value = value.substring(0, 9).replace(/[a-zA-Z/\W|_]/g,'')
    // const valueNew = this._el.nativeElement.value
    // if (value !== valueNew && !regexp.test(value)) {
    //   event.stopPropagation();
    // }
  }

}
