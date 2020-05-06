import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'userFileKeyToUrl'
})
export class UserFileKeyToUrlPipe implements PipeTransform {
  transform(fileKey: string): any {
    return `https://${environment.UserFilesBucketName}.s3-${environment.AwsRegion}.amazonaws.com/${fileKey}`;
  }
}
