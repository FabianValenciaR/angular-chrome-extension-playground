import { Component, OnInit, Input } from '@angular/core';
import { FileModel } from 'src/app/interfaces/file-interface';

@Component({
  selector: 'app-files-container',
  templateUrl: './files-container.component.html',
  styleUrls: ['./files-container.component.scss']
})
export class FilesContainerComponent implements OnInit {
  @Input() filesToShow: Array<FileModel>;

  constructor() { }

  ngOnInit() {
  }

}
