import {
  ModalBody,
  Input,
  Button,
  Box,
  Text,
  VStack,
  HStack,
  Checkbox,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import Modal from "components/ui/modal";
import X from "assets/imgs/admin/modal/Close.svg?react";
import LoadImg from "assets/imgs/admin/modal/Load.svg?react";
import Chevron from "assets/imgs/admin/modal/chevron.svg?react";
import Check from "assets/imgs/admin/modal/check.svg?react";

import ColorPicker from "./colorPicker";
import { ToastComponent } from "components/ui/toast";

import { schoolSchema,type SchoolFormValues,type CreateSchoolSchema} from "./validation/school.schema";
import type { UpdateSchoolPayload } from "types/admin/payload/types";
import { SubscriptionType,type SubscriptionTypeValue } from "types/admin/subscription/types";

import { useCreateSchool, useUpdateSchool } from "api/admin/schools/hooks";
import { useGetDistricts } from "api/admin/districts/hooks";

import type { ApiDistrictTypeList } from "api/admin/districts/types";
import { useModalStore } from "stores/modalStore";

export default function SchoolModal() {
  const { mutate: createSchool, isPending } = useCreateSchool();
  const { mutate: updateSchool, isPending: isEditing } = useUpdateSchool();

  const { data: districtsResponse } = useGetDistricts();
  const districtsList: ApiDistrictTypeList =
    (districtsResponse as unknown as ApiDistrictTypeList) ??
    ({ data: [] } as ApiDistrictTypeList);

  const { type, payload, closeModal } = useModalStore();
  const toast = ToastComponent();
  const getErrorMessage = (err: unknown) => {
      const anyErr = err as any;
      return (
        anyErr?.response?.data?.message ||
        anyErr?.response?.data?.error ||
        anyErr?.message ||
        "Something went wrong"
        );
      };
  const isCreate = type === "CREATE_SCHOOL";
  const isEdit = type === "EDIT_SCHOOL";
  const isOpen = isCreate || isEdit;

  const selectedDistrictId = payload?.districtId ?? null;

  const schoolData = isEdit ? payload?.data ?? null : null;
  const schoolId = isEdit ? payload?.id : null;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      country_code: "",
      primary_color: "#E89623",
      secondary_color: "#0080C1",
      logo: null,
      subscription_type: SubscriptionType.INVOICE,
      subscription_active: true,
    },
  });

  const {
    isOpen: isDistrictsOpen,
    onToggle: toggleDistricts,
    onClose: closeDistricts,
  } = useDisclosure();

  const {
    isOpen: isPrimaryPickerOpen,
    onToggle: togglePrimaryPicker,
    onClose: closePrimaryPicker,
  } = useDisclosure();

  const {
    isOpen: isSecondaryPickerOpen,
    onToggle: toggleSecondaryPicker,
    onClose: closeSecondaryPicker,
  } = useDisclosure();

  const {
    isOpen: isSubscriptionTypeOpen,
    onToggle: toggleSubscriptionType,
    onClose: closeSubscriptionType,
  } = useDisclosure();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getBorderColor = (hasError: boolean) => (hasError ? "#F23B3B" : "#B4D6DF");
  const getPlaceholderColor = (hasError: boolean) => (hasError ? "#F23B3B" : "#434645");

  const [isCountryCodesOpen, setIsCountryCodesOpen] = useState(false);
  const toggleCountryCodes = () => setIsCountryCodesOpen((prev) => !prev);

  const resetToDefaults = (districtId?: number | null) => {
    reset({
      district_id: districtId ?? 0,
      name: "",
      phone: "",
      email: "",
      country_code: "",
      primary_color: "#E89623",
      secondary_color: "#0080C1",
      logo: null,

      subscription_type: SubscriptionType.INVOICE,
      subscription_active: true,
    });

    closeDistricts();
    closePrimaryPicker();
    closeSecondaryPicker();
    closeSubscriptionType();
    setIsCountryCodesOpen(false);
  };

  const handleClose = () => {
    resetToDefaults(selectedDistrictId);
    closeModal();
  };

  const watchedSubscriptionType = watch("subscription_type");
  const createIsInvoice =
    isCreate && watchedSubscriptionType === SubscriptionType.INVOICE;

  const editSubscriptionType: SubscriptionTypeValue | null =
    (schoolData?.subscription_type as SubscriptionTypeValue) ?? null;
  const editIsInvoice = isEdit && editSubscriptionType === SubscriptionType.INVOICE;

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && schoolData) {
      reset({
        district_id: schoolData.district?.id ?? 0,
        name: schoolData.name ?? "",
        phone: schoolData.phone ?? "",
        email: schoolData.email ?? "",
        country_code: schoolData.country_code ?? "",
        primary_color: schoolData.primary_color ?? "#E89623",
        secondary_color: schoolData.secondary_color ?? "#0080C1",
        logo: null,
        subscription_active:
          typeof schoolData.subscription_active === "boolean"
            ? schoolData.subscription_active
            : true,
      });

      closeDistricts();
      closePrimaryPicker();
      closeSecondaryPicker();
      closeSubscriptionType();
      setIsCountryCodesOpen(false);
    }

    if (isCreate) {
      resetToDefaults(selectedDistrictId);
    }
  }, [isOpen, isEdit, isCreate, schoolData, selectedDistrictId, reset]);

    const handleCloseEdit = () => {
    resetToDefaults();
    closeModal();
    toast("School successfully edited")
  };

  const handleCloseCreate = () => {
    resetToDefaults();
    closeModal();
    toast("School successfully created")
  };

  const onSubmit = (values: SchoolFormValues) => {
  const {
    district_id,
    subscription_type: formSubscriptionType,
    subscription_active,
    ...rest
  } = values;

  const basePayload = {
    ...rest,
    ...(district_id ? { district_id } : {}),
  };

  if (isEdit && schoolId) {
    const updatePayload: UpdateSchoolPayload = {
      id: schoolId,
      ...basePayload,
      ...(editIsInvoice && typeof subscription_active === "boolean"
        ? { subscription_active }
        : {}),
    };

    delete (updatePayload as any).subscription_type;

    updateSchool(updatePayload, { onSuccess: handleCloseEdit, onError: (error) => {toast(getErrorMessage(error))} });
    return;
  }

  if (!formSubscriptionType) {
    throw new Error("subscription_type is required in create mode");
  }

  const createPayload: CreateSchoolSchema = {
    ...basePayload,
    subscription_type: formSubscriptionType,
    ...(formSubscriptionType === SubscriptionType.INVOICE
      ? { subscription_active: Boolean(subscription_active) }
      : {}),
  };

  createSchool(createPayload, { onSuccess: handleCloseCreate, onError: (error) => {toast(getErrorMessage(error))} });
};


  const subscriptionTypeOptions = [
    { value: SubscriptionType.INVOICE, label: "INVOICE" },
    { value: SubscriptionType.STRIPE, label: "STRIPE" },
  ] as const;

  const countryCodes = [
  { code: "US", label: "United States" },
  { code: "UA", label: "Ukraine" },
  { code: "PL", label: "Poland" },
] as const;


  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit school" : "Create school"}
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
              name="country_code"
              render={({ field, fieldState: { error } }) => {
                const selectedCountry = countryCodes.find((c) => c.code === field.value);

                return (
                  <VStack align="stretch" spacing="4px" position="relative" w="100%">
                    <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                      Country code*
                    </Text>

                    <Box
                      borderWidth="1px"
                      borderRadius="10px"
                      borderColor={getBorderColor(Boolean(error?.message))}
                      bg="#F5F7F9"
                      minH="44px"
                      px="12px"
                      py="11px"
                      h="30px"
                      position="relative"
                      cursor="pointer"
                      onClick={toggleCountryCodes}
                    >
                      <Box display="flex" alignItems="center" pr="40px">
                        {!selectedCountry && (
                          <Text
                            fontFamily="Lato"
                            fontSize="14px"
                            color={error?.message ? "#F23B3B" : "#0070C1"}
                          >
                            Select country code
                          </Text>
                        )}

                        {selectedCountry && (
                          <Text fontFamily="Lato" fontSize="14px" color="#434645">
                            {selectedCountry.label}
                          </Text>
                        )}
                      </Box>

                      <Box
                        position="absolute"
                        right="12px"
                        top="50%"
                        transform={
                          isCountryCodesOpen
                            ? "translateY(-50%) rotate(180deg)"
                            : "translateY(-50%) rotate(0deg)"
                        }
                        transition="0.2s ease"
                      >
                        <Chevron />
                      </Box>
                    </Box>

                    {error?.message && (
                      <Text fontSize="12px" color="#F23B3B">
                        {error.message}
                      </Text>
                    )}

                    {isCountryCodesOpen && (
                      <Box
                        position="absolute"
                        top="78px"
                        left="0"
                        zIndex={100}
                        width="100%"
                        borderRadius="20px"
                        borderWidth="1px"
                        borderColor="#B4D6DF"
                        bg="white"
                        boxShadow="0 8px 25px rgba(0,0,0,0.15)"
                        py="10px"
                        px="22px"
                        maxH="260px"
                        overflowY="auto"
                      >
                        <VStack align="stretch" spacing="6px">
                          {countryCodes.map((country) => (
                            <HStack
                              key={country.code}
                              spacing="8px"
                              cursor="pointer"
                              onClick={() => {
                                field.onChange(country.code);
                                setIsCountryCodesOpen(false);
                              }}
                            >
                              <Checkbox
                                isChecked={field.value === country.code}
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
                              <Text fontFamily="Lato" fontSize="16px" color="#434645">
                                {country.label}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                );
              }}
            />
          </HStack>

          {isCreate && (
            <Controller
              control={control}
              name="subscription_type"
              render={({ field, fieldState: { error } }) => {
                const selected = subscriptionTypeOptions.find((o) => o.value === field.value);

                return (
                  <VStack align="stretch" spacing="4px" position="relative">
                    <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                      Subscription type*
                    </Text>

                    <Box
                      borderWidth="1px"
                      borderRadius="10px"
                      borderColor={getBorderColor(Boolean(error?.message))}
                      bg="#F5F7F9"
                      width="632px"
                      minH="44px"
                      px="12px"
                      py="6px"
                      position="relative"
                      cursor="pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSubscriptionType();
                      }}
                    >
                      <Box display="flex" alignItems="center" pr="40px" minH="32px">
                        {!selected && (
                          <Text
                            fontFamily="Lato"
                            fontSize="14px"
                            color={error?.message ? "#F23B3B" : "#0070C1"}
                            py="4px"
                          >
                            Select subscription type
                          </Text>
                        )}

                        {selected && (
                          <HStack
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
                              {selected.label}
                            </Text>

                            <Box
                              cursor="pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                field.onChange(undefined);
                              }}
                            >
                              <X />
                            </Box>
                          </HStack>
                        )}
                      </Box>

                      <Box
                        position="absolute"
                        right="12px"
                        top="50%"
                        transform={
                          isSubscriptionTypeOpen
                            ? "translateY(-50%) rotate(180deg)"
                            : "translateY(-50%) rotate(0deg)"
                        }
                        transition="0.2s ease"
                      >
                        <Chevron />
                      </Box>
                    </Box>

                    {error?.message && (
                      <Text fontSize="12px" color="#F23B3B">
                        {String(error.message)}
                      </Text>
                    )}

                    {isSubscriptionTypeOpen && (
                      <Box
                        position="absolute"
                        top="78px"
                        left="0"
                        zIndex={120}
                        width="624px"
                        borderRadius="20px"
                        borderWidth="1px"
                        borderColor="#B4D6DF"
                        bg="white"
                        boxShadow="0 8px 25px rgba(0,0,0,0.15)"
                        py="10px"
                        px="22px"
                        maxH="200px"
                        overflowY="auto"
                      >
                        <VStack align="stretch" spacing="8px">
                          {subscriptionTypeOptions.map((opt) => (
                            <HStack key={opt.value} spacing="8px">
                              <Checkbox
                                isChecked={field.value === opt.value}
                                onChange={() => {
                                  field.onChange(opt.value);
                                  closeSubscriptionType();
                                }}
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
                              <Text fontFamily="Lato" fontSize="16px" color="#434645">
                                {opt.label}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                );
              }}
            />
          )}
          {(isCreate ? createIsInvoice : editIsInvoice) && (
            <Controller
              control={control}
              name="subscription_active"
              render={({ field, fieldState: { error } }) => (
                <VStack align="stretch" spacing="6px">
                  <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                    Subscription active
                  </Text>

                  <HStack
                    borderWidth="1px"
                    borderRadius="10px"
                    borderColor={getBorderColor(Boolean(error?.message))}
                    bg="#F5F7F9"
                    minH="44px"
                    px="12px"
                    justify="space-between"
                  >
                    <Text fontFamily="Lato" fontSize="14px" color="#434645">
                      Allow subscription for this school
                    </Text>

                    <Checkbox
                      isChecked={Boolean(field.value)}
                      onChange={(e) => field.onChange(e.target.checked)}
                      icon={<Check />}
                      sx={{
                        ".chakra-checkbox__control": {
                          borderRadius: "5px",
                          borderColor: "#B4D6DF",
                          width: "20px",
                          height: "20px",
                          borderWidth: "1px",
                          bg: "white",
                        },
                      }}
                    />
                  </HStack>

                  {error?.message && (
                    <Text fontSize="12px" color="#F23B3B">
                      {String(error.message)}
                    </Text>
                  )}
                </VStack>
              )}
            />
          )}

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
            name="district_id"
            render={({ field, fieldState: { error } }) => {
              const selectedDistrict = districtsList.data.find((d) => d.id === field.value);

              return (
                <VStack align="stretch" spacing="4px" position="relative">
                  <Text fontFamily="Lato" fontSize="14px" fontWeight="bold">
                    District
                  </Text>

                  <Box
                    borderWidth="1px"
                    borderRadius="10px"
                    borderColor={getBorderColor(Boolean(error?.message))}
                    bg="#F5F7F9"
                    width="632px"
                    minH="44px"
                    px="12px"
                    py="6px"
                    position="relative"
                  >
                    <Box display="flex" flexWrap="wrap" gap="8px" maxH="44px" overflowY="auto" pr="40px">
                      {!selectedDistrict && (
                        <Text
                          fontFamily="Lato"
                          fontSize="14px"
                          color={error?.message ? "#F23B3B" : "#0070C1"}
                          py="4px"
                        >
                          Select district
                        </Text>
                      )}

                      {selectedDistrict && (
                        <HStack
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
                          <Text fontFamily="Lato" fontSize="14px" color="#434645" whiteSpace="nowrap">
                            {selectedDistrict.name}
                          </Text>

                          <Box
                            cursor="pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange(0);
                            }}
                          >
                            <X />
                          </Box>
                        </HStack>
                      )}
                    </Box>

                    <Box
                      position="absolute"
                      right="12px"
                      top="50%"
                      transform={
                        isDistrictsOpen
                          ? "translateY(-50%) rotate(180deg)"
                          : "translateY(-50%) rotate(0deg)"
                      }
                      transition="0.2s ease"
                      cursor="pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDistricts();
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

                  {isDistrictsOpen && (
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
                      maxH="260px"
                      overflowY="auto"
                    >
                      <VStack align="stretch" spacing="4px">
                        {districtsList.data.map((district) => (
                          <HStack key={district.id} spacing="8px">
                            <Checkbox
                              isChecked={field.value === district.id}
                              onChange={() => {
                                field.onChange(district.id);
                                toggleDistricts();
                              }}
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
                            <Text fontFamily="Lato" fontSize="16px" color="#434645">
                              {district.name}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </VStack>
              );
            }}
          />

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
                    onClick={() => togglePrimaryPicker()}
                  >
                    <Text fontFamily="Lato" fontSize="14px" color="#0070C1">
                      {String(field.value)}
                    </Text>

                    <Box w="20px" h="20px" borderRadius="6px" border="1px solid #B4D6DF" bg={String(field.value)} />
                  </Box>

                  {isPrimaryPickerOpen && (
                    <Box position="absolute" top="74px" ml="80px" zIndex={200}>
                      <ColorPicker color={String(field.value)} onChange={(color) => field.onChange(color)} />
                    </Box>
                  )}

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
                    onClick={() => toggleSecondaryPicker()}
                  >
                    <Text fontFamily="Lato" fontSize="14px" color="#0070C1">
                      {String(field.value)}
                    </Text>

                    <Box w="20px" h="20px" borderRadius="6px" border="1px solid #B4D6DF" bg={String(field.value)} />
                  </Box>

                  {isSecondaryPickerOpen && (
                    <Box position="absolute" top="74px" ml="80px" zIndex={200}>
                      <ColorPicker color={String(field.value)} onChange={(color) => field.onChange(color)} />
                    </Box>
                  )}

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
                      {(field.value as File).name}
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

          <HStack justify="center" mt="4px">
            {isEdit ? (
              <>
                <Button
                  onClick={handleClose}
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
                Create school
              </Button>
            )}
          </HStack>
        </VStack>
      </ModalBody>
    </Modal>
  );
}
