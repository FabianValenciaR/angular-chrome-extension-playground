interface SendEmailRequestInterface {
  Subject: string;
  TextBody: string;
  ReceiverAddresses: string[];
}

export class SendEmailRequestModel implements SendEmailRequestInterface {
  public Subject: string;
  public TextBody: string;
  public ReceiverAddresses: string[];

  constructor() {
    this.Subject = '';
    this.TextBody = '';
    this.ReceiverAddresses = [];
  }
}
