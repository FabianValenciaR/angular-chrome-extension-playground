interface configurationInterface {
  StageName: 'Development' | 'Staging' | 'Production';
  //StripeClient: stripe.Stripe;
  production: boolean;
  baseCookieDomain: string;
  AwsApiId: string;

  AwsRegion: string;
  CognitoClientId: string;
  CognitoIdentityPoolId: string;
  CognitoUserPoolId: string;
  OriginalFilesBucketName: string;
  UnauthWebsocketApiId: string;
  UserFilesBucketName: string;

  BaseApiUrl?: string;
  UnauthWebSocketURL?: string;
  CognitoLoginProviderURL?: string;
}

export default configurationInterface;
