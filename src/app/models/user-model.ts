import { UserSettings } from './user-settings';
import { PricingPlan } from './pricing-plan';

export class UserModel {
  public CognitoId: string;
  public FullName: string;
  public PhoneNumber: string;
  public Email: string;
  public Password: string;
  public CompanyName: string;
  public UserSettings: UserSettings;
  public PricingPlan: PricingPlan;

  constructor() {
    this.CognitoId = '';
    this.FullName = '';
    this.PhoneNumber = '';
    this.Email = '';
    this.Password = '';
    this.CompanyName = '';
    this.UserSettings = new UserSettings();
    this.PricingPlan = new PricingPlan();
  }
}
