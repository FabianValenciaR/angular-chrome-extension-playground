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

  constructor(private userService: UserService) {}

  ngOnInit() {}

  doLogin() {
    console.log(this.email, this.password);
    this.userService
      .userLogIn(this.email, this.password)
      .then((response) => {
        console.log("Success!!!");
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
