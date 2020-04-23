import { PricingPlanRestrictions } from './pricing-plan-restrictions';

export class PricingPlan {
  public PlanId: string;
  public Nickname: string;
  public PricingPlanRestrictions: PricingPlanRestrictions;

  constructor() {
    this.PlanId = 'free';
    this.Nickname = 'Free plan';
    this.PricingPlanRestrictions = new PricingPlanRestrictions();
  }
}
