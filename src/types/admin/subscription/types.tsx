export const SubscriptionType = {
  INVOICE: 1,
  STRIPE: 2,
} as const;

export type SubscriptionTypeValue = (typeof SubscriptionType)[keyof typeof SubscriptionType];