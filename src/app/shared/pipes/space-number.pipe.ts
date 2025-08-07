import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'spaceNumber',
  standalone: true
})
export class SpaceNumberPipe implements PipeTransform {
  transform(value: number | string, digitsInfo?: string): string {
    if (value == null) return '';
    
    // Convert to number and format using toLocaleString
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    // Format with no decimal places and replace commas with spaces
    return isNaN(num) ? '' : num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).replace(/,/g, ' ');
  }
}