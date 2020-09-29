import { Component, OnInit } from "@angular/core";
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { ToastrManager } from 'ng6-toastr-notifications';
import { CollectionsService } from 'src/app/services/collections.service';
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-copy-collection-url",
  templateUrl: "./copy-collection-url.component.html",
  styleUrls: ["./copy-collection-url.component.scss"],
})
export class CopyCollectionUrlComponent implements OnInit {
  public generatedLink: string;
  public newCollectionName: string;
  public newUrlToken: string;
  public localEmail: string;
  public aliasGroup: string;
  public isEmailValid: boolean = false;
  public faUser = faUser;
  public faEnvelope = faEnvelope;

  constructor(
    private userService: UserService,
    private copyToast: ToastrManager,
    private collectionsService: CollectionsService
  ) {}

  ngOnInit() {
    this.getCollectionValues();
  }

  validateEmail() {
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    this.isEmailValid =
      regex.test(this.localEmail) &&
      regex.exec(this.localEmail)[0] === this.localEmail;
    return this.isEmailValid;
  }

  buildUrl() {
    // Encoding Parameters
    this.validateEmail();
    // Encoding Parameters
    let emailEncoded: string = "";
    if (this.localEmail && this.isEmailValid) {
      emailEncoded = btoa(this.localEmail);
    }
    let aliasEncoded: string = "";
    if (this.aliasGroup) {
      aliasEncoded = btoa(this.aliasGroup);
    }
    // Building append URL with queryParams
    let appendUrl = "";
    if (!this.isEmailValid && this.aliasGroup) {
      appendUrl = `s_code=${aliasEncoded}`;
    } else if (this.aliasGroup && this.localEmail && this.isEmailValid) {
      appendUrl = `s_code=${emailEncoded}&a_code=${aliasEncoded}`;
    }
    this.generatedLink = `${this.userService.currentDomain}/c/${this.newUrlToken}?${appendUrl}`;
  }

  async copyLink() {
    // Creating hidden input to populate the string to copy
    const link = document.getElementById("CustomLinkUrl");
    const range = document.createRange();
    range.selectNode(link);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    // Executing actions to copy the link
    document.execCommand("copy");
    this.copyToast.successToastr("The Url was copied to clipboard!");
    this.closeModal();
  }

  getCollectionValues() {
    this.collectionsService
      .getSelectedCollection()
      .then((res) => {
        this.newUrlToken = res.CollectionKey;
        this.newCollectionName = res.CollectionName;
        this.buildUrl();
      })
      .catch((error) => {
        this.copyToast.errorToastr("Something went wrong! Please try again.");
      });
  }

  closeModal(){
    this.localEmail = "";
    this.aliasGroup = "";
    this.isEmailValid = false;
  }
}
