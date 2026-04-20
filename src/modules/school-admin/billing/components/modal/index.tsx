import {
  ModalBody,
  Input,
  Button,
  Box,
  Text,
  VStack,
  SimpleGrid,
  Spinner,
  Select,
} from "@chakra-ui/react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Modal from "components/ui/modal";
import { COUNTRIES } from "utils/countries";

import { useModalStore } from "stores/modalStore";
import { authStore } from "stores/authStore";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import { stripePromise } from "utils/stripePromise";

import { useCreateSchoolSubscription } from "api/admin/billing/hooks";
import { useGetSchoolById } from "api/admin/schools/hooks";

type ActivateSubscriptionForm = {
  full_name: string;
  email: string;
  country: string;
  city: string;
  street: string;
  postal_code: string;
};

export const SubscriptionType = {
  INVOICE: 1,
  STRIPE: 2,
} as const;

const stripeElementOptions = {
  style: {
    base: {
      fontSize: "14px",
      fontFamily: "Lato, sans-serif",
      color: "#434645",
      "::placeholder": { color: "var(--brand-primary, #0070C1)" },
    },
  },
};

const cleanRequired = (s: string) => s.replace(/\{\{\s*required\s*\}\}/g, "").trim();

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
      {children}
    </Text>
  );
}

function TextField({
  label,
  required,
  placeholder,
  control,
  name,
}: {
  label: string;
  required?: boolean;
  placeholder: string;
  control: any;
  name: keyof ActivateSubscriptionForm;
}) {
  const safeLabel = cleanRequired(label);

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: Boolean(required) }}
      render={({ field }) => (
        <VStack align="stretch" spacing="4px" w="100%">
          <FieldLabel>
            {safeLabel}
            {required ? "*" : ""}
          </FieldLabel>

          <Input
            {...field}
            placeholder={placeholder}
            h="44px"
            fontFamily="Lato"
            borderRadius="10px"
            fontSize="14px"
            borderWidth="1px"
            bgColor="#F5F7F9"
            borderColor="#B4D6DF"
            _placeholder={{ color: "var(--brand-primary, #0070C1)" }}
          />
        </VStack>
      )}
    />
  );
}

function StripeField({ label, children }: { label: string; children: React.ReactNode }) {
  const safeLabel = cleanRequired(label);

  return (
    <VStack align="stretch" spacing="4px">
      <Text fontSize="14px" fontWeight="bold">
        {safeLabel}
      </Text>

      <Box
        minH="44px"
        px="12px"
        py="14px"
        borderRadius="10px"
        borderWidth="1px"
        borderColor="#B4D6DF"
        bg="#F5F7F9"
      >
        {children}
      </Box>
    </VStack>
  );
}

function useActivateForm() {
  return useForm<ActivateSubscriptionForm>({
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      country: "",
      city: "",
      street: "",
      postal_code: "",
    },
  });
}

export default function ActivateSubscriptionModal() {
  const { type, payload, closeModal } = useModalStore();
  const { t } = useTranslation();
  const { user, hydrated } = authStore();

  const isOpen = type === "ACTIVATE_SUBSCRIPTION";

  const schoolId = (payload?.schoolId ?? user?.school_id) as number | undefined;

  const canFetchSchool = Boolean(isOpen && hydrated && typeof schoolId === "number" && schoolId > 0);
  const { data: schoolResponse, isLoading } = useGetSchoolById(canFetchSchool ? schoolId! : 0);

  if (!isOpen) return null;

  const school = (schoolResponse as any)?.data ?? schoolResponse;
  const subscriptionTypeRaw = school?.subscription_type;
  const subscriptionType = Number(subscriptionTypeRaw);

  const isStripe = subscriptionType === SubscriptionType.STRIPE;
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("user.billing.activateModal.title", "Activate subscription")}
    >
      {!hydrated || isLoading ? (
        <ModalBody>
          <Spinner />
        </ModalBody>
      ) : !schoolId ? (
        <ModalBody>
          <Text>School is not assigned to this user.</Text>
        </ModalBody>
      ) : isStripe ? (
        <Elements stripe={stripePromise}>
          <StripeActivateContent schoolId={schoolId} />
        </Elements>
      ) : (
        <ModalBody>
          <Text>Unknown subscription type.</Text>
        </ModalBody>
      )}
    </Modal>
  );
}


