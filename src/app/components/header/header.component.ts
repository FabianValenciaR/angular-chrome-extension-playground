import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { Component, OnInit } from "@angular/core";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  public faLogOut = faSignOutAlt;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {}

  logOut() {
    this.userService.userLogOut();
    this.router.navigate(["/login"]);
  }
}
