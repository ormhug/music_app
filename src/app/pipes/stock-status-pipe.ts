import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stockStatus',
  standalone: true
})
export class StockStatusPipe implements PipeTransform {

  transform(value: number): string {
    if (value > 3) {
      return 'In Stock';
    } else if (value >= 1) {
      return 'Low Stock';
    } else {
      return 'Out of Stock';
    }
  }

}