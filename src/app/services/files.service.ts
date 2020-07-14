import { Injectable } from "@angular/core";
import { FileModel } from "../interfaces/file-interface";
import { UserService } from "./user.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class FilesService {
  public totalFiles: FileModel[] = [];
  private fileServiceHearbeatID: NodeJS.Timer;
  public selectedFile: FileModel = new FileModel();
  public loaded = false;

  constructor(public userService: UserService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getFiles();
  }

  ngOnDestroy() {
    this.stopHearBeat();
  }

  async startHearbeat() {
    if (!this.fileServiceHearbeatID) {
      this.getFiles();
      this.fileServiceHearbeatID = setInterval(() => {
        this.getFiles();
      }, 8000);
    }
  }

  stopHearBeat() {
    if (this.fileServiceHearbeatID) {
      clearInterval(this.fileServiceHearbeatID);
      this.fileServiceHearbeatID = undefined;
      this.ClearFiles();
    }
  }

  ClearFiles() {
    this.totalFiles = new Array<FileModel>();
  }

  async setSelectedFile(selectedFile: FileModel) {
    this.selectedFile = selectedFile;
  }

  async getSelectedFile() {
    return this.selectedFile;
  }

  async getFiles() {
    const token = await this.userService.getJwtToken();

    const options = {
      headers: new HttpHeaders()
        .append("Authorization", token)
        .append("Access-Control-Allow-Origin", "*"),
    };

    this.http
      .get(environment.BaseApiUrl + "files", options)
      .subscribe((data: Array<any>) => {

        let unorderedFiles = data['data'].sort(function(a,b){
          return new Date(b.ProcessedDate).getTime() - new Date(a.ProcessedDate).getTime();
        });

        // @ts-ignore
        // tslint:disable-next-line: prefer-for-of
        if (unorderedFiles) {

          this.totalFiles = [];
          for (let i = 0; i < unorderedFiles.length; i++) {
            // Validate if this item already exists in the array, otherwise push it
            const file = new FileModel();
            file.Key = unorderedFiles[i].Key;
            file.Name = unorderedFiles[i].FileName;
            file.Token = unorderedFiles[i].AssociatedTokens[0];
            file.CreatedDate = new Date(unorderedFiles[i].ProcessedDate).toUTCString();
            file.Owner = unorderedFiles[i].UploaderCognitoId;
            file.Type = unorderedFiles[i].FileFormat;

            this.totalFiles.push(file);
          }
        }
        this.loaded = true;
      });
  }
}
