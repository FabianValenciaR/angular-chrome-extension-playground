import { Pipe, PipeTransform } from '@angular/core';
import { FileModel } from '../interfaces/file-interface';

@Pipe({
  name: 'searchFiles'
})
export class SearchFilesPipe implements PipeTransform {
  transform(collection: Array<FileModel>, str2Search: string): Array<FileModel> {
    return collection.filter(e => {
      return e.Name.toLowerCase().includes(str2Search.toLowerCase());
    });
  }
}
