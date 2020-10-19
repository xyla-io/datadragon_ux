import { Pipe, PipeTransform } from '@angular/core';

/*
 *
*/
@Pipe({name: 'millisecondsPipe'})
export class MillisecondsPipe implements PipeTransform {
  transform(milliseconds: number, units?: string): string {
    switch (units) {
      case 'hours': return `${milliseconds / 1000 / 60 / 60} hours`
      case 'days': return `${milliseconds / 1000 / 60 / 60 / 24} days`;
      default: return (milliseconds >= 24 * 60 * 60 * 1000) ? `${milliseconds / 1000 / 60 / 60 / 24} days` : `${milliseconds / 1000 / 60 / 60} hours`;
    }
  }
}
