import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";
  isLoggedIn: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit() {}

  doLogin() {
    this.userService
      .userLogIn(this.email, this.password)
      .then((response) => {
        this.isLoggedIn = true;
      })
      .catch((error) => {
        this.isLoggedIn = false;
      });
  }
}
