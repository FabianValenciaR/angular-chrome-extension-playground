import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToStringTime'
})
export class SecondsToStringTimePipe implements PipeTransform {
  transform(value: number): string {
    if (!value) {
      // if value is undefined then return 0 seconds
      return '0s';
    }

    if (value < 60) {
      return `${Math.floor(value)}s`;
    } else if (value >= 60 && value < 3600) {
      const minutes = Math.floor(value / 60);
      const seconds = Math.floor(value % 60);

      return `${minutes}m ${seconds}s`;
    } else {
      const hours = Math.floor(value / 3600);
      const minutes = Math.floor((value % 3600) / 60);
      const seconds = Math.floor(((value % 3600) % 60) % 60);

      return `${hours}h ${minutes}m ${seconds}s`;
    }
  }
}
