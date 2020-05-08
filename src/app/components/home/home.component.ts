import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FilesService } from "src/app/services/files.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  @Output() public receiveTxt2Search = new EventEmitter<string>();
  public str2Search: string;

  constructor(public filesService: FilesService) {
    this.str2Search = "";
  }

  ngOnInit() {
    this.filesService.loaded = false;
    this.filesService.startHearbeat();
  }

  sendTxt2Search(str2Search: string) {
    this.str2Search = str2Search;
  }
}
