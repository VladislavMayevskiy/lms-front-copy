import {
  ModalBody,
  Input,
  Button,
  Box,
  Text,
  VStack,
  Checkbox,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Modal from "components/ui/modal";
import X from "assets/imgs/admin/modal/Close.svg?react";
import LoadImg from "assets/imgs/admin/modal/Load.svg?react";
import Chevron from "assets/imgs/admin/modal/chevron.svg?react";
import Check from "assets/imgs/admin/modal/check.svg?react";

import { ToastComponent } from "components/ui/toast";
import {
  createDistrictResolver,
  type CreateDistrictSchema,
} from "./validation/district.schema";

import { useGetSchools } from "api/admin/schools/hooks";
import type { ApiSchoolsList } from "api/admin/schools/types";

import { useCreateDistrict, useUpdateDistricts } from "api/admin/districts/hooks";
import { useModalStore  } from "stores/modalStore";
import { useGetSchoolsByDistrict } from "api/admin/community/hooks";

export default function DistrictModal() {
const { type, payload, closeModal, openModal } = useModalStore ();


const isCreate = type === "CREATE_DISTRICT";
const isEdit = type === "EDIT_DISTRICT";
const isOpen = isCreate || isEdit;
const toast = ToastComponent();

const districtId = isEdit ? payload?.id ?? 0 : 0;
const selectedDistrict = isEdit ? payload?.data ?? null : null;

const selectedDistrictId = isEdit ? payload?.id ?? null : null;

const getErrorMessage = (err: unknown) => {
      const anyErr = err as any;
      return (
        anyErr?.response?.data?.message ||
        anyErr?.response?.data?.error ||
        anyErr?.message ||
        "Something went wrong"
        );
      };

  const { mutate: createDistrict, isPending: isCreating } = useCreateDistrict();
  const { mutate: updateDistrict, isPending: isUpdating } = useUpdateDistricts();

  const { data: schoolsResponse } = useGetSchools();
  const schoolsList: ApiSchoolsList = (schoolsResponse as ApiSchoolsList) ?? { data: [] as any };

  const { schools: districtSchools } = useGetSchoolsByDistrict(districtId);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateDistrictSchema>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      schools: [],
      logo: null,
    },
    resolver: createDistrictResolver,
  });
  const initializedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSchoolsOpen, setIsSchoolsOpen] = useState(false);

  const getBorderColor = (hasError: boolean) =>
    hasError ? "#F23B3B" : "#B4D6DF";

  const getPlaceholderColor = (hasError: boolean) =>
    hasError ? "#F23B3B" : "#434645";

  const resetToEmpty = () =>
    reset({
      name: "",
      phone: "",
      email: "",
      schools: [],
      logo: null,
    });

  const handleCloseEdit = () => {
    resetToEmpty();
    closeModal();
    toast("District successfully edited")
  };

  const handleCloseCreate = () => {
    resetToEmpty();
    closeModal();
    toast("District successfully created")
  };

  const onSubmit = (formData: CreateDistrictSchema) => {
    if (isEdit && selectedDistrictId) {
      updateDistrict(
        {
          id: selectedDistrictId,
          ...formData,
        },
        {
          onSuccess: handleCloseEdit,
          onError: (error) => {toast(getErrorMessage(error))}
        }
      );
      return;
    }

    if (isCreate) {
      createDistrict(formData, {
        onSuccess: handleCloseCreate,
        onError: (error) => {toast(getErrorMessage(error))}
      });
    }
  };

