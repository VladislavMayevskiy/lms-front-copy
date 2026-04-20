import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateSubscriptionPayload, CreateSubscriptionResponse, BillingResponse, InvoiceResponse } from "./types";
import { createSchoolSubscription, updateSchoolSubscription, deleteSchoolSubscription, getSchoolBilling, getSchoolInvoice } from "./index";


export const useCreateSchoolSubscription = (schoolId: number) => {
  const queryClient = useQueryClient();

  return useMutation<CreateSubscriptionResponse, Error, CreateSubscriptionPayload>({
    mutationKey: ["school-subscription-create", schoolId],
    mutationFn: (payload: CreateSubscriptionPayload) => createSchoolSubscription(payload, schoolId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-billing", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["school-invoice", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["school", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["school-branding", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
};

export const useUpdateSchoolSubscription = (schoolId: number) => {
  const queryClient = useQueryClient();

  return useMutation<CreateSubscriptionPayload, Error, CreateSubscriptionPayload>({
    mutationKey: ["school-subscription-update", schoolId],
    mutationFn: (payload: CreateSubscriptionPayload) => updateSchoolSubscription(payload, schoolId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-billing", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["school-invoice", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["school", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["school-branding", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
};

export const useDeleteSchoolSubscription = (schoolId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["school-subscription-delete", schoolId],
    mutationFn: () => deleteSchoolSubscription(schoolId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-billing", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["school-invoice", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["school", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["school-branding", schoolId] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
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
