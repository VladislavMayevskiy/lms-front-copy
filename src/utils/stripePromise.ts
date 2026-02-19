import { loadStripe } from "@stripe/stripe-js/pure";
import { getLanguage } from "utils/getLanguage";

loadStripe.setLoadParameters({ advancedFraudSignals: false });

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, { locale: getLanguage() });