import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UploadingService {
  public slydeckFiles: any[];
  public filesReady: number;
  public allowedFiles = ['doc', 'docx', 'pdf', 'ppt', 'pptx'];

  constructor(private userService: UserService) {
    this.slydeckFiles = new Array<any>();
    this.filesReady = 0;
  }

  /**
   * Checks whether `file` has the correct size and format. If everything
   * if valid then it returns true. Otherwise it throws an error with a
   * message specifying why the file is not valid.
   *
   * @param file the file to verify
   */
  public panicIfInvalidSlydeckFile(file: File): boolean {
    const ext = file.name.slice(file.name.lastIndexOf('.') + 1);

    // limit file size. Non-PDF files are limited to 75MB. And PDF files are limited
    // to 150Mb
    if ((ext !== 'pdf' && file.size > 75_000_000) || file.size > 150_000_000) {
      throw new Error(
        `The file '${file.name}' exceeds the file size limit. Maximum size per file is 75Mb.`
      );
    }

    if (!this.allowedFiles.includes(ext)) {
      throw new Error(
        `The file '${
          file.name
        }' is of an incorrect format. Allowed formats are: ${this.allowedFiles.join(', ')}`
      );
    }

    return true;
  }

  public getRenewedS3Client(): Promise<AWS.S3> {
    return new Promise((res, rej) => {
      AWS.config.httpOptions.timeout = 0;

      //@ts-ignore
      AWS.config.credentials.get(() => {
        res(
          new AWS.S3({
            credentials: new AWS.Credentials({
              accessKeyId: AWS.config.credentials.accessKeyId,
              secretAccessKey: AWS.config.credentials.secretAccessKey,
              sessionToken: AWS.config.credentials.sessionToken
            })
          })
        );
      });
    });
  }

  public uploadSingleFile(s3client, file, bucketName) {
    const fileNameTokens = file.name.split('.');
    const fileFormat = fileNameTokens[fileNameTokens.length - 1];
    // tslint:disable-next-line: no-string-literal
    file['status'] = 'Uploading';

    return new Promise(async (resolve, reject) => {
      let normalized_file_name = file.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toString();

      s3client.upload(
        {
          Bucket: bucketName,
          // @ts-ignore
          Key: AWS.config.credentials.params.IdentityId + '/' + normalized_file_name,
          Body: file,
          ACL: 'public-read',
          Metadata: {
            'file-format': fileFormat,
            'provided-jwt': await this.userService.getJwtToken(),

            // to properly base64 encode-decode special characters:
            // https://stackoverflow.com/a/30106551
            'b64-initial-file-name': btoa(
              encodeURIComponent(file.name).replace(/%([0-9A-F]{2})/g, (match, p1) => {
                return String.fromCharCode(parseInt(p1, 16));
              })
            )
          }
        },
        function (err, data) {
          if (err) {
            console.log('uploading.service.ts', 'uploadSingleFile', err);
            // tslint:disable-next-line: no-string-literal
            file['status'] = 'Error';
            reject(err);
          } else {
            // this.dargdropToast.info(`Uploaded file: "${file.name}"`);
            // tslint:disable-next-line: no-string-literal
            // file['status'] = 'Uploaded';
            // this.uploadingModal.completeProgressBar(index);
            resolve(data);
          }
        }.bind(this)
      );
      // .on('httpUploadProgress', (evt: any) => {
      //   const uploaded = Math.round((evt.loaded / evt.total) * 100);
      //   this.uploadingModal.updateProgressBar(index, uploaded);
      // });
    });
  }
}
