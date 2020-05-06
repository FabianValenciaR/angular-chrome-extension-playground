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

  constructor(public userService: UserService) {}

  ngOnInit() {}

  getSession() {
    let cognitoSession = localStorage.getItem("sd-session");
    console.log(cognitoSession);
  }
}