function StripeActivateContent({ schoolId }: { schoolId: number }) {
  const { closeModal } = useModalStore();
  const { t } = useTranslation();

  const stripe = useStripe();
  const elements = useElements();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useActivateForm();

  const { mutateAsync: createSubscription, isPending } = useCreateSchoolSubscription(schoolId);

  const onSubmit = async (formData: ActivateSubscriptionForm) => {
    if (!stripe || !elements) return;

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) return;

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumber,
      billing_details: {
        name: formData.full_name,
        email: formData.email,
        address: {
          country: formData.country,
          city: formData.city,
          line1: formData.street,
          postal_code: formData.postal_code,
        },
      },
    });

    if (error || !paymentMethod) return;

    const payload = {
      payment_method: paymentMethod.id,
      billing_details: { name: formData.full_name, email: formData.email },
      billing_address: {
        country: formData.country,
        city: formData.city,
        line1: formData.street,
        postal_code: formData.postal_code,
      },
      subscription_type: SubscriptionType.STRIPE,
    };

    await createSubscription(payload as any);
    closeModal();
  };

  return (
    <ModalBody as="form" onSubmit={handleSubmit(onSubmit)} mt="8px">
      <VStack align="stretch" spacing="16px">
        <Text fontFamily="Lato" fontSize="16px" fontWeight="700">
          {t("user.billing.activateModal.personalInformation", "Personal information")}
        </Text>

        <Box className="flex flex-col md:flex-row gap-4 md:gap-8">
          <TextField
            control={control}
            name="full_name"
            label={t("general.labels.fullname", "Full name")}
            required
            placeholder={t("general.placeholders.fullname", "Enter full name")}
          />
          <TextField
            control={control}
            name="email"
            label={t("general.labels.email", "Email")}
            required
            placeholder={t("general.placeholders.email", "Enter email")}
          />
        </Box>

        <Text fontFamily="Lato" fontSize="16px" fontWeight="700">
          {t("user.billing.activateModal.billingAddress", "Billing address")}
        </Text>

        <Box className="flex flex-col md:flex-row gap-4 md:gap-8">
          <Controller
            control={control}
            name="country"
            rules={{ required: true }}
            render={({ field }) => (
              <VStack align="stretch" spacing="4px" w="100%">
                <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                  {cleanRequired(t("general.labels.country", "Country"))}*
                </Text>
                <Select
                  {...field}
                  placeholder={t("general.placeholders.country", "Select country")}
                  h="44px"
                  fontFamily="Lato"
                  borderRadius="10px"
                  fontSize="14px"
                  borderWidth="1px"
                  bgColor="#F5F7F9"
                  borderColor="#B4D6DF"
                  color="#434645"
                  _placeholder={{ color: "var(--brand-primary, #0070C1)" }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </VStack>
            )}
          />
          <TextField
            control={control}
            name="city"
            label={t("general.labels.city", "City")}
            required
            placeholder={t("general.placeholders.city", "City")}
          />
        </Box>

        <Box className="flex flex-col md:flex-row gap-4 md:gap-8">
          <TextField
            control={control}
            name="street"
            label={t("general.labels.street", "Street")}
            required
            placeholder={t("general.placeholders.street", "Street")}
          />
          <TextField
            control={control}
            name="postal_code"
            label={t("general.labels.postalCode", "Postal code")}
            required
            placeholder={t("general.placeholders.postalCode", "Postal code")}
          />
        </Box>

        <Text fontFamily="Lato" fontSize="16px" fontWeight="700">
          {t("user.billing.activateModal.cardDetails", "Card details")}
        </Text>

        <SimpleGrid spacingX="32px" spacingY="16px" className="grid-cols-1 md:grid-cols-2">
          <StripeField label={t("general.labels.cardNumber", "Card number")}>
            <CardNumberElement options={stripeElementOptions} />
          </StripeField>

          <StripeField label={t("general.labels.expirationDate", "Expiration date (MM/YY)")}>
            <CardExpiryElement options={stripeElementOptions} />
          </StripeField>

          <StripeField label={t("general.labels.cvv", "CVV/CVC")}>
            <CardCvcElement options={stripeElementOptions} />
          </StripeField>
        </SimpleGrid>

        <Box className="flex flex-col md:flex-row justify-center gap-4">
          <Button
            onClick={closeModal}
            bgColor="white"
            borderWidth="1px"
            borderColor="#434645"
            borderRadius="10px"
            h="48px"
          >
            {t("general.cancel", "Cancel")}
          </Button>

          <Button
            type="submit"
            h="48px"
            borderRadius="10px"
            fontFamily="Lato"
            bg="var(--brand-primary, #0070C1)"
            _hover={{ bg: "var(--brand-primary, #0070C1)" }}
            color="white"
            isLoading={isPending}
            isDisabled={!isValid || isPending || !stripe || !elements}
          >
            {t("user.billing.activateModal.confirm", "Confirm")}
          </Button>
        </Box>
      </VStack>
    </ModalBody>
  );
}
