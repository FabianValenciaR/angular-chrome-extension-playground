import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'currentDomain'
})
export class CurrentDomainPipe implements PipeTransform {
  transform(value: string): string {
    if (environment.StageName === 'Staging') {
      return 'app.slydeck.io';
    }
    return new URL(value).hostname;
  }
}
