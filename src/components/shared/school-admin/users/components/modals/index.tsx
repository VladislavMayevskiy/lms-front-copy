import { useEffect, useState } from "react";
import {
  ModalBody,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Select,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import Modal from "components/ui/modal";
import { useModalStore } from "stores/modalStore";
import { useCreateUsers } from "api/admin/users/hooks";
import type { CreateSchoolAdminUserSchema } from "../validation";
import PassIcon from "assets/imgs/admin/modal/passwordHide.svg?react";
import { useUpdateUsers } from "api/admin/users/hooks";
import { ToastComponent } from "components/ui/toast";
import { useLocation } from "react-router-dom";
import { SchoolAdminRoutes } from "constants/routes";

export default function SchoolAdminUserModal() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const { mutate: createUser, isPending } = useCreateUsers();
  const { mutate: updateUser, isPending: isEditing } = useUpdateUsers();

  const { type, payload, closeModal } = useModalStore();
  const { pathname } = useLocation();

  const toast = ToastComponent();
  const isCreate = type === "CREATE_USER";
  const isEdit = type === "EDIT_USER";
  const isOpen = isCreate || isEdit;

  const userData = isEdit ? payload?.data ?? null : null;
  const userId = isEdit ? payload?.id ?? null : null;
  
  const isStudentsPage = pathname === SchoolAdminRoutes.students;

  const getErrorMessage = (err: unknown) => {
    const anyErr = err as any;
    return (
      anyErr?.response?.data?.message ||
      anyErr?.response?.data?.error ||
      anyErr?.message ||
      "Something went wrong"
    );
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateSchoolAdminUserSchema>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: 1,
      role: isStudentsPage ? 4 : 4,
      birthday: "",
      password: "",
      password_confirmation: "",
    },
    mode: "onChange",
  });

  const resetToDefaults = () => {
    reset({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: 1,
      role: isStudentsPage ? 4 : 4,
      birthday: "",
      password: "",
      password_confirmation: "",
    });
  };

  const handleCloseEdit = () => {
    resetToDefaults();
    closeModal();
    toast("User successfully edited");
  };

  const handleCloseCreate = () => {
    resetToDefaults();
    closeModal();
    toast(isStudentsPage ? "Student successfully created" : "User successfully created");
  };

  const onSubmit = (formData: CreateSchoolAdminUserSchema) => {
    const payloadFormatted = {
      ...formData,
      role: Number(formData.role),
      gender: Number(formData.gender),
      school_id: null,
      birthday: new Date(formData.birthday).toISOString().split("T")[0],
    };

    if (isEdit && userId) {
      updateUser(
        {
          id: userId,
          data: payloadFormatted,
        },
        {
          onSuccess: handleCloseEdit,
          onError: (error) => {
            toast(getErrorMessage(error));
          },
        }
      );
      return;
    }

    createUser(payloadFormatted, {
      onSuccess: handleCloseCreate,
      onError: (error) => {
        toast(getErrorMessage(error));
      },
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && userData) {
      reset({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender,
        role: userData.role,
        birthday: userData.birthday,
        password: "",
        password_confirmation: "",
      });
    }

    if (isCreate) {
      resetToDefaults();
    }
  }, [isOpen, payload, isEdit, isCreate, userData, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={isEdit ? "Edit user" : isStudentsPage ? "Create student" : "Create user"}
    >
      <ModalBody
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        mt="8px"
        fontFamily={"Lato"}
      >
        <VStack maxW="822px" mx="auto" align="stretch" spacing="24px">
          <HStack spacing="24px" align="flex-start">
            <VStack w="100%" align="stretch" spacing="16px">
              <Controller
                control={control}
                name="first_name"
                rules={{ required: true }}
                render={({ field }) => (
                  <VStack align="stretch" spacing="4px">
                    <Text fontSize="14px" fontWeight="bold">
                      First Name*
                    </Text>
                    <Input
                      {...field}
                      placeholder="Enter first name"
                      h="44px"
                      bg="#F5F7F9"
                      width={"300px"}
                      borderWidth={"1px"}
                      borderColor={"#B4D6DF"}
                      borderRadius={"10px"}
                      _placeholder={{ color: "#0070C1" }}
                    />
                  </VStack>
                )}
              />

              <Controller
                control={control}
                name="email"
                rules={{ required: true }}
                render={({ field }) => (
                  <VStack align="stretch" spacing="4px">
                    <Text fontSize="14px" fontWeight="bold">
                      Email*
                    </Text>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email"
                      h="44px"
                      bg="#F5F7F9"
                      width={"300px"}
                      borderRadius={"10px"}
                      borderColor="#B4D6DF"
                      borderWidth="1px"
                      _placeholder={{ color: "#0070C1" }}
                    />
                  </VStack>
                )}
              />

              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <VStack align="stretch" spacing="4px">
                    <Text fontSize="14px" fontWeight="bold">
                      Gender*
                    </Text>
                    <Select
                      textColor={"#0070C1"}
                      {...field}
                      h="44px"
                      bg="#F5F7F9"
                      width={"300px"}
                      borderWidth="1px"
                      borderColor="#B4D6DF"
                      borderRadius="10px"
                    >
                      <option value={1}>Male</option>
                      <option value={2}>Female</option>
                      <option value={3}>Other</option>
                    </Select>
                  </VStack>
                )}
              />

              {isCreate && (
                <Controller
                  control={control}
                  name="password"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <VStack align="stretch" spacing="4px">
                      <Text fontSize="14px" fontWeight="bold">
                        Password*
                      </Text>
                      <InputGroup>
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          placeholder="Enter password"
                          h="44px"
                          bg="#F5F7F9"
                          width={"300px"}
                          borderRadius="10px"
                          borderColor="#B4D6DF"
                          borderWidth="1px"
                          _placeholder={{ color: "#0070C1" }}
                        />
                        <InputRightElement
                          mt={"2px"}
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          <PassIcon />
                        </InputRightElement>
                      </InputGroup>
                    </VStack>
                  )}
                />
              )}
            </VStack>

            <VStack w="100%" align="stretch" spacing="16px">
              <Controller
                control={control}
                name="last_name"
                rules={{ required: true }}
                render={({ field }) => (
                  <VStack align="stretch" spacing="4px">
                    <Text fontSize="14px" fontWeight="bold">
                      Last Name*
                    </Text>
                    <Input
                      {...field}
                      placeholder="Enter last name"
                      h="44px"
                      bg="#F5F7F9"
                      width={"300px"}
                      borderRadius="10px"
                      borderColor="#B4D6DF"
                      borderWidth="1px"
                      _placeholder={{ color: "#0070C1" }}
                    />
                  </VStack>
                )}
              />

              <Controller
                control={control}
                name="phone"
                rules={{ required: true }}
                render={({ field }) => (
                  <VStack align="stretch" spacing="4px">
                    <Text fontSize="14px" fontWeight="bold">
                      Phone*
                    </Text>
                    <Input
                      {...field}
                      placeholder="Enter phone"
                      h="44px"
                      bg="#F5F7F9"
                      width={"300px"}
                      borderRadius="10px"
                      borderColor="#B4D6DF"
                      borderWidth="1px"
                      _placeholder={{ color: "#0070C1" }}
                    />
                  </VStack>
                )}
              />

              <Controller
                control={control}
                name="birthday"
                render={({ field }) => (
                  <VStack align="stretch" spacing="4px">
                    <Text fontSize="14px" fontWeight="bold">
                      Birthday*
                    </Text>
                    <Input
                      textColor={"#0070C1"}
                      placeholder="Select date"
                      {...field}
                      type="date"
                      h="44px"
                      bg="#F5F7F9"
                      width={"300px"}
                      borderRadius="10px"
                      borderColor="#B4D6DF"
                      borderWidth="1px"
                    />
                  </VStack>
                )}
              />

              {isCreate && (
                <Controller
                  control={control}
                  name="password_confirmation"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <VStack align="stretch" spacing="4px">
                      <Text fontSize="14px" fontWeight="bold">
                        Password Confirmation*
                      </Text>
                      <InputGroup>
                        <Input
                          type={showConfirmPass ? "text" : "password"}
                          {...field}
                          placeholder="Confirm password"
                          h="44px"
                          bg="#F5F7F9"
                          width={"300px"}
                          borderRadius="10px"
                          borderColor="#B4D6DF"
                          borderWidth="1px"
                          _placeholder={{ color: "#0070C1" }}
                        />
                        <InputRightElement
                          mt={"2px"}
                          onClick={() => setShowConfirmPass((prev) => !prev)}
                        >
                          <PassIcon />
                        </InputRightElement>
                      </InputGroup>
                    </VStack>
                  )}
                />
              )}
            </VStack>
          </HStack>

          {isCreate && !isStudentsPage ? (
            <VStack align="stretch" spacing="4px">
              <Text fontSize="14px" fontWeight="bold">
                Role*
              </Text>

              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select
                    textColor={"#0070C1"}
                    {...field}
                    h="44px"
                    bg="#F5F7F9"
                    width={"300px"}
                    borderRadius="10px"
                    borderColor="#B4D6DF"
                    borderWidth="1px"
                  >
                    <option value={3}>Teacher</option>
                    <option value={4}>Student</option>
                    <option value={6}>School Course Provider</option>
                  </Select>
                )}
              />
            </VStack>
          ) : null}

          <HStack justify="center" mt="4px">
            {isEdit ? (
              <>
                <Button
                  onClick={closeModal}
                  _hover={{ bgColor: "#F5F7F9" }}
                  bgColor="white"
                  borderWidth="1px"
                  borderColor="#434645"
                  fontFamily="Lato"
                  borderRadius="10px"
                  w="150px"
                  h="48px"
                  isDisabled={isEditing}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  w="150px"
                  h="48px"
                  borderRadius="10px"
                  fontFamily="Lato"
                  bg="#0070C1"
                  color="white"
                  isLoading={isEditing}
                  cursor={isValid ? "pointer" : "not-allowed"}
                  isDisabled={!isValid || isEditing}
                >
                  Save changes
                </Button>
              </>
            ) : (
              <Button
                type="submit"
                color="white"
                w="165px"
                h="48px"
                borderRadius="10px"
                fontFamily="Lato"
                bg="#0070C1"
                cursor={isValid ? "pointer" : "not-allowed"}
                isDisabled={!isValid || isPending}
                isLoading={isPending}
              >
                {isStudentsPage ? "Create student" : "Create user"}
              </Button>
            )}
          </HStack>
        </VStack>
      </ModalBody>
    </Modal>
  );
}
