import { FilesService } from "src/app/services/files.service";
import { UserService } from "./../../services/user.service";
import { Component, OnInit, Input } from "@angular/core";
import { FileModel } from "src/app/interfaces/file-interface";

@Component({
  selector: "app-file-card",
  templateUrl: "./file-card.component.html",
  styleUrls: ["./file-card.component.scss"],
})
export class FileCardComponent implements OnInit {
  @Input() localFile: FileModel;

  constructor(
    public userService: UserService,
    private filesService: FilesService
  ) {}

  ngOnInit() {}

  getSession() {
    let cognitoSession = localStorage.getItem("sd-session");
    console.log(cognitoSession);
  }

  selectFile(file: FileModel) {
    this.filesService.setSelectedFile(file);
  }
}
