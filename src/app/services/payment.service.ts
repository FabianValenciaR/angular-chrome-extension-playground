import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { PricingPlan } from '../models/pricing-plan';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  public stripeSession: any;
  public availablePlans: any[];

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.availablePlans = new Array<any>();
  }

  async RetrieveCustomer(): Promise<void> {
    const token = await this.userService.getJwtToken();

    const options = {
      headers: new HttpHeaders()
        .append('Access-Control-Allow-Origin', '*')
        .append('Authorization', token)
    };

    try {
      let data = await this.http
        .get(`${environment.BaseApiUrl}/payment/auth/customer`, options)
        .toPromise();

      this.userService.currentUser.UserSettings.StripeCustomerId = data['id'];

      if (data['subscriptions'].data['length'] > 0) {
        if (data['subscriptions'].data[0].items.data[0].plan !== undefined) {
          this.userService.currentUser.PricingPlan.PlanId =
            data['subscriptions'].data[0].items.data[0].plan.id;

          this.userService.currentUser.PricingPlan.Nickname =
            data['subscriptions'].data[0].items.data[0].plan.nickname;
          this.userService.currentUser.PricingPlan.PricingPlanRestrictions.FileLimit =
            data['subscriptions'].data[0].items.data[0].plan.metadata['file-limit'];
        }
      } else {
        this.userService.currentUser.PricingPlan = new PricingPlan();
      }

    } catch (err) {
      throw err;
    }
  }
}
