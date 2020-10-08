import { FFile } from './ffile';

export class Collections {
  CollectionKey: string;
  CollectionName: string;
  CreatorCognitoId: string;
  CreatedAt: string;
  UpdatedAt: string;
  CollectionsFiles: Array<FFile>;

  constructor(){
    this.CollectionKey = "";
    this.CollectionName = "";
    this.CreatorCognitoId = "";
    this.CreatedAt = "";
    this.UpdatedAt = "";
    this.CollectionsFiles = [];
  }
}
