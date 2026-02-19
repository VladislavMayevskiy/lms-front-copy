import {
  ModalBody,
  Input,
  Button,
  Box,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";

import { ToastComponent } from "components/ui/toast";
import Modal from "components/ui/modal";
import LoadImg from "assets/imgs/admin/modal/Load.svg?react";
import ColorPicker from "modules/admin/schools/components/modals/school/colorPicker/index";

import {
  updateSchoolResolver,
  type UpdateSchoolSchema,
} from "modules/admin/schools/components/modals/school/validation/school.schema";

import { useModalStore } from "stores/modalStore";
import { useUpdateSchool } from "api/admin/schools/hooks";

export default function EditSchoolFromDistrictModal() {
  const { mutate: updateSchool, isPending } = useUpdateSchool();

  const { type, payload, closeModal } = useModalStore();
  const isOpen = type === "EDIT_ASSIGN_SCHOOL";

  const districtId: number | null = payload?.districtId ?? null;
  const schoolId: number | null = payload?.schoolId ?? null;
  const schoolData = payload?.data ?? null;

  const toast = ToastComponent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const defaultValues = useMemo<UpdateSchoolSchema>(
    () => ({
      name: "",
      phone: "",
      country_code: "",
      email: "",
      primary_color: "#E89623",
      secondary_color: "#0080C1",
      logo: null,
    }),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<UpdateSchoolSchema>({
    defaultValues,
    resolver: updateSchoolResolver,
    mode: "onChange",
  });

  useEffect(() => {
    if (!isOpen) return;

    if (!schoolData) {
      reset(defaultValues);
      return;
    }

    reset({
      name: schoolData.name ?? "",
      phone: schoolData.phone ?? "",
      email: schoolData.email ?? "",
      country_code: schoolData.country_code ?? "",
      primary_color: schoolData.primary_color ?? "#E89623",
      secondary_color: schoolData.secondary_color ?? "#0080C1",
      logo: null,
    });
  }, [isOpen, schoolData, reset, defaultValues]);

  const onDismiss = () => {
    reset(defaultValues);
    closeModal();
  };

  const onSuccessClose = () => {
    onDismiss();
    toast("School successfully edited");
  };

  const onSubmit = (formData: UpdateSchoolSchema) => {
    if (!schoolId) return;

    updateSchool(
      {
        id: schoolId,
        ...(districtId && { district_id: districtId }),
        ...formData,
      },
      {
        onSuccess: onSuccessClose,
      }
    );
  };

  const getBorderColor = (hasError: boolean) => (hasError ? "#F23B3B" : "#B4D6DF");
  const getPlaceholderColor = (hasError: boolean) => (hasError ? "#F23B3B" : "#434645");

  return (
    <Modal
      isOpen={isOpen}
      onClose={isPending ? () => {} : onDismiss}
      title="Edit school"
    >
      <ModalBody as="form" onSubmit={handleSubmit(onSubmit)} mt="8px">
        <VStack align="stretch" spacing="16px">
          <HStack spacing="32px" align="flex-start" w="100%">
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState: { error } }) => (
                <VStack align="stretch" spacing="4px" w="100%">
                  <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                    Name for school*
                  </Text>
                  <Input
                    {...field}
                    placeholder="Enter name"
                    h="44px"
                    fontFamily="Lato"
                    borderRadius="10px"
                    fontSize="14px"
                    borderWidth="1px"
                    width="100%"
                    bgColor="#F5F7F9"
                    _placeholder={{ color: getPlaceholderColor(Boolean(error?.message)) }}
                    borderColor={getBorderColor(Boolean(error?.message))}
                  />
                  {error?.message && (
                    <Text fontSize="12px" color="#F23B3B">
                      {error.message}
                    </Text>
                  )}
                </VStack>
              )}
            />

            <Controller
              control={control}
              name="country_code"
              render={({ field, fieldState: { error } }) => (
                <VStack align="stretch" spacing="4px" w="100%">
                  <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                    Country code*
                  </Text>
                  <Input
                    {...field}
                    placeholder="Enter country code (e.g. US)"
                    h="44px"
                    fontFamily="Lato"
                    borderRadius="10px"
                    fontSize="14px"
                    borderWidth="1px"
                    width="100%"
                    bgColor="#F5F7F9"
                    _placeholder={{ color: getPlaceholderColor(Boolean(error?.message)) }}
                    borderColor={getBorderColor(Boolean(error?.message))}
                  />
                  {error?.message && (
                    <Text fontSize="12px" color="#F23B3B">
                      {error.message}
                    </Text>
                  )}
                </VStack>
              )}
            />
          </HStack>

          <HStack spacing="32px" align="flex-start">
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState: { error } }) => (
                <VStack align="stretch" spacing="4px">
                  <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                    Phone*
                  </Text>
                  <Input
                    {...field}
                    placeholder="Enter phone"
                    h="44px"
                    fontFamily="Lato"
                    borderRadius="10px"
                    fontSize="14px"
                    borderWidth="1px"
                    width="300px"
                    bgColor="#F5F7F9"
                    _placeholder={{ color: getPlaceholderColor(Boolean(error?.message)) }}
                    borderColor={getBorderColor(Boolean(error?.message))}
                  />
                  {error?.message && (
                    <Text fontSize="12px" color="#F23B3B">
                      {error.message}
                    </Text>
                  )}
                </VStack>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <VStack align="stretch" spacing="4px">
                  <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                    Email*
                  </Text>
                  <Input
                    {...field}
                    placeholder="Enter email"
                    h="44px"
                    fontFamily="Lato"
                    borderRadius="10px"
                    fontSize="14px"
                    borderWidth="1px"
                    width="300px"
                    bgColor="#F5F7F9"
                    _placeholder={{ color: getPlaceholderColor(Boolean(error?.message)) }}
                    borderColor={getBorderColor(Boolean(error?.message))}
                  />
                  {error?.message && (
                    <Text fontSize="12px" color="#F23B3B">
                      {error.message}
                    </Text>
                  )}
                </VStack>
              )}
            />
          </HStack>

          <HStack spacing="32px" align="flex-start">
            <Controller
              control={control}
              name="primary_color"
              render={({ field, fieldState: { error } }) => (
                <VStack align="stretch" spacing="4px" position="relative">
                  <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                    Primary color*
                  </Text>

                  <Box
                    borderWidth="1px"
                    borderRadius="10px"
                    borderColor={getBorderColor(Boolean(error?.message))}
                    bg="#F5F7F9"
                    width="300px"
                    h="44px"
                    px="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    cursor="pointer"
                    onClick={() => {
                      const el = document.getElementById("primary-picker");
                      if (el) el.style.display = el.style.display === "none" ? "block" : "none";
                    }}
                  >
                    <Text fontFamily="Lato" fontSize="14px" color="#0070C1">
                      {field.value}
                    </Text>

                    <Box w="20px" h="20px" borderRadius="6px" border="1px solid #B4D6DF" bg={field.value} />
                  </Box>

                  <Box
                    id="primary-picker"
                    style={{ display: "none" }}
                    position="absolute"
                    top="74px"
                    ml="80px"
                    zIndex={200}
                  >
                    <ColorPicker color={field.value} onChange={(color: string) => field.onChange(color)} />
                  </Box>

                  {error?.message && (
                    <Text fontSize="12px" color="#F23B3B">
                      {error.message}
                    </Text>
                  )}
                </VStack>
              )}
            />

            <Controller
              control={control}
              name="secondary_color"
              render={({ field, fieldState: { error } }) => (
                <VStack align="stretch" spacing="4px" position="relative">
                  <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                    Secondary color*
                  </Text>

                  <Box
                    borderWidth="1px"
                    borderRadius="10px"
                    borderColor={getBorderColor(Boolean(error?.message))}
                    bg="#F5F7F9"
                    width="300px"
                    h="44px"
                    px="12px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    cursor="pointer"
                    onClick={() => {
                      const el = document.getElementById("secondary-picker");
                      if (el) el.style.display = el.style.display === "none" ? "block" : "none";
                    }}
                  >
                    <Text fontFamily="Lato" fontSize="14px" color="#0070C1">
                      {field.value}
                    </Text>

                    <Box w="20px" h="20px" borderRadius="6px" border="1px solid #B4D6DF" bg={field.value} />
                  </Box>

                  <Box
                    id="secondary-picker"
                    style={{ display: "none" }}
                    position="absolute"
                    top="74px"
                    ml="80px"
                    zIndex={200}
                  >
                    <ColorPicker color={field.value} onChange={(color: string) => field.onChange(color)} />
                  </Box>

                  {error?.message && (
                    <Text fontSize="12px" color="#F23B3B">
                      {error.message}
                    </Text>
                  )}
                </VStack>
              )}
            />
          </HStack>

          <Controller
            control={control}
            name="logo"
            render={({ field, fieldState: { error } }) => (
              <VStack align="stretch" spacing="8px" mt="4px">
                <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                  Logo
                </Text>

                <Box
                  borderWidth="1px"
                  borderRadius="10px"
                  borderColor={getBorderColor(Boolean(error?.message))}
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
                  <Text fontFamily="Lato" fontSize="14px" textColor="#0070C1">
                    Choose a file or drag it here
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
                  onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                />

                {error?.message && (
                  <Text fontSize="12px" color="#F23B3B">
                    {error.message}
                  </Text>
                )}
              </VStack>
            )}
          />

          <HStack justify="center" mt="4px" spacing="16px">
            <Button
              onClick={onDismiss}
              _hover={{ bgColor: "#F5F7F9" }}
              bgColor="white"
              borderWidth="1px"
              borderColor="#434645"
              fontFamily="Lato"
              borderRadius="10px"
              w="150px"
              h="48px"
              isDisabled={isPending}
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
              cursor={isValid ? "pointer" : "not-allowed"}
              isDisabled={!isValid}
              isLoading={isPending}
            >
              Save changes
            </Button>
          </HStack>
        </VStack>
      </ModalBody>
    </Modal>
  );
}
