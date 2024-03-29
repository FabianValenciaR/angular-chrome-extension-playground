import { FilesService } from "src/app/services/files.service";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { Component, OnInit } from "@angular/core";
import { faSignOutAlt, faChevronCircleLeft, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Location } from '@angular/common';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  public faLogOut = faSignOutAlt;
  public faBack = faArrowLeft;

  constructor(
    private userService: UserService,
    public router: Router,
    private filesService: FilesService,
    private location: Location
  ) {}

  ngOnInit() {}

  logOut() {
    this.filesService.stopHearBeat();
    this.userService.userLogOut();
    this.router.navigate(["/login"]);
  }

  goToFiles(){
    this.router.navigate(['/home'], { queryParams: { selectedTab: 'files' } });
  }

  goToCollections(){
    this.router.navigate(['/home'], { queryParams: { selectedTab: 'collections' } });
  }
}
