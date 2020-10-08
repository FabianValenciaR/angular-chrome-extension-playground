import { Pipe, PipeTransform } from '@angular/core';
import { Collections } from '../models/collections';

@Pipe({
  name: 'searchCollections'
})
export class SearchCollectionsPipe implements PipeTransform {

  transform(collection: Array<Collections>, str2Search: string): Array<Collections> {
    if (!str2Search || str2Search === '') return collection;
    else {
      return collection.filter(e => {
        return e.CollectionName.toLowerCase().includes(str2Search.toLowerCase());
      });
    }
  }

}
