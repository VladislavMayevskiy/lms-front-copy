
export type CreateStripeSubscriptionPayload = {
  payment_method: string;
};

export type CreateSubscriptionResponse = {
  checkout_url: string;
};

export type CreateInvoiceSubscriptionPayload = {
  subscription_type: 1;
  billing_details: {
    name: string;
    email: string;
  };
  billing_address: {
    country: string;
    city: string;
    line1: string;
    postal_code: string;
  };
};

export type InvoiceStatus =
  | "paid"
  | "void"


export type InvoiceType = {
  created: number;
  currency: string;
  total: number;
  status: InvoiceStatus
  number: string;
  invoice_pdf: string;
};

export type BillingPayload = {
  subscription: {
    is_active: boolean;
    price: number;
    currency: string;
    next_billing_date: string | null;
    latest_billing_date: string | null;
  };
  payment_method: null | {
    type: "card";
    card: {
      brand: "visa" | "mastercard" | "amex" | string;
      last4: string;
      exp_month: number;
      exp_year: number;
      wallet: string | null;
    };
    billing_address: {
      city: string | null;
      country: string | null;
      line1: string | null;
      line2: string | null;
      postal_code: string | null;
      state: string | null;
    };
  };
};

export type BillingResponse = {
  data: BillingPayload
}

export type InvoiceResponse = {
  data: InvoiceType[];
}


export type CreateSubscriptionPayload =
  | CreateStripeSubscriptionPayload
  | CreateInvoiceSubscriptionPayload;