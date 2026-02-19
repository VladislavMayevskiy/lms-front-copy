import DeleteModal from "components/ui/modal/delete";
import { Text } from "@chakra-ui/react";
import { useModalStore  } from "stores/modalStore";
import { useDeleteImageUser } from "api/user/hooks";
import { useTranslation } from "react-i18next";
import { ToastComponent } from "components/ui/toast";

export default function DeleteModalUserImage() {
  const { t } = useTranslation();
  const { type,  closeModal } = useModalStore ();
  const toast = ToastComponent();
  const { mutate: deleteImage, isPending } = useDeleteImageUser();
  const isOpen = type === "DELETE_IMAGE_USER";

const handleDelete = () => {
  deleteImage(undefined, {
    onSuccess: () => {
      toast("Image successfully deleted");
      closeModal();
    },
    onError: () => {
      toast("Information is wrong");
    },
  });
};



  return (
    <DeleteModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("user.profile.deleteProfileImage")}
      onConfirm={handleDelete}
      isLoading={isPending}
    >
      <Text
        textAlign="center"
        textColor="#1F2221"
        fontFamily="Lato"
        fontSize="18px"
      >
        {t("user.profile.deleteProfileImageText")}
      </Text>

    </DeleteModal>
  );
}
