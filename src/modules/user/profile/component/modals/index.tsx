import { Box, Text, VStack, Input, Button } from "@chakra-ui/react";
import { useRef } from "react";
import LoadImg from "assets/imgs/admin/modal/Load.svg?react";
import { Controller, useForm } from "react-hook-form";
import Modal from "components/ui/modal";
import { useUpdateImageUser } from "api/user/hooks";
import { useTranslation } from "react-i18next";
import { ToastComponent } from "components/ui/toast";
type ProfileFormValues = {
  logo: File | null;
};

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toast = ToastComponent();
  const { mutate: updateImage, isPending } = useUpdateImageUser();

  const { control, handleSubmit, getValues } = useForm<ProfileFormValues>({
    defaultValues: {
      logo: null,
    },
  });

const onUpdate = handleSubmit(() => {
  const file = getValues("logo");

  if (!file) return;

  updateImage(file, {
    onSuccess: () => {
      toast("Image successfully updated");
      onClose();
    },
    onError: () => {
      toast("Information is wrong");
    },
  });
});


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("user.profile.updateProfileImage")}
    >
      <Controller
        control={control}
        name="logo"
        render={({ field }) => (
          <VStack align="stretch" spacing="8px">
            <Text fontSize="14px" fontWeight="bold">
              {t("user.profile.image")}
            </Text>

            <Box
              borderWidth="1px"
              borderRadius="10px"
              bgColor="#F5F7F9"
              h="120px"
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <LoadImg />
              <Text fontSize="14px" color="#0070C1">
                {t("user.profile.chooseFileOrDragHere")}
              </Text>

              {field.value && (
                <Text mt="6px" fontSize="12px" color="#555">
                  {field.value.name}
                </Text>
              )}
            </Box>

            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              display="none"
              onChange={(e) =>
                field.onChange(e.target.files?.[0] ?? null)
              }
            />

          </VStack>
        )}
      />
      <Button onClick={onUpdate} isLoading={isPending} mt={'5px'}>
        {t("user.profile.change")}
      </Button>
    </Modal>
  );
}

export default ProfileModal;
