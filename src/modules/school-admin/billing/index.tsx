import { useMemo } from "react";
import {
  Box,
  Button,
  Text,
  SimpleGrid,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { authStore } from "stores/authStore";

import { useGetSchoolById } from "api/admin/schools/hooks";
import { useGetSchoolBilling, useGetSchoolInvoice } from "api/admin/billing/hooks";

import { AdminLayout } from "components/ui/layouts/admin";
import { useModalStore } from "stores/modalStore";
import { Spinner } from "components/ui/spinner";

import DateIcon from "assets/imgs/user/heroicons-outline/Vector.svg?react";
import VisaIcon from "assets/imgs/user/heroicons-outline/visa.svg?react";
import MasterIcon from "assets/imgs/user/heroicons-outline/mastercard.svg?react";

import ActivateSubscriptionModal from "./components/modal";
import CancelSubscriptionModal from "./components/modal/delete";
import EditBillingDetailModal from "./components/modal/billing-details";
import EditCardDetailsModal from "./components/modal/card-details";
import ActivateInvoiceSubscriptionModal from "./components/modal/invoice";

import { BillingColumns } from "./constants/billingTable";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

export const formatBillingDate = (date?: string | null, locale: string = "en-US"): string => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(d);
};

export const SubscriptionType = {
  INVOICE: 1,
  STRIPE: 2,
} as const;

type SubscriptionTypeValue = (typeof SubscriptionType)[keyof typeof SubscriptionType];

