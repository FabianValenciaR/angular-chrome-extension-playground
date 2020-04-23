export class UserSettings {
  public hasSeenOnboarding: boolean;
  public StripeCustomerId: string;
  public NotifyOnOpen: boolean;
  public NotifyOnPageViews: boolean;
  public NotifyOnLinkClicks: boolean;
  public NotifyShare: boolean;
  public LinksDoNotExpire: boolean;
  public ExpirationDays: number;
  public BrandedLinks: boolean;
  public BrandedLogo: boolean;
  public LinkToWebSite: string;
  public CustomLogoKey: string;

  constructor() {
    // return a user settings instance with
    // the default value

    this.StripeCustomerId = '';

    this.hasSeenOnboarding = false;

    this.NotifyOnOpen = true;
    this.NotifyShare = true;
    this.NotifyOnPageViews = false;
    this.NotifyOnLinkClicks = false;

    this.BrandedLinks = false;
    this.BrandedLogo = false;
    this.LinksDoNotExpire = true;

    this.LinkToWebSite = '';
    this.CustomLogoKey = '';
    this.ExpirationDays = 0;
  }
}
