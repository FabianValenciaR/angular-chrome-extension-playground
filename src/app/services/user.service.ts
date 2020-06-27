import { Injectable } from "@angular/core";
import * as AWS_Auth from "amazon-cognito-identity-js";
import { environment } from "src/environments/environment";
import { UserModel } from "../models/user-model";
import * as AWS from "aws-sdk";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private userPool: AWS_Auth.CognitoUserPool;
  private cognitoUser: AWS_Auth.CognitoUser;
  private cognitoSession: AWS_Auth.CognitoUserSession;
  public readonly cookie_currentUser_name = "currentUser";
  public currentUser: UserModel;
  private sessionRefreshTimer: NodeJS.Timer;
  private userLoaded = false;
  public currentDomain: string;

  constructor(private httpClient: HttpClient) {
    this.currentUser = new UserModel();

    this.userPool = new AWS_Auth.CognitoUserPool({
      UserPoolId: environment.CognitoUserPoolId,
      ClientId: environment.CognitoClientId,
    });

    this.setCredentialsConfig();

    //Verifies if the user is logged if not refresh the session
    this.isUserLogged().then((isIt) => {
      this.userLoaded = isIt;
      if (isIt) {
        console.log("Logged!");
      } else this.refreshUserSession().catch(() => {});
    });

    //Set the file base domain if the user loaded
    this.waitUserLoad().then(() => {
      this.loadUserSettings().then(() => {
        // wait for user to load then set file base domain
        this.SetFileBaseDomain();
      });
    });
  }

  userLogIn(email: string, password: string): Promise<any> {
    this.userLoaded = false;

    // Builds the object with the user credentials
    const authenticationDetails = new AWS_Auth.AuthenticationDetails({
      Password: password,
      Username: email,
    });

    // Builds the object with the pool where credentials are going to be checked
    this.cognitoUser = new AWS_Auth.CognitoUser({
      Pool: this.userPool,
      Username: email,
    });

    // Builds the response promise
    return new Promise((resolve, reject) => {
      this.cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (
          session: AWS_Auth.CognitoUserSession,
          userConfirmationNecessary?: boolean
        ) => {
          this.cognitoSession = session;

          this.setupSessionRenewal();

          this.cognitoUser.getUserAttributes(async (err, res) => {
            if (err) {
              reject({
                rType: "error",
                message: err.message,
                goLogin: false,
              });
              return;
            }

            function getSpecifcAttribute(att_name: string) {
              return res.find((x) => x["Name"] === att_name)["Value"];
            }

            this.currentUser.CognitoId = getSpecifcAttribute("sub");
            this.currentUser.CompanyName = getSpecifcAttribute(
              "custom:company_name"
            );
            this.currentUser.Email = getSpecifcAttribute("email");
            this.currentUser.FullName = getSpecifcAttribute("name");
            this.currentUser.PhoneNumber = getSpecifcAttribute("phone_number");

            localStorage.setItem(
              this.cookie_currentUser_name,
              JSON.stringify(this.currentUser)
            );

            await this.setCredentialsConfig(session.getIdToken().getJwtToken());

            // also load cognito identity credentials
            // @ts-ignore
            AWS.config.credentials.refresh(() => {
              this.userLoaded = true;
            });

            resolve({
              rType: "success",
              message: "",
              goLogin: false,
            });
          });
        },
        onFailure: (err: any) => {
          reject({
            rType: "error",
            message: err.message,
            goLogin: false,
            rCode: err.code,
          });
        },
      });
    });
  }

  /**
   *Return a flag if the user is logged
   *
   * @returns {Promise<boolean>}
   * @memberof UserService
   */
  async isUserLogged(): Promise<boolean> {
    try {
      const logInfor = localStorage.getItem(this.cookie_currentUser_name);

      // if user data is in a cookie then load it
      if (logInfor) {
        this.currentUser = JSON.parse(
          localStorage.getItem(this.cookie_currentUser_name)
        );
        // reload cognito session
        await this.getCognitoSession();
      }

      // check if cognito session hasn't expired
      if (this.cognitoSession.isValid()) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * returns a promise that is completed once the user attributes
   * and settings finish loading
   */
  public waitUserLoad() {
    return new Promise(
      ((res, rej) => {
        (function waitt() {
          // check if we have user cookies
          if (this.userLoaded) {
            res();
          } else {
            setTimeout(waitt.bind(this), 500);
          }
        }.bind(this)());
      }).bind(this)
    );
  }

  async getJwtToken(): Promise<string> {
    await this.waitUserLoad();
    return this.cognitoSession.getIdToken().getJwtToken();
  }

  getCognitoSession() {
    this.cognitoUser = this.userPool.getCurrentUser();

    return new Promise((res, rej) => {
      if (this.cognitoUser != null) {
        this.cognitoUser.getSession((sessionErr: any, session: any) => {
          if (sessionErr) {
            rej({
              rType: "error",
              message: sessionErr.message,
              goLogin: false,
            });
          } else {
            this.cognitoSession = session;
            this.setupSessionRenewal();

            res();
          }
        });
      } else {
        res();
      }
    });
  }

  private async setupSessionRenewal() {
    // try to clear existing timeout (if any)
    // NOTE: it doesn't matter what `this.sessionRefreshTimer`
    // is here, since it won't ever throw an error.
    clearTimeout(this.sessionRefreshTimer);

    let raw_token = await this.getJwtToken();
    let token = JSON.parse(atob(raw_token.split(".")[1]));

    let remainingMillisToExpiration = token.exp * 1000 - Date.now();
    if (remainingMillisToExpiration < 0) {
      // if for some reason the token has already expired, then set it to renew
      // in 6000 milli-seconds.
      remainingMillisToExpiration = 6000;
    }
    // refresh the user session 5 seconds before the session
    // is due to expire.
    this.sessionRefreshTimer = setTimeout(async () => {
      try {
        await this.refreshUserSession();
      } catch (error) {}
    }, remainingMillisToExpiration - 5000);
  }

  public refreshUserSession(): Promise<void> {
    return new Promise(async (res, rej) => {
      // ensure that we have credential information set.
      // if it is already set then nothing will change
      await this.setCredentialsConfig();

      if (!this.cognitoUser) {
        rej();
      } else {
        this.userLoaded = false;
        this.cognitoUser.refreshSession(
          this.cognitoSession.getRefreshToken(),
          (err, renewed_session: AWS_Auth.CognitoUserSession) => {
            if (err) {
              // prevent the failure from getting everything stuck
              this.userLoaded = true;
              rej(err);
            } else {
              this.cognitoSession = renewed_session;
              this.userLoaded = true;

              // reset credentials config using new JWT
              this.setCredentialsConfig(
                renewed_session.getIdToken().getJwtToken()
              );

              // schedule new session for renewal
              this.setupSessionRenewal();

              // @ts-ignore
              AWS.config.credentials.refresh(() => {
                res();
              });
            }
          }
        );
      }
    });
  }

  async setCredentialsConfig(jwt?: string) {
    AWS.config.update({
      region: environment.AwsRegion,
    });

    if (!jwt) {
      jwt = await this.getJwtToken();
    }

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: environment.CognitoIdentityPoolId,
      Logins: {
        [environment.CognitoLoginProviderURL]: jwt,
      },
    });
  }

  SetFileBaseDomain() {
    if (this.currentUser.UserSettings.BrandedLinks) {
      let currentHostName = new URL(window.location.href).host;
      let separatedHostName: string[] = currentHostName.split(".");
      const currentProtocol = new URL(window.location.href).protocol;
      let companyName = this.currentUser.CompanyName.replace(/ /g, "_")
        .replace(/\./g, "-")
        .toLowerCase();

      const brandedHostName = `https://${companyName}.slydeck.io`;
      this.currentDomain = brandedHostName;
    } else {
      this.currentDomain = `https://app.slydeck.io`;
    }
  }

  userLogOut() {
    this.cognitoUser.signOut();
    // @ts-ignore
    AWS.config.credentials.clearCachedId();

    this.clearUserCookies();
  }

  private clearUserCookies() {
    localStorage.removeItem(this.cookie_currentUser_name);
  }

  /**
   * Loads user settings for `this.currentUser`
   */
  public async loadUserSettings() {
    const options = {
      headers: new HttpHeaders().append(
        "Authorization",
        await this.getJwtToken()
      ),
    };

    try {
      let userSettings: any = await this.httpClient
        .get(environment.BaseApiUrl + "/user/settings", options)
        .toPromise();

      this.currentUser.UserSettings = userSettings;

      localStorage.setItem(
        this.cookie_currentUser_name,
        JSON.stringify(this.currentUser)
      );
    } catch (error) {}

    this.userLoaded = true;
  }

  /**
   * Gets the newest credentials from AWS.config.credentials
   */
  async getAWSCredentials(): Promise<AWS.Credentials> {
    return await new Promise(res => {
      // @ts-ignore
      AWS.config.credentials.get(() => {
        res(
          new AWS.Credentials({
            accessKeyId: AWS.config.credentials.accessKeyId,
            secretAccessKey: AWS.config.credentials.secretAccessKey,
            sessionToken: AWS.config.credentials.sessionToken
          })
        );
      });
    });
  }
}
