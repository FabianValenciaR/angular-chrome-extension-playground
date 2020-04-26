import { UserSettings } from '../models/user-settings';

interface OwnerInterface {
  FullName: string;
  PhoneNumber: string;
  Email: string;
  CompanyName: string;
  Settings: UserSettings;
}

export class OwnerModel implements OwnerInterface {
  public FullName: string;
  public PhoneNumber: string;
  public Email: string;
  public CompanyName: string;
  public Settings: UserSettings;

  constructor() {
    this.FullName = '';
    this.PhoneNumber = '';
    this.Email = '';
    this.CompanyName = '';
    this.Settings = new UserSettings();
  }
}
