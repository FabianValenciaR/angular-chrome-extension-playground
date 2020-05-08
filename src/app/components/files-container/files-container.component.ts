import { FilesService } from 'src/app/services/files.service';
import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { FileModel } from "src/app/interfaces/file-interface";

@Component({
  selector: "app-files-container",
  templateUrl: "./files-container.component.html",
  styleUrls: ["./files-container.component.scss"],
})
export class FilesContainerComponent implements OnInit, OnChanges {
  @Input() filesToShow: Array<FileModel> = new Array<FileModel>();
  public actualFilesToShow = new Array<FileModel>();

  constructor(public filesService: FilesService) {}

  ngOnInit() {}

  /**
   *Filtering actual files to show
   *
   * @param {import("@angular/core").SimpleChanges} changes
   * @memberof FilesContainerComponent
   */
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    const files: Array<FileModel> = changes.filesToShow.currentValue;
    const newFiles = [];
    let changed = false;

    for (const f of files) {
      if (!this.actualFilesToShow.find((e) => e.Name === f.Name)) {
        newFiles.push(f);
        changed = true;
      }
    }

    this.actualFilesToShow.forEach((value) => {
      // if (!this.filesService.totalFiles.find(e => e.Name === value.Name)) {
      if (!files.find((e) => e.Name === value.Name)) {
        this.actualFilesToShow.splice(this.actualFilesToShow.indexOf(value), 1);
        changed = true;
      }
    });

    this.actualFilesToShow = [...this.actualFilesToShow, ...newFiles];
  }
}
