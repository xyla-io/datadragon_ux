import { Injectable } from '@angular/core';

export type SortServiceSortable = number|string|boolean|(number|string|boolean)[];

@Injectable()
export class SortService<T> {

  constructor(private propertyMap: ((sortBy: string, a: T, b: T) => [SortServiceSortable, SortServiceSortable])) { }

  sortData(sortBy: string, direction, data: T[]): T[] {
    return data.sort((a, b) => {
      var propertyA: SortServiceSortable = '';
      var propertyB: SortServiceSortable = '';

      [propertyA, propertyB] = this.propertyMap(sortBy, a, b);

      if (Array.isArray(propertyA) && Array.isArray(propertyB)) {
        let arrayA = propertyA;
        let arrayB = propertyB;
        for (let i = 0; i < arrayA.length; i++) {
          propertyA = arrayA[i];
          propertyB = arrayB[i];
          if (arrayA[i] !== arrayB[i]) { break; }
        }
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (direction == 'asc' ? 1 : -1);
    });
  }
}
