import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GroupInPipe } from './group-in.pipe';
import { OnlySharedFilesPipe } from './only-shared-files.pipe';
import { SearchFilesPipe } from './search-files.pipe';
import { SecondsToStringTimePipe } from './seconds-to-string-time.pipe';
import { UserFileKeyToUrlPipe } from './user-file-key-to-url.pipe';
import { CurrentDomainPipe } from './current-domain.pipe';
import { UnanonimizePipe } from './unanonimize.pipe';
import { SearchCollectionsPipe } from './search-collections.pipe';

@NgModule({
  declarations: [
    GroupInPipe,
    OnlySharedFilesPipe,
    SearchFilesPipe,
    SecondsToStringTimePipe,
    UserFileKeyToUrlPipe,
    CurrentDomainPipe,
    UnanonimizePipe,
    SearchCollectionsPipe
  ],
  imports: [CommonModule],
  exports: [
    GroupInPipe,
    OnlySharedFilesPipe,
    SearchFilesPipe,
    SecondsToStringTimePipe,
    UserFileKeyToUrlPipe,
    CurrentDomainPipe,
    UnanonimizePipe,
    SearchCollectionsPipe
  ]
})
export class PipesModule {}
