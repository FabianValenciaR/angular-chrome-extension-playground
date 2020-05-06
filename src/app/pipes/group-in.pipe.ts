import { Pipe, PipeTransform } from '@angular/core';
import { FileModel } from '../interfaces/file-interface';

@Pipe({
  name: 'groupIn'
})
export class GroupInPipe implements PipeTransform {
  transform(collection: Array<FileModel>, chunkSize: Number): Array<Array<FileModel>> {
    return collection.reduce(
      (accumulator, current) => {
        let last = accumulator[accumulator.length - 1];
        if (last.length === chunkSize) {
          accumulator.push([]);
        }
        accumulator[accumulator.length - 1].push(current)

        return accumulator;
      },
      [[]]
    );
  }
}
