import {
  ModalBody,
  Input,
  Button,
  Box,
  Text,
  VStack,
  Spinner,
  Select,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { COUNTRIES } from "utils/countries";

import Modal from "components/ui/modal";
import { useModalStore } from "stores/modalStore";
import { authStore } from "stores/authStore";
import type { CreateInvoiceSubscriptionPayload } from "api/admin/billing/types";
import { useCreateSchoolSubscription } from "api/admin/billing/hooks";
import { ToastComponent } from "components/ui/toast";

type InvoiceForm = {
  full_name: string;
  email: string;
  country: string;
  city: string;
  street: string;
  postal_code: string;
};

export default function ActivateInvoiceSubscriptionModal() {
  const { type, closeModal } = useModalStore();
  const { t } = useTranslation();
  const toast = ToastComponent();
  const isOpen = type === "ACTIVATE_INVOICE_SUBSCRIPTION";

  const { user, hydrated } = authStore();
  const schoolId = user?.school_id;

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<InvoiceForm>({
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

  const canRequest = hydrated && typeof schoolId === "number";
  const { mutateAsync, isPending } =
    useCreateSchoolSubscription(canRequest ? schoolId! : 0);

  const getErrorMessage = (err: unknown) => {
    const anyErr = err as any;
    return (
      anyErr?.response?.data?.message ||
      anyErr?.response?.data?.error ||
      anyErr?.message ||
      "Something went wrong"
    );
  };

const onSubmit = async (data: InvoiceForm) => {
  if (!canRequest) return;

  const payload: CreateInvoiceSubscriptionPayload = {
    subscription_type: 1,
    billing_details: {
      name: data.full_name,
      email: data.email,
    },
    billing_address: {
      country: data.country,
      city: data.city,
      line1: data.street,
      postal_code: data.postal_code,
    },
  };

  try {
    await mutateAsync(payload);
    toast("Invoice subscription successfully activated");
    closeModal();
  } catch (error) {
    toast(getErrorMessage(error));
  }
};


  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("user.billing.activateInvoice", "Activate invoice subscription")}
    >
      {!hydrated ? (
        <ModalBody>
          <Spinner />
        </ModalBody>
      ) : (
        <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack align="stretch" spacing="16px">
            <Text fontSize="14px" color="gray.600">
              Invoices will be issued using the billing details below.
            </Text>

            {(["full_name", "email", "city", "street", "postal_code"] as const).map((name) => {
              const labelMap: Record<string, string> = {
                full_name: t("general.labels.fullname", "Full name"),
                email: t("general.labels.email", "Email"),
                city: t("general.labels.city", "City"),
                street: t("general.labels.street", "Street"),
                postal_code: t("general.labels.postalCode", "Postal code"),
              };
              return (
                <Controller
                  key={name}
                  control={control}
                  name={name}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Box>
                      <Text fontSize="14px" fontWeight="bold">
                        {labelMap[name]} *
                      </Text>
                      <Input
                        {...field}
                        h="44px"
                        borderRadius="10px"
                        bg="#F5F7F9"
                        borderColor="#B4D6DF"
                      />
                    </Box>
                  )}
                />
              );
            })}

            <Controller
              control={control}
              name="country"
              rules={{ required: true }}
              render={({ field }) => (
                <Box>
                  <Text fontSize="14px" fontWeight="bold">
                    {t("general.labels.country", "Country")} *
                  </Text>
                  <Select
                    {...field}
                    placeholder={t("general.placeholders.country", "Select country")}
                    h="44px"
                    borderRadius="10px"
                    bg="#F5F7F9"
                    borderColor="#B4D6DF"
                    color="#434645"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </Box>
              )}
            />

            <Box className="flex gap-4 justify-end">
              <Button
                onClick={closeModal}
                variant="outline"
                h="44px"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                h="44px"
                bg="#0070C1"
                color="white"
                isLoading={isPending}
                isDisabled={!isValid}
              >
                Activate
              </Button>
            </Box>
          </VStack>
        </ModalBody>
      )}
    </Modal>
  );
}
