import UserLayout from "components/ui/layouts/user";
import {
  Box,
  Heading,
  Text,
  Button,
  Image,
  Input,
  VStack,
  HStack,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";

import LogOut from "assets/imgs/user/heroicons-outline/logout.svg?react";
import CoursesFinishIcon from "assets/imgs/user/heroicons-outline/courses.svg?react";
import UnfinishCoursesIcon from "assets/imgs/user/heroicons-outline/unfinished.svg?react";
import HoursIcon from "assets/imgs/user/heroicons-outline/clock.svg?react";
import JoinedIcon from "assets/imgs/user/heroicons-outline/cake.svg?react";
import MenImage from "assets/imgs/men.png";

import { useForm, Controller } from "react-hook-form";
import { useCurrentUserQuery, useUpdateCurrentUser } from "api/global/hooks";
import { useEffect, useCallback } from "react";
import { localStore } from "stores/localStore";
import { ToastComponent } from "components/ui/toast";
import { queryClient } from "api";
import { useNavigate } from "react-router-dom";
import { useUpdatePasswordUser, useGetActivity } from "api/user/hooks";
import { useModalStore } from "stores/modalStore";

import DestroyModalUser from "./component/modals/delete";
import ProfileModal from "./component/modals";
import DeleteModalUserImage from "./component/modals/delete/image";

import { useTranslation } from "react-i18next";
import type { ProfileFormValues } from "types/user/Profile";

import { profileSchema } from "./validation/profile.validation.schema";
import { zodResolver } from "@hookform/resolvers/zod";

function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data } = useCurrentUserQuery();
  const { mutate: updateUser, isPending: isSavingProfile } = useUpdateCurrentUser();
  const { mutate: changePassword, isPending: isChangingPassword } = useUpdatePasswordUser();
  const { data: activity } = useGetActivity();
  const toast = ToastComponent();
  const openModal = useModalStore((s) => s.openModal);
  const type = useModalStore((s) => s.type);
  const closeModal = useModalStore((s) => s.closeModal);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!data) return;

    reset({
      fullName: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      email: data.email ?? "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [data?.id, reset]);

  const clearToken = localStore((store) => store.clearToken);

  const logout = useCallback(() => {
    clearToken();
    queryClient.clear();
    navigate("/login");
  }, [clearToken, navigate]);

  const joinedAt = data?.created_at
    ? new Date(data.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formatDuration = (minutes?: string) =>
    minutes ? (Number(minutes) / 60).toFixed(1) : "0.0";

const onSave = handleSubmit(async (values) => {
  if (!data) return;

  const parts = values.fullName.trim().split(/\s+/);
  const first_name = parts[0] ?? "";
  const last_name = parts.slice(1).join(" ");

  try {
    await updateUser({
      first_name,
      last_name,
      email: values.email,
      phone: data.phone || "+380999999999",
      gender: Number(data.gender ?? 1),
      birthday: data.birthday ?? "2000-01-01",
    } as any);

    toast("Information successfully updated");
  } catch (error) {
    toast("Information is wrong");
  }
});


const onChangePassword = handleSubmit(async (values) => {
  const allEmpty =
    !values.currentPassword &&
    !values.newPassword &&
    !values.confirmPassword;

  if (allEmpty) return;

  try {
    await changePassword({
      old_password: values.currentPassword,
      new_password: values.newPassword,
      new_password_confirmation: values.confirmPassword,
    });

    toast("Password successfully updated");
  } catch (error) {
    toast("Information is wrong");
  }
});

  return (
    <UserLayout>
      <Box className="flex md:flex-row flex-col gap-4 md:items-start">
        <ProfileModal isOpen={type === "UPDATE_IMAGE_USER"} onClose={closeModal} />
        <DestroyModalUser />
        <DeleteModalUserImage />

        <Box
          p="24px"
          bgColor="white"
          borderColor="#B4D6DF"
          borderWidth="1px"
          borderRadius="10px"
          className="lms-box w-full md:w-4/5"
        >
          <VStack fontFamily="Lato" spacing="35px">
            <HStack justify="space-between" width="100%">
              <Heading fontFamily="Lato" fontWeight="medium" fontSize="32px">
                {t("user.profile.title")}
              </Heading>

              <Button
                variant="ghost"
                _hover={{ bgColor: "white" }}
                leftIcon={<LogOut />}
                onClick={logout}
                className="lms-svg-outline"
              >
                {t("general.logOut")}
              </Button>
            </HStack>

            {/* Profile picture */}
            <VStack align="flex-start" width="100%" borderBottom="1px" borderColor="#B4D6DF">
              <Text fontSize="20px" fontWeight="bold">
                {t("user.profile.profilePicture")}
              </Text>

              <HStack mb="40px" className="w-full" spacing={5}>
                <Image
                  width="100px"
                  height="100px"
                  alt="Image"
                  borderRadius="99px"
                  src={data?.image || MenImage}
                />

                <Box className="flex md:flex-row flex-col gap-3.5 w-full">
                  <Button
                    _hover={{ bgColor: "#0070C1" }}
                    borderRadius="10px"
                    bgColor="#0070C1"
                    textColor="white"
                    px="24px"
                    py="10px"
                    width="100%"
                    className="md:max-w-[320px]"
                    height="44px"
                    borderWidth="1px"
                    borderColor="#0070C1"
                    onClick={() => openModal("UPDATE_IMAGE_USER")}
                  >
                    {t("user.profile.changePicture")}
                  </Button>

                  <Button
                    _hover={{ bgColor: "white" }}
                    borderRadius="10px"
                    bgColor="white"
                    borderColor="#FE4040"
                    borderWidth="1px"
                    textColor="#FE4040"
                    px="24px"
                    py="10px"
                    width="100%"
                    className="md:max-w-[320px]"
                    height="44px"
                    onClick={() => openModal("DELETE_IMAGE_USER")}
                  >
                    {t("user.profile.deletePicture")}
                  </Button>
                </Box>
              </HStack>
            </VStack>

            {/* Main info */}
            <VStack fontFamily="Lato" align="flex-start" width="100%" borderBottom="1px" borderColor="#B4D6DF">
              <Heading mb="10px" fontFamily="Lato" fontSize="20px" fontWeight="bold">
                {t("user.profile.mainInfo")}
              </Heading>

              <Box mb="8px" className="flex md:flex-row flex-col w-full gap-2">
                <VStack align="flex-start" className="w-full">
                  <Text fontSize="14px" fontWeight="bold">
                    {t("general.fullname")} <Text as="span" color="red">*</Text>
                  </Text>

                  <FormControl isInvalid={Boolean(errors.fullName)}>
                    <Controller
                      control={control}
                      name="fullName"
                      render={({ field }) => (
                        <Input
                          {...field}
                          bgColor="#F5F7F9"
                          borderWidth="1px"
                          borderRadius="10px"
                          borderColor="#B4D6DF"
                          p="12px"
                          h="44px"
                          className="w-full"
                        />
                      )}
                    />
                    <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage>
                  </FormControl>
                </VStack>

                <VStack align="flex-start" className="w-full">
                  <Text fontSize="14px" fontWeight="bold">
                    {t("general.email")} <Text as="span" color="red">*</Text>
                  </Text>

                  <FormControl isInvalid={Boolean(errors.email)}>
                    <Controller
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <Input
                          {...field}
                          bgColor="#F5F7F9"
                          borderWidth="1px"
                          borderRadius="10px"
                          borderColor="#B4D6DF"
                          p="12px"
                          h="44px"
                          className="w-full"
                        />
                      )}
                    />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </Box>

              <Button
                mb="40px"
                _hover={{ bgColor: "#0070C1" }}
                borderRadius="10px"
                bgColor="#0070C1"
                textColor="white"
                px="24px"
                py="10px"
                width="82px"
                height="44px"
                onClick={onSave}
                borderColor="#0070C1"
                borderWidth="1px"
                isLoading={isSavingProfile}
                isDisabled={!isValid || isSavingProfile || isChangingPassword}
              >
                {t("general.save")}
              </Button>
            </VStack>

            {/* Change password */}
            <VStack fontFamily="Lato" align="flex-start" width="100%" borderBottom="1px" borderColor="#B4D6DF">
              <Heading mb="10px" fontFamily="Lato" fontSize="20px" fontWeight="bold">
                {t("user.profile.changePassword")}
              </Heading>

              <Box mb="8px" className="flex md:flex-row flex-col w-full gap-2">
                <VStack align="flex-start" className="w-full">
                  <Text fontSize="14px" fontWeight="bold">
                    {t("general.currentPassword")} <Text as="span" color="red">*</Text>
                  </Text>

                  <FormControl isInvalid={Boolean(errors.currentPassword)}>
                    <Controller
                      control={control}
                      name="currentPassword"
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="password"
                          bgColor="#F5F7F9"
                          borderWidth="1px"
                          borderRadius="10px"
                          borderColor="#B4D6DF"
                          p="12px"
                          className="w-full"
                          h="44px"
                        />
                      )}
                    />
                    <FormErrorMessage>{errors.currentPassword?.message}</FormErrorMessage>
                  </FormControl>
                </VStack>

                <VStack align="flex-start" className="w-full">
                  <Text fontSize="14px" fontWeight="bold">
                    {t("general.newPassword")} <Text as="span" color="red">*</Text>
                  </Text>

                  <FormControl isInvalid={Boolean(errors.newPassword)}>
                    <Controller
                      control={control}
                      name="newPassword"
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="password"
                          bgColor="#F5F7F9"
                          borderWidth="1px"
                          borderRadius="10px"
                          borderColor="#B4D6DF"
                          p="12px"
                          className="w-full"
                          h="44px"
                        />
                      )}
                    />
                    <FormErrorMessage>{errors.newPassword?.message}</FormErrorMessage>
                  </FormControl>
                </VStack>

                <VStack align="flex-start" className="w-full">
                  <Text fontSize="14px" fontWeight="bold">
                    {t("general.confirmPassword")} <Text as="span" color="red">*</Text>
                  </Text>

                  <FormControl isInvalid={Boolean(errors.confirmPassword)}>
                    <Controller
                      control={control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="password"
                          bgColor="#F5F7F9"
                          borderWidth="1px"
                          borderRadius="10px"
                          borderColor="#B4D6DF"
                          p="12px"
                          className="w-full"
                          h="44px"
                        />
                      )}
                    />
                    <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </Box>

              <Button
                type="button"
                mb="40px"
                _hover={{ bgColor: "#0070C1" }}
                borderRadius="10px"
                bgColor="#0070C1"
                textColor="white"
                px="24px"
                py="10px"
                width="175px"
                height="44px"
                borderColor="#0070C1"
                borderWidth="1px"
                onClick={onChangePassword}
                isLoading={isChangingPassword}
                isDisabled={isSavingProfile || isChangingPassword}
              >
                {t("user.profile.changePassword")}
              </Button>
            </VStack>

            {/* Delete account */}
            <VStack fontFamily="Lato" align="flex-start" width="100%">
              <Heading mb="10px" fontFamily="Lato" fontSize="20px" fontWeight="bold">
                {t("user.profile.deleteAccount")}
              </Heading>
              <Text mb="10px" textColor="#434645" fontSize="14px">
                {t("user.profile.deleteAccountText")}
              </Text>

              <Button
                _hover={{ bgColor: "white" }}
                borderRadius="10px"
                bgColor="white"
                textColor="#FE4040"
                borderColor="#FE4040"
                borderWidth="1px"
                px="24px"
                py="10px"
                width="158px"
                height="44px"
                onClick={() => openModal("DESTROY_USER")}
              >
                {t("user.profile.deleteAccount")}
              </Button>
            </VStack>
          </VStack>
        </Box>

        {/* Activity */}
        <Box
          p="24px"
          bgColor="white"
          borderColor="#B4D6DF"
          borderWidth="1px"
          borderRadius="10px"
          className="lms-box w-full md:w-2/5"
        >
          <VStack fontFamily="Lato" align="flex-start">
            <Text fontSize="20px" fontWeight="bold">
              {t("user.profile.yourActivity")}
            </Text>

            <VStack spacing="5px" mb="20px" w="100%">
              <Box
                p="12px"
                width="100%"
                h="48px"
                bgColor="white"
                borderColor="#CAE0C3"
                borderWidth="1px"
                borderRadius="6px"
                className="lms-box"
              >
                <HStack justify="space-between">
                  <HStack className="lms-svg-outline">
                    <CoursesFinishIcon />
                    <Text fontSize="15px" fontWeight="bold">
                      {t("user.profile.coursesFinished")}
                    </Text>
                  </HStack>
                  <Text fontSize="15px" fontWeight="bold">
                    {activity?.data.completed_count ?? 0}
                  </Text>
                </HStack>
              </Box>

              <Box
                p="12px"
                width="100%"
                h="48px"
                bgColor="white"
                borderColor="#CAE0C3"
                borderWidth="1px"
                borderRadius="6px"
                className="lms-box"
              >
                <HStack justify="space-between">
                  <HStack className="lms-svg-outline">
                    <UnfinishCoursesIcon />
                    <Text fontSize="15px" fontWeight="bold">
                      {t("user.profile.unfinishedCourses")}
                    </Text>
                  </HStack>
                  <Text fontSize="15px" fontWeight="bold">
                    {activity?.data.uncompleted_count ?? 0}
                  </Text>
                </HStack>
              </Box>

              <Box
                p="12px"
                width="100%"
                h="48px"
                bgColor="white"
                borderColor="#CAE0C3"
                borderWidth="1px"
                borderRadius="6px"
                className="lms-box"
              >
                <HStack justify="space-between">
                  <HStack className="lms-svg-outline">
                    <HoursIcon />
                    <Text fontSize="15px" fontWeight="bold">
                      {t("user.profile.hoursSpent")}
                    </Text>
                  </HStack>
                  <Text fontSize="15px" fontWeight="bold">
                    {formatDuration(activity?.data.total_duration)} h
                  </Text>
                </HStack>
              </Box>
            </VStack>

            <HStack width="100%" justify="center">
              <JoinedIcon />
              <Text fontWeight="semibold" fontSize="14px" textColor="#479AB1">
                {t("user.profile.joinedAt", { date: joinedAt })}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Box>
    </UserLayout>
  );
}

export default Profile;
