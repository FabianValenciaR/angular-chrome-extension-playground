import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { Router } from '@angular/router';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";
  isLoggedIn: boolean = false;

  constructor(private userService: UserService, public router: Router) {}

  ngOnInit() {}

  doLogin() {
    this.userService
      .userLogIn(this.email, this.password)
      .then((response) => {
        this.isLoggedIn = true;
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        this.isLoggedIn = false;
      });
  }
}
