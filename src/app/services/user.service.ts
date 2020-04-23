import { Injectable } from "@angular/core";
import * as AWS_Auth from "amazon-cognito-identity-js";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root",
})
export class UserService {
  private userPool: AWS_Auth.CognitoUserPool;
  private cognitoUser: AWS_Auth.CognitoUser;
  private cognitoSession: AWS_Auth.CognitoUserSession;

  constructor() {
    this.userPool = new AWS_Auth.CognitoUserPool({
      UserPoolId: environment.CognitoUserPoolId,
      ClientId: environment.CognitoClientId
    });
  }

  userLogIn(email: string, password: string): Promise<any> {

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

          resolve({
            rType: 'success',
            message: '',
            goLogin: false
          });
        },
        onFailure: (err: any) => {
          
          reject({
            rType: 'error',
            message: err.message,
            goLogin: false,
            rCode: err.code
          });
        },
      });
    });
  }
}
