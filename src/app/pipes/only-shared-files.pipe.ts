import { Pipe, PipeTransform } from '@angular/core';
import { FileModel } from '../interfaces/file-interface';

@Pipe({
  name: 'onlySharedFiles',
  pure: false
})
export class OnlySharedFilesPipe implements PipeTransform {
  transform(collection: Array<FileModel>, onlyShared: boolean): Array<FileModel> {
    return collection.filter(e => {
      if (!onlyShared) {
        // show all files
        return true;
      } else {
        // show only shared or viewed files
        return e.totalViews > 0 || e.totalShares > 0;
      }
    });
  }
}
