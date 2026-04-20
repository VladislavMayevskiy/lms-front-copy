import {
  ModalBody,
  Button,
  Box,
  Text,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "components/ui/modal";
import { useModalStore  } from "stores/modalStore";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import { useUpdateSchoolSubscription } from "api/admin/billing/hooks";
import { stripePromise } from "utils/stripePromise";
import { authStore } from "stores/authStore";
import { ToastComponent } from "components/ui/toast";

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

function StripeField({ label, children }: any) {
  return (
    <VStack align="stretch" spacing="4px">
      <Text fontSize="14px" fontWeight="bold">
        {label}
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
};

export default function EditCardDetailsModal() {
  const { type, closeModal } = useModalStore ();
  const isOpen = type === "EDIT_CARD_DETAILS";

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Card details">
      <Elements stripe={stripePromise}>
        <EditCardDetailsModalContent />
      </Elements>
    </Modal>
  );
}

function EditCardDetailsModalContent() {
  const { closeModal } = useModalStore ();
  const { t } = useTranslation();
  const toast = ToastComponent();
  const { user, hydrated } = authStore();
  if (!hydrated || !user) {
    return null;
  }

  const schoolId = user.school_id;
  if (schoolId == null || schoolId <= 0) {
    return null;
  }

  const stripe = useStripe();
  const elements = useElements();

  const { mutateAsync: updateSubscription, isPending } = useUpdateSchoolSubscription(schoolId);

  const [stripeError, setStripeError] = useState<string | null>(null);

  const [complete, setComplete] = useState({
    number: false,
    exp: false,
    cvc: false,
  });

  const canSubmit = complete.number && complete.exp && complete.cvc;

  const getErrorMessage = (err: unknown) => {
    const anyErr = err as any;
    return (
      anyErr?.response?.data?.message ||
      anyErr?.response?.data?.error ||
      anyErr?.message ||
      "Something went wrong"
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStripeError(null);

    if (!stripe || !elements) return;

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) return;

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumber,
    });

    if (error || !paymentMethod) {
      const errorMsg = error?.message ?? t("general.paymentError");
      setStripeError(errorMsg);
      toast(errorMsg);
      return;
    }

    try {
      await updateSubscription({ payment_method: paymentMethod.id });
      toast("Card details successfully updated");
      closeModal();
    } catch (err) {
      toast(getErrorMessage(err));
    }
  };

  const isDisabled = !canSubmit || isPending || !stripe || !elements;

  return (
    <ModalBody as="form" onSubmit={onSubmit} mt="8px">
      <VStack align="stretch" spacing="16px">
        <Text fontFamily="Lato" fontSize="16px" fontWeight="700">
          {t("user.billing.activateModal.cardDetails")}
        </Text>

        <SimpleGrid spacingX="32px" spacingY="16px" className="grid-cols-1 md:grid-cols-2">
          <StripeField label={t("general.labels.cardNumber", { required: "*" })}>
            <CardNumberElement
              options={stripeElementOptions}
              onChange={(e) => {
                setComplete((s) => ({ ...s, number: e.complete }));
                setStripeError(e.error?.message ?? null);
              }}
            />
          </StripeField>


          <StripeField label={t("general.labels.expirationDate", { required: "*" })}>
            <CardExpiryElement
              options={stripeElementOptions}
              onChange={(e) => {
                setComplete((s) => ({ ...s, exp: e.complete }));
                setStripeError(e.error?.message ?? null);
              }}
            />
          </StripeField>

          <StripeField label={t("general.labels.cvv", { required: "*" })}>
            <CardCvcElement
              options={stripeElementOptions}
              onChange={(e) => {
                setComplete((s) => ({ ...s, cvc: e.complete }));
                setStripeError(e.error?.message ?? null);
              }}
            />
          </StripeField>
        </SimpleGrid>

        {stripeError ? (
          <Text fontSize="12px" color="red.500">
            {stripeError}
          </Text>
        ) : null}

        <Box className="flex flex-col md:flex-row justify-center gap-4">
          <Button
            onClick={closeModal}
            _hover={{ bgColor: "#F5F7F9" }}
            bgColor="white"
            borderWidth="1px"
            borderColor="#434645"
            fontFamily="Lato"
            borderRadius="10px"
            className="full md:w-[150px]"
            h="48px"
          >
            {t("general.cancel")}
          </Button>

          <Button
            type="submit"
            className="full md:w-[190px]"
            h="48px"
            borderRadius="10px"
            fontFamily="Lato"
            bg="var(--brand-primary, #0070C1)"
            _hover={{ bg: "var(--brand-primary, #0070C1)" }}
            color="white"
            isLoading={isPending}
            loadingText={t("general.saving")}
            isDisabled={isDisabled}
          >
            {t("general.saveChanges")}
          </Button>
        </Box>
      </VStack>
    </ModalBody>
  );
}