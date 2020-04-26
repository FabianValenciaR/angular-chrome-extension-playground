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


  constructor(public userService: UserService, private http: HttpClient) {}

  async startHearbeat() {
    if (!this.fileServiceHearbeatID) {
      this.getFiles();
      this.fileServiceHearbeatID = setInterval(() => {
        this.getFiles();
      }, 8000);
    }
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
        // @ts-ignore
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < data.length; i++) {
          // Validate if this item already exists in the array, otherwise push it
          if (data) {
            const file = new FileModel();
            file.Key = data[i].Key;
            file.Name = data[i].Key.split("/")[1];
            file.Token = data[i].AssociatedTokens[0];
            file.CreatedDate = new Date(data[i].ProcessedDate).toUTCString();
            file.Owner = data[i].UploaderCognitoId;
            file.Type = data[i].FileFormat;

            this.totalFiles.push(file);
          }
        }
      });
  }
}
