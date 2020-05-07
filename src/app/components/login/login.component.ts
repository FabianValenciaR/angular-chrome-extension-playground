import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrManager } from "ng6-toastr-notifications";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";
  isLoggedIn: boolean = false;

  constructor(
    private userService: UserService,
    public router: Router,
    private spinner: NgxSpinnerService,
    public toastr: ToastrManager
  ) {}

  ngOnInit() {}

  doLogin() {
    this.email = this.email.trim().toLocaleLowerCase();
    if (!this.checkEmail(this.email)) {
      this.toastr.errorToastr('Valid email address required.');
      return;
    }

    this.spinner.show();
    this.userService
      .userLogIn(this.email, this.password)
      .then((response) => {
        this.isLoggedIn = true;
        this.spinner.hide();
        this.router.navigate(["/home"]);
      })
      .catch((error) => {
        this.spinner.hide();
        this.isLoggedIn = false;
        console.error(error);
        this.toastr.errorToastr(error.message);
      });
  }

  checkEmail(strEmail: string) {
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|'(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*')@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return regex.test(strEmail) && regex.exec(strEmail)[0] === strEmail;
  }
}
