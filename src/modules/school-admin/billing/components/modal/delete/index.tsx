import DeleteModal from "components/ui/modal/delete";
import { Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useModalStore } from "stores/modalStore";
import { useDeleteSchoolSubscription } from "api/admin/billing/hooks";
import { authStore } from "stores/authStore";
import { ToastComponent } from "components/ui/toast";

export default function CancelSubscriptionModal() {
  const { type, closeModal } = useModalStore();
  const { t } = useTranslation();
  const toast = ToastComponent();

  const { user, hydrated } = authStore();
  const schoolId = user?.school_id || undefined

  const canDelete = hydrated && typeof schoolId === "number" && schoolId > 0;

  const { mutateAsync: cancelSubscription, isPending } = useDeleteSchoolSubscription(schoolId as number);

  const isOpen = type === "CANCEL_SUBSCRIPTION";

  const getErrorMessage = (err: unknown) => {
    const anyErr = err as any;
    return (
      anyErr?.response?.data?.message ||
      anyErr?.response?.data?.error ||
      anyErr?.message ||
      "Something went wrong"
    );
  };

  const handleDelete = async () => {
    if (!canDelete) return;
    try {
      await cancelSubscription();
      toast("Subscription successfully cancelled");
      closeModal();
    } catch (error) {
      toast(getErrorMessage(error));
    }
  };

  if (!isOpen) return null;

  return (
    <DeleteModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("user.billing.cancelModal.title")}
      onConfirm={handleDelete}
      isLoading={isPending}
    >
      <Text
        textAlign="start"
        textColor="#1F2221"
        fontFamily="Lato"
        fontSize="18px"
      >
        {t("user.billing.cancelModal.description")}
      </Text>
    </DeleteModal>
  );
}
