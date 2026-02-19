import DeleteModal from "components/ui/modal/delete";
import { Text, VStack } from "@chakra-ui/react";
import { useModalStore } from "stores/modalStore";
import { useDeleteUser } from "api/user/hooks";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import InputLMS from "components/ui/input";

type FormValues = {
  currentPassword: string;
};

export default function DestroyModalUser() {
  const { t } = useTranslation();
  const { type, closeModal } = useModalStore();
  const { mutate: deleteUser, isPending } = useDeleteUser();
  const navigate = useNavigate();

  const isOpen = type === "DESTROY_USER";

  const {
    register,
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      currentPassword: "",
    },
  });

  const password = watch("currentPassword");

  const handleDelete = () => {
    if (!password) return;

    deleteUser(password, {
      onSuccess: () => {
        reset();
        closeModal();
        navigate("/login");
      },
    });
  };

  return (
    <DeleteModal
      isOpen={isOpen}
      onClose={closeModal}
      title={t("user.profile.deleteAccount")}
      onConfirm={handleDelete}
      isLoading={isPending}
      isDisabled={!password}
    >
      <VStack spacing={4}>
        <Text
          textAlign="center"
          textColor="#1F2221"
          fontFamily="Lato"
          fontSize="18px"
        >
          {t("user.profile.deleteAccountModalText")}
        </Text>

        <InputLMS
          placeholder="Enter your password to confirm"
          {...register("currentPassword", { required: true })}
        />
      </VStack>
    </DeleteModal>
  );
}
