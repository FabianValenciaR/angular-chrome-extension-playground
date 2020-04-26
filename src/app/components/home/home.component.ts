import { Component, OnInit } from "@angular/core";
import { FilesService } from "src/app/services/files.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(public filesService: FilesService) {}

  ngOnInit() {
    this.filesService.startHearbeat();
  }
}
