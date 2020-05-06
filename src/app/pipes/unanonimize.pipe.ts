import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unanonimize'
})
export class UnanonimizePipe implements PipeTransform {
  private isUUID(val: string): boolean {
    // for more info on uuid structure, see: https://en.wikipedia.org/wiki/Universally_unique_identifier#Format
    let regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

    return regex.test(val);
  }

  /**
   * Instead of displaying the complete anonymous UUID, it should actually
   * be formatted as 'Unknown Recipient-123456' where '123456' is the first
   * section of the UUID.
   *
   * @param value the string which is potentially a UUID
   */
  transform(value: string): string {
    if (this.isUUID(value)) {
      return `Unknown Recipient-${value.split('-')[0]}`;
    } else {
      return value;
    }
  }
}
