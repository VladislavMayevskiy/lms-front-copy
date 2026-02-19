import DeleteModal from "components/ui/modal/delete";
import { Text } from "@chakra-ui/react";
import {useModalStore } from "stores/modalStore";
import { useDeleteSchool } from "api/admin/schools/hooks";
import { ToastComponent } from "components/ui/toast";

export default function DeleteSchoolModal() {
  const { type, payload, closeModal } = useModalStore ();
  const { mutate: deleteSchool, isPending } = useDeleteSchool();
  const toast = ToastComponent();
  const isOpen = type === "DELETE_SCHOOL";
  const schoolId = type === "DELETE_SCHOOL" ? payload?.id : null;

  const getErrorMessage = (err: unknown) => {
      const anyErr = err as any;
      return (
        anyErr?.response?.data?.message ||
        anyErr?.response?.data?.error ||
        anyErr?.message ||
        "Something went wrong"
        );
      };

  const handleClose = () => {
    closeModal();
    toast("School successfully deleted")
  };
  const handleDelete = () => {
    if (!schoolId) return;

    deleteSchool(schoolId, {
      onSuccess: () => handleClose(),
      onError: (error) => {toast(getErrorMessage(error))}
    });
  };

  return (
    <DeleteModal
      isOpen={isOpen}
      onClose={closeModal}
      title="Delete school"
      onConfirm={handleDelete}
      isLoading={isPending}
    >
      <Text
        textAlign="center"
        textColor="#1F2221"
        fontFamily="Lato"
        fontSize="18px"
      >
        Are you sure you want to delete this school?
      </Text>
    </DeleteModal>
  );
}
