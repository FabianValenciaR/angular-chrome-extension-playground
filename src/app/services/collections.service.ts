import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { Collections } from '../models/collections';
import { ToastrManager } from 'ng6-toastr-notifications';
import { FFile } from '../models/ffile';
import { SearchCollectionsPipe } from '../pipes/search-collections.pipe';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {
  public totalCollections: Collections[] = new Array<Collections>();
  public actualCollectionsToShow: Collections[] = new Array<Collections>();
  private collectionServiceHearbeatID: NodeJS.Timer;
  private searchCollectionsPipe = new SearchCollectionsPipe();

  constructor(
    private httpClient: HttpClient,
    public userService: UserService,
    private collectionToast: ToastrManager
  ) {}

  /**
   *Starts the heart beat that will retrieve all collectionss
   *
   * @memberof CollectionsService
   */
  async startHearbeat() {
    if (!this.collectionServiceHearbeatID) {
      await this.getAllCollection();

      const heartbeat = async () => {
        if (this.collectionServiceHearbeatID) clearTimeout(this.collectionServiceHearbeatID);

        if (document.hasFocus()) {
          await this.getAllCollection();
        }

        // using a `setTimeout` allows us to start counting from
        // when the previous `await getCollections` finished
        this.collectionServiceHearbeatID = setTimeout(heartbeat, 30_000);
      };
      heartbeat();
    }
  }

  /**
   *Create a new collection service
   *
   * @param {Collections} collection
   * @memberof CollectionsService
   */
  public async createCollection(collectionName: string) {
    const uuidv4 = require('uuid/v4');
    const collection: Collections = {
      CollectionKey: uuidv4(),
      CollectionName: collectionName,
      CreatorCognitoId: this.userService.currentUser.CognitoId,
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      CollectionsFiles: new Array<FFile>()
    };
    const token = await this.userService.getJwtToken();
    const options = {
      headers: new HttpHeaders()
        .append('Authorization', token)
        .append('Access-Control-Allow-Origin', '*')
    };
    try {
      let response = await this.httpClient
        .post(environment.BaseApiUrl + 'collection', collection, options)
        .toPromise();
      await this.getAllCollection();
      this.collectionToast.successToastr('Collection created successfully.');
      return response;
    } catch (error) {
      this.collectionToast.errorToastr('There was an error while creating the collection.');
      throw error;
    }
  }

  /**
   *Get Collection from collectionId
   *
   * @param {string} collectionId
   * @return {*}
   * @memberof CollectionsService
   */
  public async getCollection(collectionId: string) {
    const options = {
      headers: new HttpHeaders()
        .append('Access-Control-Allow-Origin', '*')
    };
    try {
      let response = await this.httpClient
        .get(`${environment.BaseApiUrl}/collection/${collectionId}`, options)
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   *Get all the collections of current user
   *
   * @return {*}
   * @memberof CollectionsService
   */
  public async getAllCollection() {
    const token = await this.userService.getJwtToken();
    const options = {
      headers: new HttpHeaders()
        .append('Access-Control-Allow-Origin', '*')
        .append('Authorization', token)
    };
    try {
      let response = await this.httpClient
        .get(`${environment.BaseApiUrl}/collections`, options)
        .toPromise();

      var arrayResponse = Object.values(response);
      this.totalCollections = [];
      arrayResponse.forEach(item => {
        let collection: Collections = {
          CollectionKey: item.CollectionKey.S,
          CollectionName: item.CollectionName.S,
          CreatedAt: item.CreatedAt.S,
          UpdatedAt: item.UpdatedAt.S,
          CreatorCognitoId: item.CreatorCognitoId.S,
          CollectionsFiles: []
        };
        this.totalCollections.push(collection);
      });

      this.actualCollectionsToShow = this.totalCollections;

      return this.actualCollectionsToShow;
    } catch (error) {
      throw error;
    }
  }

  /**
   *Updates collection's name
   *
   * @param {string} collectionId
   * @param {string} collectionName
   * @return {*}
   * @memberof CollectionsService
   */
  public async updateCollectionName(collectionId: string, collectionName: string) {
    const token = await this.userService.getJwtToken();

    let collection: Collections = {
      CollectionKey: collectionId,
      CollectionName: collectionName,
      CreatedAt: '',
      UpdatedAt: '',
      CreatorCognitoId: '',
      CollectionsFiles: []
    };

    const options = {
      headers: new HttpHeaders()
        .append('Authorization', token)
        .append('Access-Control-Allow-Origin', '*')
    };
    try {
      let response = await this.httpClient
        .post(`${environment.BaseApiUrl}/collection/update/${collectionId}`, collection, options)
        .toPromise();
      await this.getAllCollection();
      this.collectionToast.successToastr('Collection updated successfully.');
      return response;
    } catch (error) {
      this.collectionToast.errorToastr('There was an error while updating the collection.');
      throw error;
    }
  }

  /**
   *Delete collection from collectionId
   *
   * @param {string} collectionId
   * @return {*}
   * @memberof CollectionsService
   */
  public async deleteCollection(collectionId: string) {
    const token = await this.userService.getJwtToken();
    const options = {
      headers: new HttpHeaders()
        .append('Authorization', token)
        .append('Access-Control-Allow-Origin', '*')
    };
    try {
      let response = await this.httpClient
        .delete(`${environment.BaseApiUrl}/collection/${collectionId}`, options)
        .toPromise();
      await this.getAllCollection();
      this.collectionToast.successToastr('Collection deleted successfully.');
      return response;
    } catch (error) {
      this.collectionToast.errorToastr('There was an error while deleting the collection.');
      throw error;
    }
  }

  /**
   *Add file to a Collection
   *
   * @param {string} collectionId
   * @param {FFile} file
   * @return {*}
   * @memberof CollectionsService
   */
  public async addFileToCollection(collectionId: string, file: FFile) {
    const token = await this.userService.getJwtToken();
    const options = {
      headers: new HttpHeaders()
        .append('Authorization', token)
        .append('Access-Control-Allow-Origin', '*')
    };
    try {
      let response = await this.httpClient
        .post(environment.BaseApiUrl + `collection/add-file/${collectionId}`, file, options)
        .toPromise();
      this.collectionToast.successToastr('File added successfully.');
      return response;
    } catch (error) {
      this.collectionToast.errorToastr('There was an error while adding a file to the collection.');
      throw error;
    }
  }

  /**
   *Removes a File from a Collection
   *
   * @param {string} collectionId
   * @param {FFile} file
   * @return {*}
   * @memberof CollectionsService
   */
  public async removeFileFromCollection(collectionId: string, fileIndex: number) {
    const token = await this.userService.getJwtToken();
    const options = {
      headers: new HttpHeaders()
        .append('Authorization', token)
        .append('Access-Control-Allow-Origin', '*')
    };
    try {
      let response = await this.httpClient
        .post(environment.BaseApiUrl + `collection/remove-file/${collectionId}`, fileIndex, options)
        .toPromise();
        this.collectionToast.successToastr('File removed successfully.');
      return response;
    } catch (error) {
      this.collectionToast.errorToastr('There was an error while removing the file to the collection.');
      throw error;
    }
  }

  public filterActualFilesToShow(stringSearch: string){
    this.actualCollectionsToShow = this.searchCollectionsPipe.transform(this.totalCollections, stringSearch);
  }
}
