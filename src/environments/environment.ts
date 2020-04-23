/**
 * This file provides the variables needed to work in *local development*
 */
import 'zone.js/dist/zone-error'; // Included with Angular CLI.

import configurationInterface from './configurationInterface';

const envconf: configurationInterface = {
  production: false,
  baseCookieDomain: 'local.io',
  //StripeClient: Stripe('pk_test_hjsPjuvA00y20tdlUR9CHbaY00ahRv6Pef'),

  AwsApiId: 's3stbzwsbb',
  AwsRegion: 'us-west-2',
  CognitoClientId: '4jj60f88fn480d9bf79o08sudo',
  CognitoIdentityPoolId: 'us-west-2:e3d0f830-c17c-4890-bf80-b8b17ad99b41',
  CognitoUserPoolId: 'us-west-2_DwKjsezem',
  OriginalFilesBucketName: 'slydeck-staging-stack-originalfilesbucket-12wtajq2y40sw',
  StageName: 'Staging',
  UnauthWebsocketApiId: '2oq68awmhj',
  UserFilesBucketName: 'slydeck-staging-stack-userfilesbucket-1rrmhb2zzz11x'
};

// @ts-ignore
export const environment: configurationInterface = {
  BaseApiUrl: `https://${envconf.AwsApiId}.execute-api.${envconf.AwsRegion}.amazonaws.com/${envconf.StageName}/`,
  UnauthWebSocketURL: `wss://${envconf.UnauthWebsocketApiId}.execute-api.${envconf.AwsRegion}.amazonaws.com/${envconf.StageName}`,
  CognitoLoginProviderURL: `cognito-idp.${envconf.AwsRegion}.amazonaws.com/${envconf.CognitoUserPoolId}`,
  ...envconf
};
