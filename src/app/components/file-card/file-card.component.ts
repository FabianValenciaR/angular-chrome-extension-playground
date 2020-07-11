import { FilesService } from "src/app/services/files.service";
import { UserService } from "./../../services/user.service";
import { Component, OnInit, Input } from "@angular/core";
import { FileModel } from "src/app/interfaces/file-interface";
import { ToastrManager } from 'ng6-toastr-notifications';
import { faShare, faShareAlt, faCopy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-file-card",
  templateUrl: "./file-card.component.html",
  styleUrls: ["./file-card.component.scss"],
})
export class FileCardComponent implements OnInit {
  @Input() localFile: FileModel;
  public formatedDate: string;
  public faShare = faShareAlt;
  public faCopy = faCopy;

  constructor(
    public userService: UserService,
    private filesService: FilesService,
    public toastr: ToastrManager
  ) {}

  ngOnInit() {}

  getSession() {
    let cognitoSession = localStorage.getItem("sd-session");
  }

  ngOnChanges(){
    this.formatedDate = new Date(this.localFile.CreatedDate).toISOString().slice(0,10);
  }

  copyClipboard(file: FileModel){
    let generatedLink = this.userService.currentDomain + '/v/' + file.Token;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = generatedLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toastr.successToastr(
      "The link for the file: " + file.Name + " was copied to clipboard!"
    );
  }

  selectFile(file: FileModel) {
    this.filesService.setSelectedFile(file);
  }
}
