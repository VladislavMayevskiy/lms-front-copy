import type { StripeElementLocale } from "@stripe/stripe-js";

export const getLanguage = () => {
  const language = JSON.parse(localStorage.getItem("lms-local-store") || "{}").language as StripeElementLocale;

  return language || "en";
};