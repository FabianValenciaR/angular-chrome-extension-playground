import { NgxSpinnerService } from "ngx-spinner";
import { FilesService } from "src/app/services/files.service";
import { Component, OnInit } from "@angular/core";
import {
  faEnvelope,
  faShareAlt,
  faTimes,
  faEnvelopeOpenText,
} from "@fortawesome/free-solid-svg-icons";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ToastrManager } from "ng6-toastr-notifications";

@Component({
  selector: "app-share",
  templateUrl: "./share.component.html",
  styleUrls: ["./share.component.scss"],
})
export class ShareComponent implements OnInit {
  public Emails: string[];
  public emailBody: string;
  public localEmail: string;
  public validationEmail: string;
  private newUrlToken: string;
  private newFileName: string;

  public faEnvelope = faEnvelope;
  public faTimes = faTimes;
  public faShareAlt = faShareAlt;
  public faEnvelopeOpenText = faEnvelopeOpenText;

  constructor(
    private http: HttpClient,
    private filesService: FilesService,
    private spinner: NgxSpinnerService,
    public toastr: ToastrManager
  ) {
    this.Emails = new Array();
    this.emailBody = "";
    this.localEmail = "";
    this.validationEmail = "";
  }

  ngOnInit() {}

  getFileValues() {
    this.filesService
      .getSelectedFile()
      .then((res) => {
        this.newUrlToken = res.Token;
        this.newFileName = res.Name;
      })
      .catch((error) => {
        console.error(error);
        this.toastr.errorToastr("Something went wrong! Please try again.");
      });
  }

  addEmail(e: any) {
    if (e.keyCode === 13) {
      if (
        this.checkEmail(this.localEmail.toLowerCase()) &&
        !this.findEmail(this.localEmail.toLowerCase()) &&
        this.Emails.length < 15
      ) {
        this.Emails.push(this.localEmail.toLowerCase());
        this.localEmail = "";
        this.validationEmail = "";
      }
    } else {
      if (
        !this.checkEmail(this.localEmail.toLowerCase()) &&
        this.localEmail.length > 0
      ) {
        this.validationEmail = "is-invalid";
      } else {
        this.validationEmail = "";
      }
    }
  }

  removeEmail(index: number) {
    this.Emails.splice(index, 1);
  }

  async shareFile() {
    if (
      this.localEmail.length > 0 &&
      this.checkEmail(this.localEmail) &&
      !this.findEmail(this.localEmail) &&
      this.Emails.length < 15
    ) {
      this.Emails.push(this.localEmail);
      this.localEmail = "";
    }

    await this.getFileValues();

    if (this.Emails.length > 0) {
      const objEmail = {
        FileToken: this.newUrlToken,
        ReceiverAddresses: this.Emails,
        EmailBody: this.emailBody.replace(/\n/g, "<br>").concat("<br>"),
        FileName: this.newFileName,
      };

      let options = {};

      let requestUrl = environment.BaseApiUrl + "/ses/sharing";

      this.spinner.show();

      this.http.post(requestUrl, JSON.stringify(objEmail), options).subscribe(
        (data: Array<string>) => {
          if (data.length === 0) {
            this.Emails = new Array();
            this.localEmail = "";
            this.emailBody = "";
          } else {
            for (const badEmail of data) {
              const emailId = this.Emails.findIndex((x) => x === badEmail);
              const emailElement = document.getElementById("email" + emailId);
              emailElement.style.color = "red";
            }
          }
          this.spinner.hide();
          this.toastr.successToastr(
            "The file: " + this.newFileName + " was shared successfully!"
          );
        },
        (error) => {
          this.toastr.errorToastr("Something went wrong! Please try again.");
        }
      );
    } else {
      this.toastr.errorToastr("Please add a valid email address");
    }
  }

  checkEmail(strEmail: string) {
    // tslint:disable-next-line: max-line-length
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return regex.test(strEmail) && regex.exec(strEmail)[0] === strEmail;
  }

  findEmail(strEmail: string) {
    return this.Emails.includes(strEmail);
  }
}
