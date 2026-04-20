import React, { useState } from "react";
import {
  ModalBody,
  Button,
  Box,
  Text,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Modal from "components/ui/modal";
import { useModalStore } from "stores/modalStore";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";
import { stripePromise } from "utils/stripePromise";
import { usePurchaseCourse } from "api/user/courses/hooks";

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

function StripeField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
}

export default function PurchaseCourseModal() {
  const { type, closeModal } = useModalStore();
  const isOpen = type === "PURCHASE_COURSE";

  const { id } = useParams<{ id: string }>();
  const numericCourseId = Number(id);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Purchase course">
      <Elements stripe={stripePromise}>
        <PurchaseCourseModalContent
          courseId={numericCourseId}
          onClose={closeModal}
        />
      </Elements>
    </Modal>
  );
}

function PurchaseCourseModalContent({
  courseId,
  onClose,
}: {
  courseId: number;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();

  const { mutateAsync: purchaseCourse, isPending } = usePurchaseCourse(courseId);

  const [stripeError, setStripeError] = useState<string | null>(null);

  const [complete, setComplete] = useState({
    number: false,
    exp: false,
    cvc: false,
  });

  const canSubmit =
    complete.number &&
    complete.exp &&
    complete.cvc &&
    Number.isFinite(courseId) &&
    courseId > 0;

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
      setStripeError(error?.message ?? t("general.paymentError"));
      return;
    }

    try {
      await purchaseCourse({ payment_method: paymentMethod.id });
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        t("general.purchaseFailed");
      setStripeError(message);
    }
  };

  const isDisabled = !canSubmit || isPending || !stripe || !elements;

  return (
    <ModalBody as="form" onSubmit={onSubmit} mt="8px">
      <VStack align="stretch" spacing="16px">
        <Text fontFamily="Lato" fontSize="16px" fontWeight="700">
          {t("user.courses.modal.cardDetails")}
        </Text>

        {!Number.isFinite(courseId) || courseId <= 0 ? (
          <Text fontSize="12px" color="red.500">
            {t("user.courses.modal.invalidCourseId")}
          </Text>
        ) : null}

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

          <StripeField label={t("general.labels.cardHolder")}>
            <Text fontFamily="Lato" fontSize="14px" color="var(--brand-primary, #0070C1)">
              {t("general.placeholders.notRequired")}
            </Text>
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
            onClick={onClose}
            _hover={{ bgColor: "#F5F7F9" }}
            bgColor="white"
            borderWidth="1px"
            borderColor="#434645"
            fontFamily="Lato"
            borderRadius="10px"
            className="full md:w-[150px]"
            h="48px"
            type="button"
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
            loadingText={t("general.purchasing")}
            isDisabled={isDisabled}
          >
            {t("general.purchase")}
          </Button>
        </Box>
      </VStack>
    </ModalBody>
  );
}
