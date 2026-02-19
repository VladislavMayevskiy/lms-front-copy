import { useMutation, useQuery } from "@tanstack/react-query";
import type { CreateSubscriptionPayload, CreateSubscriptionResponse, BillingResponse, InvoiceResponse } from "./types";
import { createSchoolSubscription, updateSchoolSubscription, deleteSchoolSubscription, getSchoolBilling, getSchoolInvoice } from "./index";


export const useCreateSchoolSubscription = (schoolId: number) => {
  return useMutation<CreateSubscriptionResponse,Error, CreateSubscriptionPayload>({
    mutationKey: ["school-subscription-create", schoolId],
    mutationFn: (payload: CreateSubscriptionPayload) => createSchoolSubscription(payload, schoolId)
    },);
};

export const useUpdateSchoolSubscription = (schoolId: number) => {
  return useMutation<CreateSubscriptionPayload, Error, CreateSubscriptionPayload>({
    mutationKey: ["school-subscription-update", schoolId],
    mutationFn: (payload: CreateSubscriptionPayload) => updateSchoolSubscription(payload, schoolId)
    },);
};

export const useDeleteSchoolSubscription = (schoolId: number) => {
  return useMutation({
    mutationKey: ["school-subscription-delete", schoolId],
    mutationFn: () => deleteSchoolSubscription(schoolId)
    },);
};

export const useGetSchoolBilling = (schoolId: number) =>
  useQuery<BillingResponse>({
    queryKey: ["school-billing", schoolId],
    queryFn: () => getSchoolBilling(schoolId),
    enabled: !!schoolId,
  });

export const useGetSchoolInvoice = (schoolId: number) =>
  useQuery<InvoiceResponse>({
    queryKey: ["school-invoice", schoolId],
    queryFn: () => getSchoolInvoice(schoolId),
    enabled: !!schoolId,
  });
