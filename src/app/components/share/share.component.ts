import { Component, OnInit } from "@angular/core";
import {
  faEnvelope,
  faShareAlt,
  faTimes,
  faEnvelopeOpenText,
} from "@fortawesome/free-solid-svg-icons";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

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

  constructor(private http: HttpClient) {
    this.Emails = new Array();
    this.emailBody = "";
    this.localEmail = "";
    this.validationEmail = "";
  }

  ngOnInit() {}

  addEmail(e: any) {
    if (e.keyCode === 13) {
      if (this.Emails.length < 15) {
        this.Emails.push(this.localEmail.toLowerCase());
        this.localEmail = "";
        this.validationEmail = "";
      }
    } else {
      if (this.localEmail.length > 0) {
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
    const objEmail = {
      FileToken: this.newUrlToken,
      ReceiverAddresses: this.Emails,
      EmailBody: this.emailBody.replace(/\n/g, "<br>").concat("<br>"),
      FileName: this.newFileName,
    };

    let options = {};

    let requestUrl = environment.BaseApiUrl + "/ses/sharing";

    this.http
      .post(requestUrl, JSON.stringify(objEmail), options)
      .subscribe((data: Array<string>) => {
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
      });
  }
}