useEffect(() => {
    if (!isOpen) return;

    initializedRef.current = false;

    if (isCreate) {
      resetToEmpty();
    }

    if (isEdit && selectedDistrict) {
      reset({
        name: selectedDistrict.name ?? "",
        phone: selectedDistrict.phone ?? "",
        email: selectedDistrict.email ?? "",
        schools: [],
        logo: null,
      });
    }
  }, [isOpen, isCreate, isEdit, selectedDistrict, reset]);

  useEffect(() => {
    if (!isOpen || !isEdit) return;
    if (initializedRef.current) return;

    if (!districtSchools || districtSchools.length === 0) return;

    reset(prev => ({
      ...prev,
      schools: districtSchools.map(s => s.id),
    }));

    initializedRef.current = true;
  }, [isOpen, isEdit, districtSchools, reset]);


  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title={isEdit ? "Edit district" : "Create district"}
    >
      <ModalBody as="form" onSubmit={handleSubmit(onSubmit)} mt="8px">
        <VStack align="stretch" spacing="16px">
          <HStack spacing="32px" align="flex-start">
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState: { error } }) => (
                <VStack align="stretch" spacing="4px">
                  <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                    Name*
                  </Text>
                  <Input
                    {...field}
                    placeholder="Enter name"
                    h="44px"
                    fontFamily="Lato"
                    borderRadius="10px"
                    fontSize="14px"
                    borderWidth="1px"
                    width="300px"
                    bgColor="#F5F7F9"
                    _placeholder={{
                      color: getPlaceholderColor(Boolean(error?.message)),
                    }}
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

            <VStack align="stretch" spacing="4px">
              <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                Name for district*
              </Text>
              <Input
                placeholder="Enter name for district"
                h="44px"
                fontFamily="Lato"
                borderRadius="10px"
                fontSize="14px"
                borderWidth="1px"
                width="300px"
                bgColor="#F5F7F9"
              />
            </VStack>
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
                    _placeholder={{
                      color: getPlaceholderColor(Boolean(error?.message)),
                    }}
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
                    _placeholder={{
                      color: getPlaceholderColor(Boolean(error?.message)),
                    }}
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

          <Controller
            control={control}
            name="schools"
            render={({ field, fieldState: { error } }) => {
              const selectedSchools: number[] = field.value || [];

              const toggleSchool = (id: number) => {
                if (selectedSchools.includes(id)) {
                  field.onChange(selectedSchools.filter(s => s !== id));
                } else {
                  field.onChange([...selectedSchools, id]);
                }
              };

              return (
                <VStack align="stretch" spacing="4px" position="relative">
                  <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                    School(s)*
                  </Text>

                  <Box
                    borderWidth="1px"
                    borderRadius="10px"
                    borderColor={getBorderColor(Boolean(error?.message))}
                    bg="#F5F7F9"
                    width="624px"
                    minH="44px"
                    px="12px"
                    py="6px"
                    position="relative"
                  >
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      gap="8px"
                      maxH="44px"
                      overflowY="auto"
                      pr="40px"
                    >
                      {selectedSchools.length === 0 && (
                        <Text
                          fontFamily="Lato"
                          fontSize="14px"
                          color={error?.message ? "#F23B3B" : "#0070C1"}
                          py="4px"
                        >
                          Select school(s)
                        </Text>
                      )}

                      {selectedSchools.map(schoolId => {
                        const school = schoolsList.data.find(
                          s => s.id === schoolId
                        );
                        if (!school) return null;

                        return (
                          <HStack
                            key={school.id}
                            px="10px"
                            py="4px"
                            borderRadius="10px"
                            borderWidth="1px"
                            borderColor="#B4D6DF"
                            bg="white"
                            spacing="6px"
                            width="fit-content"
                            maxW="max-content"
                          >
                            <Text
                              fontFamily="Lato"
                              fontSize="14px"
                              color="#434645"
                              whiteSpace="nowrap"
                            >
                              {school.name}
                            </Text>

                            <Box
                              cursor="pointer"
                              onClick={e => {
                                e.stopPropagation();
                                toggleSchool(school.id);
                              }}
                            >
                              <X />
                            </Box>
                          </HStack>
                        );
                      })}
                    </Box>

                    <Box
                      position="absolute"
                      right="12px"
                      top="50%"
                      transform={
                        isSchoolsOpen
                          ? "translateY(-50%) rotate(180deg)"
                          : "translateY(-50%) rotate(0deg)"
                      }
                      transition="0.2s ease"
                      cursor="pointer"
                      onClick={e => {
                        e.stopPropagation();
                        setIsSchoolsOpen(prev => !prev);
                      }}
                    >
                      <Chevron />
                    </Box>
                  </Box>

                  {error?.message && (
                    <Text fontSize="12px" color="#F23B3B">
                      {error.message}
                    </Text>
                  )}

                  {isSchoolsOpen && (
                    <Box
                      position="absolute"
                      top="78px"
                      left="0"
                      zIndex={100}
                      width="624px"
                      borderRadius="20px"
                      borderWidth="1px"
                      borderColor="#B4D6DF"
                      bg="white"
                      boxShadow="0 8px 25px rgba(0,0,0,0.15)"
                      py="10px"
                      px="22px"
                      minH="150px"
                    >
                      <VStack align="stretch" spacing="4px">
                        {schoolsList.data.map(school => (
                          <HStack key={school.id} spacing="8px">
                            <Checkbox
                              isChecked={selectedSchools.includes(school.id)}
                              onChange={() => toggleSchool(school.id)}
                              icon={<Check />}
                              sx={{
                                ".chakra-checkbox__control": {
                                  borderRadius: "5px",
                                  borderColor: "#B4D6DF",
                                  width: "20px",
                                  height: "20px",
                                  borderWidth: "1px",
                                },
                              }}
                            />
                            <Text
                              fontFamily="Lato"
                              fontSize="16px"
                              color="#434645"
                            >
                              {school.name}
                            </Text>
                          </HStack>
                        ))}

                        <Text
                          fontFamily="Lato"
                          fontSize="14px"
                          fontWeight="semibold"
                          textColor="#0070C1"
                          cursor="pointer"
                          textDecoration="underline"
                          onClick={() => {openModal("CREATE_SCHOOL", {districtId})}}
                        >
                          + Add new school
                        </Text>
                      </VStack>
                    </Box>
                  )}
                </VStack>
              );
            }}
          />

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
                  <Text
                    fontFamily="Lato"
                    fontSize="14px"
                    textColor="#0070C1"
                  >
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
                  onChange={e =>
                    field.onChange(e.target.files?.[0] ?? null)
                  }
                />

                {error?.message && (
                  <Text fontSize="12px" color="#F23B3B">
                    {error.message}
                  </Text>
                )}
              </VStack>
            )}
          />

  <HStack justify="center" mt="16px" spacing="16px">
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
        isLoading={isUpdating}
        cursor={isValid ? "pointer" : "not-allowed"}
        isDisabled={!isValid || isUpdating}
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
      isDisabled={!isValid || isCreating}
      isLoading={isCreating}
    >
      Create district
    </Button>
  )}
</HStack>

        </VStack>
      </ModalBody>
    </Modal>
  );
}
