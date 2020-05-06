import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GroupInPipe } from './group-in.pipe';
import { OnlySharedFilesPipe } from './only-shared-files.pipe';
import { SearchFilesPipe } from './search-files.pipe';
import { SecondsToStringTimePipe } from './seconds-to-string-time.pipe';
import { UserFileKeyToUrlPipe } from './user-file-key-to-url.pipe';
import { CurrentDomainPipe } from './current-domain.pipe';
import { UnanonimizePipe } from './unanonimize.pipe';

@NgModule({
  declarations: [
    GroupInPipe,
    OnlySharedFilesPipe,
    SearchFilesPipe,
    SecondsToStringTimePipe,
    UserFileKeyToUrlPipe,
    CurrentDomainPipe,
    UnanonimizePipe
  ],
  imports: [CommonModule],
  exports: [
    GroupInPipe,
    OnlySharedFilesPipe,
    SearchFilesPipe,
    SecondsToStringTimePipe,
    UserFileKeyToUrlPipe,
    CurrentDomainPipe,
    UnanonimizePipe
  ]
})
export class PipesModule {}
