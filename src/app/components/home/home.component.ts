import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import { FilesService } from "src/app/services/files.service";
import { UploadingService } from "src/app/services/uploading.service";
import * as AWS from "aws-sdk";
import { UploaderPool } from "src/app/models/uploader-pool";
import { UserService } from "src/app/services/user.service";
import { environment } from "src/environments/environment";
import { PaymentService } from "src/app/services/payment.service";
import { ToastrManager } from "ng6-toastr-notifications";
import { NgxSpinnerService } from "ngx-spinner";
import { CollectionsService } from 'src/app/services/collections.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  @ViewChild('textSearch', { static: false }) textSearch: ElementRef;

  @Output() public receiveTxt2Search = new EventEmitter<string>();
  public str2Search: string;
  public selectedTab: string;
  public allowFiles: string =
    ".doc,.docx,.pptx,application/pdf, application/msword, application/vnd.ms-powerpoint";

  constructor(
    public filesService: FilesService,
    private uploadingService: UploadingService,
    private userService: UserService,
    private paymentService: PaymentService,
    public toastr: ToastrManager,
    private spinner: NgxSpinnerService,
    private collectionsService: CollectionsService,
    private route: ActivatedRoute
  ) {
    this.str2Search = "";
  }

  ngOnInit() {
    this.filesService.loaded = false;
    this.filesService.startHearbeat();
    this.paymentService.RetrieveCustomer();
    this.route.queryParams.forEach(param => {
      this.selectTab(param.selectedTab);
    });
  }

  selectTab(tab: string){
    document.getElementById('collectionsTab').classList.remove('active');
    document.getElementById('filesTab').classList.remove('active');
    if (tab == "collections") {
      this.filterCollections('');
      document.getElementById('collectionsTab').classList.add('active');
      this.selectedTab = tab;
    } else if (tab == "files") {
      this.filterFiles('');
      document.getElementById('filesTab').classList.add('active');
      this.selectedTab = tab;
    }
  }

  filterFiles(str2Search: string) {
    this.str2Search = str2Search;
  }

  filterCollections(str2Search: string){
    this.collectionsService.filterActualFilesToShow(str2Search);
  }

  selectFiles() {
    const iFiles = document.getElementById("inputFiles");
    iFiles.click();
  }

  selectedFiles(e: any) {
    // tslint:disable-next-line: no-string-literal
    const sFiles: FileList = e["currentTarget"]["files"];
    if (sFiles.length === 0) {
      return;
    }

    try {
      // check all files in array and panic if invalid
      for (let f of Array.from(sFiles)) {
        this.uploadingService.panicIfInvalidSlydeckFile(f);
      }
      this.importSelectedFiles(Array.from(sFiles));
    } catch (error) {
      // @ts-ignore
      document.getElementById("inputFiles").value = null;
      this.toastr.errorToastr(error.message);
    }
  }

  importSelectedFiles(sFiles: any[]) {
    this.uploadingService.slydeckFiles = new Array<any>();

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < sFiles.length; i++) {
      this.uploadingService.slydeckFiles.push(sFiles[i]);
    }

    if (
      this.filesService.totalFiles.length + sFiles.length >
      this.userService.currentUser.PricingPlan.PricingPlanRestrictions.FileLimit
    ) {
      this.toastr.errorToastr(
        `Your current plan only allows up to: ${this.userService.currentUser.PricingPlan.PricingPlanRestrictions.FileLimit} files.`
      );
    } else {
      setTimeout(() => {
        this.uploadFiles();
      }, 0);
    }
  }

  public async uploadFiles(): Promise<void> {
    if (this.uploadingService.slydeckFiles.length > 0) {
      AWS.config.httpOptions.timeout = 0;

      await this.uploadingFiles();

      // this line is necessary to avoid the upload button in the navbar does nothing when
      // select the same file as the last time
      //@ts-ignore
      document.getElementById("inputFiles").value = null;
    }
  }

  /**
   * Uploads the files in the `this.uploadingService.slydeckFiles` array
   * in chunks.
   */
  async uploadingFiles() {
    // allow a maximum of 4 files to be uploaded at the same time

    let uploaderPool = new UploaderPool(4);

    for (const file of this.uploadingService.slydeckFiles) {
      uploaderPool.add(() => this.uploadSingleFile(file));
    }

    await uploaderPool.execute();
  }

  async uploadSingleFile(file): Promise<void> {
    this.spinner.show();

    const fileNameTokens = file.name.split(".");
    const fileFormat = fileNameTokens[fileNameTokens.length - 1];
    const index = this.uploadingService.slydeckFiles.indexOf(file);
    // tslint:disable-next-line: no-string-literal
    file["status"] = "Uploading";

    const s3client = new AWS.S3({
      credentials: await this.userService.getAWSCredentials(),
    });

    try {
      const normalized_file_name = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toString();

      const uploadResults = await s3client
        .upload({
          Bucket: environment.OriginalFilesBucketName,
          Key:
            // @ts-ignore
            AWS.config.credentials.params.IdentityId +
            "/" +
            normalized_file_name,
          Body: file,
          ACL: "public-read",
          Metadata: {
            "file-format": fileFormat,
            "provided-jwt": await this.userService.getJwtToken(),

            // to properly base64 encode-decode special characters:
            // https://stackoverflow.com/a/30106551
            "b64-initial-file-name": btoa(
              encodeURIComponent(file.name).replace(
                /%([0-9A-F]{2})/g,
                (match, p1) => {
                  return String.fromCharCode(parseInt(p1, 16));
                }
              )
            ),
          },
        })
        .on("httpUploadProgress", (evt: any) => {
          const uploaded = Math.round((evt.loaded / evt.total) * 100);
        })
        .promise();

      setTimeout(() => {
        this.filesService.getFiles().then(() => {
          this.spinner.hide();
          this.toastr.successToastr(`Uploaded file: "${file.name}"`);
        });
      }, 3000);
      // tslint:disable-next-line: no-string-literal
      file["status"] = "Uploaded";

      const uploadedFileKey = uploadResults.Key;
      const keyPartFileName = uploadedFileKey.substring(
        uploadedFileKey.lastIndexOf("/") + 1
      );

      try {
        this.uploadingService.filesReady++;
      } catch (error) {
        // we either exceeded the maximum amount of retries or an unknown error ocurred while
        // obtaining info for the file
      }
    } catch (err) {
      this.spinner.hide();
      this.toastr.errorToastr(
        `There was an error uploading the file "${file.name}"`
      );

      // tslint:disable-next-line: no-string-literal
      file["status"] = "Error";
    }
  }
}
