import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | null | undefined): string {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return '';
    }
    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      return '';
    }
    const diff = Math.floor((Date.now() - date.getTime()) / 60000); // minutos
    if (diff < 1) return 'Hace un momento';
    if (diff === 1) return 'Hace 1 minuto';
    if (diff < 60) return `Hace ${diff} minutos`;
    const hours = Math.floor(diff / 60);
    return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
}
