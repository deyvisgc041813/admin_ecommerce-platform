import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fechaIso' })
export class FechaIsoPipe implements PipeTransform {
  transform(value: string): string {
    return new Date(value).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