function AdminBilling() {
  const { t, i18n } = useTranslation();
  const { openModal } = useModalStore();
  const { user, hydrated } = authStore();

  const schoolId = user?.school_id;

  const {
    data: schoolResponse,
    isLoading: isSchoolLoading,
    isError: isSchoolError,
  } = useGetSchoolById(schoolId as number);

  const { data: schoolBilling, isLoading: isBillingLoading } = useGetSchoolBilling(schoolId as number);
  const { data: invoiceResponse, isLoading: isInvoiceLoading } = useGetSchoolInvoice(schoolId as number);

  const school = (schoolResponse as any)?.data ?? schoolResponse;
  const billing = (schoolBilling as any)?.data?.data ?? (schoolBilling as any)?.data ?? schoolBilling;

  const subscription = billing?.subscription;
  const paymentMethod = billing?.payment_method;

  const subscriptionType: SubscriptionTypeValue | undefined = school?.subscription_type;
  const isStripe = subscriptionType === SubscriptionType.STRIPE;
  const isInvoice = subscriptionType === SubscriptionType.INVOICE;

  const isActive =
    subscription?.is_active === true ||
    school?.subscription_active === true ||
    (user as any)?.is_subscribed === true;

  const priceText =
    typeof subscription?.price === "number"
      ? new Intl.NumberFormat(i18n.language || "en-US", {
          style: "currency",
          currency: String(subscription?.currency || "GBP").toUpperCase(),
        }).format(subscription.price / 100)
      : "—";

  const isPageLoading = !hydrated || isSchoolLoading || isBillingLoading || isInvoiceLoading;

  const subscriptionTypeLabel = isStripe
    ? t("user.billing.stripe", "Stripe")
    : isInvoice
      ? t("user.billing.invoice", "Invoice")
      : "—";

  const invoices = Array.isArray(invoiceResponse?.data) ? invoiceResponse.data : [];
  const columns = useMemo(() => BillingColumns(t), [t]);

  const table = useReactTable({
    data: invoices,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const billingAddress = paymentMethod?.billing_address;
  const card = paymentMethod?.card;

  const billingAddressText = billingAddress
    ? [
        billingAddress.line1,
        billingAddress.line2,
        billingAddress.city,
        billingAddress.postal_code,
        billingAddress.country,
      ]
        .filter((v): v is string => Boolean(v && v.trim()))
        .join(", ")
    : "—";

  const canCancel = isStripe && isActive;
  const canActivateStripe = isStripe && !isActive;

  if (!schoolId) {
    return (
      <AdminLayout>
        <Text>School is not assigned</Text>
      </AdminLayout>
    );
  }

  if (!isPageLoading && !isSchoolError && school && isInvoice) {
    return (
      <AdminLayout>
        <ActivateSubscriptionModal />
        <CancelSubscriptionModal />
        <EditCardDetailsModal />
        <ActivateInvoiceSubscriptionModal />
        <EditBillingDetailModal />

        <VStack align="stretch" spacing="24px" mt="10px">
          <Box
            w="100%"
            fontFamily="Lato"
            className="flex md:flex-row flex-col justify-between gap-2.5"
          >
            <Text fontSize="20px" fontWeight="bold">
              {t("user.billing.title", "Billing")}
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="24px" fontFamily="Lato">
            <Box
              minH="139px"
              gap="12px"
              borderRadius="8px"
              borderColor="#C7C7C7"
              borderWidth="1px"
              className="px-4 py-5 md:px-6 md:py-10"
            >
              <Box className="flex md:flex-row flex-col justify-between gap-2.5">
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Text fontWeight="bold" fontSize="18px">
                      {t("user.billing.monthly", "Monthly")}
                    </Text>

                    <Box
                      textColor="white"
                      fontSize="14px"
                      h="28px"
                      borderRadius="6px"
                      px="12px"
                      py="4px"
                      bgColor={isActive ? "#76B16B" : "#FF383C"}
                    >
                      {isActive
                        ? t("user.billing.active", "Active")
                        : t("user.billing.inactive", "Inactive")}
                    </Box>

                    <Box
                      textColor="white"
                      fontSize="14px"
                      h="28px"
                      borderRadius="6px"
                      px="12px"
                      py="4px"
                      bgColor={"#0070C1"}
                    >
                      {subscriptionTypeLabel}
                    </Box>
                  </HStack>

                  <Text fontSize="14px" color="gray.500">
                    {t("user.billing.subscriptionDescription", "Subscription plan")}
                  </Text>
                </VStack>

                <Text fontSize="24px" fontWeight="bold">
                  {isActive ? priceText : "—"}
                  <Text as="span" fontWeight="light" fontSize="16px">
                    {" "}
                    / {t("user.billing.month", "month")}
                  </Text>
                </Text>
              </Box>
            </Box>
          </SimpleGrid>
        </VStack>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ActivateSubscriptionModal />
      <CancelSubscriptionModal />
      <EditCardDetailsModal />
      <ActivateInvoiceSubscriptionModal />
      <EditBillingDetailModal />

      {isPageLoading ? (
        <Spinner />
      ) : isSchoolError ? (
        <Text>Failed to load school</Text>
      ) : !school ? (
        <Text>School not found</Text>
      ) : (
        <VStack align="stretch" spacing="24px" mt="10px">
          <Box
            w="100%"
            fontFamily="Lato"
            className="flex md:flex-row flex-col justify-between gap-2.5"
          >
            <Text fontSize="20px" fontWeight="bold">
              {t("user.billing.title", "Billing")}
            </Text>

            {canCancel ? (
              <Button
                h="44px"
                px="24px"
                borderRadius="10px"
                bgColor="white"
                textColor="black"
                borderColor="black"
                borderWidth="1px"
                onClick={() => openModal("CANCEL_SUBSCRIPTION", { schoolId })}
              >
                {t("user.billing.cancel", "Cancel subscription")}
              </Button>
            ) : null}

            {canActivateStripe ? (
              <Button
                h="44px"
                px="24px"
                borderRadius="10px"
                bgColor="#0070C1"
                textColor="white"
                borderColor="#0070C1"
                onClick={() => openModal("ACTIVATE_SUBSCRIPTION", { schoolId })}
              >
                {t("user.billing.activate", "Activate")}
              </Button>
            ) : null}
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="24px" fontFamily="Lato">
            <Box
              minH="139px"
              gap="12px"
              borderRadius="8px"
              borderColor="#C7C7C7"
              borderWidth="1px"
              className="px-4 py-5 md:px-6 md:py-10"
            >
              <Box className="flex md:flex-row flex-col justify-between gap-2.5">
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Text fontWeight="bold" fontSize="18px">
                      {t("user.billing.monthly", "Monthly")}
                    </Text>

                    <Box
                      textColor="white"
                      fontSize="14px"
                      h="28px"
                      borderRadius="6px"
                      px="12px"
                      py="4px"
                      bgColor={isActive ? "#76B16B" : "#FF383C"}
                    >
                      {isActive
                        ? t("user.billing.active", "Active")
                        : t("user.billing.inactive", "Inactive")}
                    </Box>

                    <Box
                      textColor="white"
                      fontSize="14px"
                      h="28px"
                      borderRadius="6px"
                      px="12px"
                      py="4px"
                      bgColor={"#0070C1"}
                    >
                      {subscriptionTypeLabel}
                    </Box>
                  </HStack>

                  <Text fontSize="14px" color="gray.500">
                    {t("user.billing.subscriptionDescription", "Subscription plan")}
                  </Text>
                </VStack>

                <Text fontSize="24px" fontWeight="bold">
                  {isActive ? priceText : "—"}
                  <Text as="span" fontWeight="light" fontSize="16px">
                    {" "}
                    / {t("user.billing.month", "month")}
                  </Text>
                </Text>
              </Box>
            </Box>

            <Box
              minH="139px"
              gap="12px"
              borderRadius="8px"
              borderColor="#C7C7C7"
              borderWidth="1px"
              className="px-4 py-5 md:px-6 md:py-10"
            >
              <HStack justify="space-between" mb="12px">
                <Text fontWeight="bold" fontSize="18px">
                  {t("user.billing.billingDetails", "Billing details")}
                </Text>

                {isActive && (
                  <Button
                    h="31px"
                    px="12px"
                    py="4px"
                    borderRadius="6px"
                    fontSize="16px"
                    bgColor="white"
                    borderColor="#C7C7C7"
                    borderWidth="1px"
                    onClick={() => openModal("EDIT_BILLING_DETAILS")}
                  >
                    {t("general.edit", "Edit")}
                  </Button>
                )}
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing="12px">
                <VStack align="start" spacing="4px">
                  <Text fontSize="12px" color="gray.500">
                    {t("general.fullname", "Full name")}
                  </Text>
                  <Text fontSize="14px" fontWeight="500" color="#100B20">
                    {isActive ? `${user?.first_name ?? "—"} ${user?.last_name ?? ""}`.trim() : "—"}
                  </Text>
                </VStack>

                <VStack align="start" spacing="4px">
                  <Text fontSize="12px" color="gray.500">
                    {t("general.email", "Email")}
                  </Text>
                  <Text fontSize="14px" fontWeight="500" color="#100B20">
                    {isActive ? ((user as any)?.email ?? "—") : "—"}
                  </Text>
                </VStack>

                <VStack align="start" spacing="4px">
                  <Text fontSize="12px" color="gray.500">
                    {t("user.billing.billingAddress", "Address")}
                  </Text>
                  <Text fontSize="14px" fontWeight="500" color="#100B20" isTruncated maxW="180px">
                    {isActive ? billingAddressText : "—"}
                  </Text>
                </VStack>
              </SimpleGrid>
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="24px" fontFamily="Lato">
            <Box className="flex md:flex-row flex-col gap-2.5">
              <Box
                minH="139px"
                borderRadius="8px"
                borderColor="#C7C7C7"
                borderWidth="1px"
                w="100%"
                className="px-4 py-5 md:px-6 md:py-10"
              >
                <HStack justify="space-between" w="100%" className="lms-svg-outline">
                  <VStack align="flex-start">
                    <Text fontWeight="bold" fontSize="18px">
                      {t("user.billing.nextBilling", "Next billing")}
                    </Text>
                    <Text mt="8px" color="gray.500">
                      {isActive
                        ? formatBillingDate(subscription?.next_billing_date ?? null, i18n.language)
                        : t("user.billing.noDetails", "No details")}
                    </Text>
                  </VStack>
                  <DateIcon />
                </HStack>
              </Box>

              <Box
                minH="139px"
                borderRadius="8px"
                borderColor="#C7C7C7"
                borderWidth="1px"
                w="100%"
                className="px-4 py-5 md:px-6 md:py-10"
              >
                <HStack justify="space-between" w="100%" className="lms-svg-outline">
                  <VStack align="flex-start">
                    <Text fontWeight="bold" fontSize="18px">
                      {t("user.billing.latestBilling", "Latest billing")}
                    </Text>
                    <Text mt="8px" color="gray.500">
                      {isActive
                        ? formatBillingDate(subscription?.latest_billing_date ?? null, i18n.language)
                        : t("user.billing.noDetails", "No details")}
                    </Text>
                  </VStack>
                  <DateIcon />
                </HStack>
              </Box>
            </Box>

            <Box
              minH="139px"
              gap="12px"
              borderRadius="8px"
              borderColor="#C7C7C7"
              borderWidth="1px"
              className="flex flex-col px-4 py-5 md:px-6 md:py-10"
            >
              <HStack justify="space-between">
                <Text fontWeight="bold" fontSize="18px" mb="5px">
                  {t("user.billing.cardDetails", "Card details")}
                </Text>

                {isActive && (
                  <Button
                    h="31px"
                    px="12px"
                    py="4px"
                    borderRadius="6px"
                    fontSize="16px"
                    bgColor="white"
                    borderColor="#C7C7C7"
                    borderWidth="1px"
                    onClick={() => openModal("EDIT_CARD_DETAILS")}
                  >
                    {t("general.update", "Update")}
                  </Button>
                )}
              </HStack>

              {isActive && card ? (
                <HStack mt="8px">
                  <Box
                    borderRadius="6px"
                    borderWidth="1px"
                    borderColor="#C7C7C7"
                    w="85px"
                    h="48px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    className="lms-svg-brand"
                  >
                    {card.brand === "visa" ? <VisaIcon width="53px" /> : <MasterIcon width="53px" />}
                  </Box>

                  <VStack fontFamily="Lato" align="flex-start" spacing="4px">
                    <Text fontSize="14px" fontWeight="bold">
                      **** **** **** {card.last4 ?? "—"}
                    </Text>
                    <Text fontSize="14px">
                      {`${t("user.billing.expiry", "Expiry")} ${card.exp_month ?? "—"}/${card.exp_year ?? "—"}`}
                    </Text>
                  </VStack>
                </HStack>
              ) : (
                <Text mt="8px" color="gray.500">
                  {t("user.billing.noDetails", "No details")}
                </Text>
              )}
            </Box>
          </SimpleGrid>

          <Box
            fontFamily="Lato"
            p="24px"
            border="1px solid #E2E8F0"
            borderRadius="12px"
            className="overflow-x-auto"
          >
            <Text fontWeight="bold" fontSize="20px" mb="16px">
              {t("user.billing.history", "Billing history")}
            </Text>

            {invoices.length === 0 ? (
              <Text color="gray.500">—</Text>
            ) : (
              <Table variant="simple">
                <Thead bg="#F5F7F9">
                  {table.getHeaderGroups().map((hg) => (
                    <Tr key={hg.id}>
                      {hg.headers.map((header) => (
                        <Th key={header.id}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </Thead>

                <Tbody>
                  {table.getRowModel().rows.map((row) => (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <Td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>
        </VStack>
      )}
    </AdminLayout>
  );
}

export default AdminBilling;
