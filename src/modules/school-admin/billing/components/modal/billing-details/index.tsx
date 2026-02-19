import {
  ModalBody,
  Input,
  Button,
  Text,
  VStack,
  Box,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Modal from "components/ui/modal";
import { useModalStore } from "stores/modalStore";

import {
  CardElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import { useUpdateSchoolSubscription } from "api/admin/billing/hooks";
import { stripePromise } from "utils/stripePromise";
import { authStore } from "stores/authStore";
import { ToastComponent } from "components/ui/toast";

type UpdateSubscriptionForm = {
  full_name: string;
  email: string;
  country: string;
  city: string;
  street: string;
  postal_code: string;
};


export default function EditBillingDetailModal() {
  const { type, closeModal } = useModalStore ();
  const isOpen = type === "EDIT_BILLING_DETAILS";

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Billing details">
      <Elements stripe={stripePromise}>
        <EditBillingDetailModalContent />
      </Elements>
    </Modal>
  );
}

function EditBillingDetailModalContent() {
  const { closeModal} = useModalStore();
  const { user, hydrated } = authStore();
  const { t } = useTranslation();
  const toast = ToastComponent();

  const stripe = useStripe();
  const elements = useElements();
  if (!hydrated || !user) {
  return null; 
}
  const schoolId = user?.school_id;
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<UpdateSubscriptionForm>({
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

  const { mutateAsync: updateSubscription, isPending } = useUpdateSchoolSubscription(schoolId);

  const getErrorMessage = (err: unknown) => {
    const anyErr = err as any;
    return (
      anyErr?.response?.data?.message ||
      anyErr?.response?.data?.error ||
      anyErr?.message ||
      "Something went wrong"
    );
  };

  const onSubmit = async (formData: UpdateSubscriptionForm) => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
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

    if (error || !paymentMethod) {
      toast(error?.message || "Failed to create payment method");
      return;
    }

    try {
      await updateSubscription({ payment_method: paymentMethod.id });
      toast("Billing details successfully updated");
      closeModal();
    } catch (err) {
      toast(getErrorMessage(err));
    }
  };

  const isSubmitDisabled = !isValid || isPending || !stripe || !elements;

  
  return (
    <ModalBody as="form" onSubmit={handleSubmit(onSubmit)} mt="8px" className="max-sm:p-0!">
      <VStack align="stretch" spacing="16px">
        <Text fontFamily="Lato" fontSize="16px" fontWeight="700">
          {t("user.billing.activateModal.personalInformation")}
        </Text>

        <Box className="flex flex-col md:flex-row gap-4 md:gap-8">
          <Controller
            control={control}
            name="full_name"
            rules={{ required: true }}
            render={({ field }) => (
              <VStack align="stretch" spacing="4px" w={'100%'}>
                <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                  {t("general.labels.fullname", { required: "*" })}
                </Text>
                <Input
                  {...field}
                  placeholder={t("general.placeholders.fullname")}
                  h="44px"
                  fontFamily="Lato"
                  borderRadius="10px"
                  fontSize="14px"
                  borderWidth="1px"
                  className="w-full md:w-[300px]"
                  bgColor="#F5F7F9"
                  borderColor="#B4D6DF"
                  _placeholder={{ color: "#0070C1" }}
                />
              </VStack>
            )}
          />

          <Controller
            control={control}
            name="email"
            rules={{ required: true }}
            render={({ field }) => (
              <VStack align="stretch" spacing="4px" w={'100%'}>
                <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                  {t("general.labels.email", { required: "*" })}
                </Text>
                <Input
                  {...field}
                  placeholder={t("general.placeholders.email")}
                  h="44px"
                  fontFamily="Lato"
                  borderRadius="10px"
                  fontSize="14px"
                  borderWidth="1px"
                  className="w-full md:w-[300px]"
                  bgColor="#F5F7F9"
                  borderColor="#B4D6DF"
                  _placeholder={{ color: "#0070C1" }}
                />
              </VStack>
            )}
          />
        </Box>

        <Text fontFamily="Lato" fontSize="16px" fontWeight="700">
          {t("user.billing.activateModal.billingAddress")}
        </Text>

        <Box className="flex flex-col md:flex-row gap-4 md:gap-8">
          <Controller
            control={control}
            name="country"
            rules={{ required: true }}
            render={({ field }) => (
              <VStack align="stretch" spacing="4px" w={'100%'}>
                <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                  {t("general.labels.country", { required: "*" })}
                </Text>
                <Input
                  {...field}
                  placeholder={t("general.placeholders.country")}
                  h="44px"
                  fontFamily="Lato"
                  borderRadius="10px"
                  fontSize="14px"
                  borderWidth="1px"
                  className="w-full md:w-[300px]"
                  bgColor="#F5F7F9"
                  borderColor="#B4D6DF"
                  _placeholder={{ color: "#0070C1" }}
                />
              </VStack>
            )}
          />

          <Controller
            control={control}
            name="city"
            rules={{ required: true }}
            render={({ field }) => (
              <VStack align="stretch" spacing="4px" w={'100%'}>
                <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                  {t("general.labels.city", { required: "*" })}
                </Text>
                <Input
                  {...field}
                  placeholder={t("general.placeholders.city")}
                  h="44px"
                  fontFamily="Lato"
                  borderRadius="10px"
                  fontSize="14px"
                  borderWidth="1px"
                  className="w-full md:w-[300px]"
                  bgColor="#F5F7F9"
                  borderColor="#B4D6DF"
                  _placeholder={{ color: "#0070C1" }}
                />
              </VStack>
            )}
          />
        </Box>

        <Box className="flex flex-col md:flex-row gap-4 md:gap-8">
          <Controller
            control={control}
            name="street"
            rules={{ required: true }}
            render={({ field }) => (
              <VStack align="stretch" spacing="4px" w={'100%'}>
                <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                  {t("general.labels.street", { required: "*" })}
                </Text>
                <Input
                  {...field}
                  placeholder={t("general.placeholders.street")}
                  h="44px"
                  fontFamily="Lato"
                  borderRadius="10px"
                  fontSize="14px"
                  borderWidth="1px"
                  className="w-full md:w-[300px]"
                  bgColor="#F5F7F9"
                  borderColor="#B4D6DF"
                  _placeholder={{ color: "#0070C1" }}
                />
              </VStack>
            )}
          />

          <Controller
            control={control}
            name="postal_code"
            rules={{ required: true }}
            render={({ field }) => (
              <VStack align="stretch" spacing="4px" w={'100%'}>
                <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                  {t("general.labels.postalCode", { required: "*" })}
                </Text>
                <Input
                  {...field}
                  placeholder={t("general.placeholders.postalCode")}
                  h="44px"
                  fontFamily="Lato"
                  borderRadius="10px"
                  fontSize="14px"
                  borderWidth="1px"
                  className="w-full md:w-[300px]"
                  bgColor="#F5F7F9"
                  borderColor="#B4D6DF"
                  _placeholder={{ color: "#0070C1" }}
                />
              </VStack>
            )}
          />
        </Box>

        <Text fontFamily="Lato" fontSize="16px" fontWeight="700">
          {t("user.billing.activateModal.cardDetails")}
        </Text>

        <Box
          p="12px"
          border="1px solid"
          borderColor="#B4D6DF"
          borderRadius="10px"
          bg="#F5F7F9"
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "14px",
                  fontFamily: "Lato, sans-serif",
                  color: "#100B20",
                  "::placeholder": { color: "#0070C1" },
                },
              },
            }}
          />
        </Box>

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
            bg="#0070C1"
            color="white"
            isLoading={isPending}
            loadingText={t("general.saving")}
            isDisabled={isSubmitDisabled}
          >
            {t("general.saveChanges")}
          </Button>
        </Box>
      </VStack>
    </ModalBody>
  );
}