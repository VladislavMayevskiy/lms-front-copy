import DeleteModal from "components/ui/modal/delete";
import { Text } from "@chakra-ui/react";
import { useModalStore } from "stores/modalStore";
import { useDeleteUsers } from "api/admin/users/hooks";
import { ToastComponent } from "components/ui/toast";

export default function DeleteUsersModal() {

const { type, payload, closeModal } = useModalStore ();
const isOpen = type === "DELETE_USER"
const toast = ToastComponent();
const { mutate: deleteUser, isPending } = useDeleteUsers();
const userId = payload?.id;

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
    toast("User successfully deleted")
  };

const handleDelete = () => {
  if (!userId) return;

  deleteUser(userId, {
    onSuccess: () => handleClose(),
    onError: (error) => {toast(getErrorMessage(error))}
  });
};



  return (
    <DeleteModal
      isOpen={isOpen}
      onClose={closeModal}
      title="Delete user"
      onConfirm={handleDelete}
      isLoading={isPending}
    >
      <Text
        textAlign="center"
        textColor="#1F2221"
        fontFamily="Lato"
        fontSize="18px"
      >
        Are you sure you want to delete this user?
      </Text>
    </DeleteModal>
  );
}
