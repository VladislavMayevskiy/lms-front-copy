import DeleteModal from "components/ui/modal/delete";
import { Text } from "@chakra-ui/react";
import {useModalStore } from "stores/modalStore";
import { useDeleteDistricts } from "api/admin/districts/hooks";
import { ToastComponent } from "components/ui/toast";

export default function DeleteDistrictModal() {
  const { type, payload, closeModal } = useModalStore ();
  const { mutate: deleteDistrict, isPending } = useDeleteDistricts();
  const toast = ToastComponent();

  const isOpen = type === "DELETE_DISTRICT";
  const districtId = type === "DELETE_DISTRICT" ? payload?.id : null;
  const getErrorMessage = (err: unknown) => {
      const anyErr = err as any;
      return (
        anyErr?.response?.data?.message ||
        anyErr?.response?.data?.error ||
        anyErr?.message ||
        "Something went wrong"
        );
      };

  const handleClose = () => {;
    closeModal();
    toast("District successfully deleted")
  };

  const handleDelete = () => {
    if (!districtId) return;

    deleteDistrict(districtId, {
      onSuccess: () => handleClose(),
      onError: (error) => {toast(getErrorMessage(error))}
    });
  };

  return (
    <DeleteModal
      isOpen={isOpen}
      onClose={closeModal}
      title="Delete district"
      onConfirm={handleDelete}
      isLoading={isPending}
    >
      <Text
        textAlign="center"
        textColor="#1F2221"
        fontFamily="Lato"
        fontSize="18px"
      >
        Are you sure you want to delete this district?
      </Text>
    </DeleteModal>
  );
}
