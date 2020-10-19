import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'adgroupPipe'
})
export class AdgroupPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value === null) {
      return 'All';
    } else {
      return value;
    }
  }
}
