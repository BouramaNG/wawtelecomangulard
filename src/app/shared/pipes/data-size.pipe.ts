import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataSize',
  standalone: true,
})
export class DataSizePipe implements PipeTransform {
  transform(dataMb?: number | null): string {
    if (dataMb == null || isNaN(Number(dataMb))) return '';
    const mb = Number(dataMb);
    if (mb >= 1024) {
      const go = mb / 1024;
      // Affiche sans décimales si entier, sinon une décimale max
      const value = Number.isInteger(go) ? go.toString() : go.toFixed(1);
      return `${value} GO`;
    }
    return `${mb} Mo`;
  }
}
