import { UserService } from "src/app/services/user.service";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}
  canActivate() {
    return this.userService
      .isUserLogged()
      .then((res) => {
        if (res) {
          return true;
        } else {
          this.router.navigate(["/login"]);
          return false;
        }
      })
      .catch((err) => {
        return false;
      });
  }
}
