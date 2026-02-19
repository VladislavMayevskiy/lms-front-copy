import { createColumnHelper } from "@tanstack/react-table";
import { Box, Text,  IconButton, HStack} from "@chakra-ui/react";
import type { TFunction } from "i18next";
import type { InvoiceType } from "api/admin/billing/types";
import InvoiceIcon from "assets/imgs/user/heroicons-outline/invoice.svg?react"


const columnHelper = createColumnHelper<InvoiceType>();
export const formatDate = (unix: number) =>
  new Date(unix * 1000).toLocaleDateString("en-GB");

export const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);

export const BillingColumns = (t: TFunction) => [
  columnHelper.accessor("number", {
    header: t("user.billing.description"),
    cell: ({ row }) => (
      <Text fontSize="14px" fontFamily="Lato">
        {row.original.number}
      </Text>
    ),
  }),

  columnHelper.accessor("created", {
    header: t("general.date"),
    cell: ({ row }) => (
      <Text fontSize="14px" fontFamily="Lato">
        {formatDate(row.original.created)}
      </Text>
    ),
  }),

  columnHelper.accessor("total", {
    header: t("user.billing.amount"),
    cell: ({ row }) => (
      <Text fontSize="14px" fontFamily="Lato">
        {formatMoney(row.original.total, row.original.currency)}
      </Text>
    ),
  }),

  columnHelper.accessor("status", {
    header: t("general.status"),
    cell: ({ row }) => (
      <Box
        px="12px"
        py="4px"
        borderRadius="6px"
        bg={'white'}
        textColor={row.original.status === "paid" ? "#2A711D" : "#BA4B0C"}
        borderColor={row.original.status === "paid" ? "#76B16B" : "#F27D3B"}
        borderWidth={'1px'}
        fontSize="13px"
        fontWeight="600"
        w="fit-content"
        fontFamily={'Lato'}
      >
        {row.original.status.toUpperCase()}
      </Box>
    ),
  }),

columnHelper.display({
  id: "download",
  header: t("user.billing.invoice"),
  cell: ({ row }) => (
    <HStack spacing="8px" align="center">
      <Text fontSize="14px">{t("user.billing.downloadInvoice")}</Text>
      <IconButton
        as="a"
        href={row.original.invoice_pdf}
        target="_blank"
        aria-label="download"
        icon={<InvoiceIcon />}
        size="sm"
        variant="ghost"
      />
    </HStack>
  ),
}),


];