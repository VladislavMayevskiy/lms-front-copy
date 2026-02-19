import type { CreateSubscriptionPayload, CreateSubscriptionResponse, BillingResponse, InvoiceResponse} from "./types";
import { AdminApiRoutes } from "api/constants";
import { client } from "api";

export const createSchoolSubscription = async (payload: CreateSubscriptionPayload, schoolId: number): Promise<CreateSubscriptionResponse> => {
    const response = await client.post(AdminApiRoutes.subscription(schoolId), payload)
    return response.data
}

export const updateSchoolSubscription = async (payload: CreateSubscriptionPayload, schoolId: number) => {
    const response = await client.put(AdminApiRoutes.subscription(schoolId), payload)
    return response.data
}

export const deleteSchoolSubscription = async (schoolId: number) => {
    const response = await client.delete(AdminApiRoutes.subscription(schoolId))
    return response.data
}

export const getSchoolBilling = async (schoolId: number): Promise<BillingResponse> => {
    const response = await client.get(AdminApiRoutes.billing(schoolId))
    return response.data
}

export const getSchoolInvoice = async (schoolId: number): Promise<InvoiceResponse> => {
    const response = await client.get(AdminApiRoutes.invoice(schoolId))
    return response.data
}