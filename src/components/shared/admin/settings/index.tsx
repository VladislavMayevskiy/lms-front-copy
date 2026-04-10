import React from "react";
import {
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Divider,
  Box,
  Select,
  Checkbox,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { AdminSettingsLayout } from "components/ui/layouts/settings";
import { useCurrentUserQuery, useUpdateCurrentUser } from "api/global/hooks";
import { useGetDistricts } from "api/admin/districts/hooks";
import { useGetSchoolById, useUpdateSchool } from "api/admin/schools/hooks";
import type { UpdateSchoolSchema } from "modules/admin/schools/components/modals/school/validation/school.schema";
import { updateSchoolResolver } from "modules/admin/schools/components/modals/school/validation/school.schema";
import type { UpdateSchoolPayload } from "types/admin/payload/types";
import { MainButton } from "components/ui/button";
import { toast } from "react-toastify";
import { SubscriptionType } from "types/admin/subscription/types";

export default function AdminSettings() {
  const { data: user } = useCurrentUserQuery();
  const { mutate: updateUser, isPending } = useUpdateCurrentUser();
  const { mutate: updateSchool, isPending: isSchoolSaving } = useUpdateSchool();

  const firstNameRef = React.useRef<HTMLInputElement>(null);
  const lastNameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const phoneRef = React.useRef<HTMLInputElement>(null);

  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmRef = React.useRef<HTMLInputElement>(null);

  const schoolId = user?.school_id ?? 0;
  const isSchoolAdmin = user?.role === "SchoolAdmin";

  const { districts } = useGetDistricts();
  const {
    school,
    isLoading: isSchoolLoading,
    isError: isSchoolError,
  } = useGetSchoolById(isSchoolAdmin ? schoolId : 0);

  const logoFileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateSchoolSchema>({
    resolver: updateSchoolResolver,
    defaultValues: {
      district_id: undefined,
      title: "",
      name: "",
      phone: "",
      email: "",
      country_code: "",
      primary_color: "#E89623",
      secondary_color: "#0080C1",
      logo: null,
    },
  });

  const logoField = watch("logo");

  React.useEffect(() => {
    if (!(logoField instanceof File)) {
      setLogoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(logoField);
    setLogoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [logoField]);

  React.useEffect(() => {
    if (!school) return;
    reset({
      district_id: school.district_id || undefined,
      title: school.title ?? "",
      name: school.name ?? "",
      phone: school.phone ?? "",
      email: school.email ?? "",
      country_code: school.country_code ?? "",
      primary_color: school.primary_color ?? "#E89623",
      secondary_color: school.secondary_color ?? "#0080C1",
      logo: null,
    });
  }, [school, reset]);

  const onSubmitAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload: Record<string, unknown> = {
      first_name: firstNameRef.current?.value || "",
      last_name: lastNameRef.current?.value || "",
      email: emailRef.current?.value || "",
      phone: phoneRef.current?.value || "",
      gender: Number(user.gender ?? 1),
      birthday: user.birthday ?? "2000-01-01",
    };

    const newPassword = passwordRef.current?.value;
    const confirmPassword = confirmRef.current?.value;

    if (newPassword && confirmPassword) {
      payload.password = newPassword;
      payload.password_confirmation = confirmPassword;
    }

    updateUser(payload as never, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
      },
      onError: () => {
        toast.error("Could not update profile. Please check your information.");
      },
    });
  };

  const onSubmitSchool = handleSubmit((values) => {
    if (!schoolId) return;

    const payload: UpdateSchoolPayload = {
      id: schoolId,
      district_id: values.district_id,
      title: values.title,
      name: values.name,
      phone: values.phone,
      email: values.email,
      country_code: values.country_code,
      primary_color: values.primary_color,
      secondary_color: values.secondary_color,
      logo: values.logo instanceof File ? values.logo : undefined,
    };

    updateSchool(payload, {
      onSuccess: () => {
        toast.success("School settings saved");
        setValue("logo", null);
        if (logoFileInputRef.current) logoFileInputRef.current.value = "";
      },
      onError: (err: unknown) => {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err as Error)?.message ||
          "Could not save school settings";
        toast.error(message);
      },
    });
  });

  const logoDisplaySrc = logoPreviewUrl || school?.logo || null;

  return (
    <AdminSettingsLayout>
      <VStack spacing="40px" align="stretch" w="100%">
        {/* 1. Admin personal data */}
        <Box as="form" onSubmit={onSubmitAdmin}>
          <VStack spacing="32px" align="stretch">
            <Text fontSize="24px" fontWeight="semibold">
              Admin personal data
            </Text>

            <Box bg="white" width="100%">
              <HStack align="flex-start" spacing="170px">
                <Text fontSize="20px" fontWeight="semibold" width="200px">
                  Profile information
                </Text>

                <VStack spacing="30px" align="flex-start" flex="1">
                  <HStack spacing="30px">
                    <VStack alignItems="flex-start" flex="1">
                      <Text>First name</Text>
                      <Input
                        ref={firstNameRef}
                        defaultValue={user?.first_name}
                        bg="#F5F7F9"
                        borderColor="#B4D6DF"
                        borderRadius="16px"
                        h="44px"
                        width="400px"
                      />
                    </VStack>

                    <VStack alignItems="flex-start" flex="1">
                      <Text>Last name</Text>
                      <Input
                        ref={lastNameRef}
                        defaultValue={user?.last_name}
                        bg="#F5F7F9"
                        borderColor="#B4D6DF"
                        borderRadius="16px"
                        h="44px"
                        width="400px"
                      />
                    </VStack>
                  </HStack>

                  <HStack spacing="30px">
                    <VStack alignItems="flex-start" flex="1">
                      <Text>Email</Text>
                      <Input
                        ref={emailRef}
                        defaultValue={user?.email}
                        bg="#F5F7F9"
                        borderColor="#B4D6DF"
                        borderRadius="16px"
                        h="44px"
                        width="400px"
                      />
                    </VStack>

                    <VStack alignItems="flex-start" flex="1">
                      <Text>Phone number</Text>
                      <Input
                        ref={phoneRef}
                        defaultValue={user?.phone}
                        bg="#F5F7F9"
                        borderColor="#B4D6DF"
                        borderRadius="16px"
                        h="44px"
                        width="400px"
                      />
                    </VStack>
                  </HStack>
                </VStack>
              </HStack>
            </Box>

            <Divider borderColor="#D6D9DE" />

            <Box bg="white" width="100%">
              <HStack align="flex-start" spacing="170px">
                <Text fontSize="20px" fontWeight="semibold" width="200px">
                  Change password
                </Text>

                <HStack spacing="30px">
                  <VStack spacing="10px" align="flex-start" flex="1">
                    <Text>New password</Text>
                    <Input
                      ref={passwordRef}
                      type="password"
                      bg="#F5F7F9"
                      borderColor="#B4D6DF"
                      borderRadius="16px"
                      h="44px"
                      width="400px"
                    />
                  </VStack>

                  <VStack spacing="10px" align="flex-start" flex="1">
                    <Text>Confirm password*</Text>
                    <Input
                      ref={confirmRef}
                      type="password"
                      bg="#F5F7F9"
                      borderColor="#B4D6DF"
                      borderRadius="16px"
                      h="44px"
                      width="400px"
                    />
                  </VStack>
                </HStack>
              </HStack>
            </Box>

            <Divider borderColor="#D6D9DE" />

            <Button
              type="submit"
              isLoading={isPending}
              bg="#0070C1"
              textColor="white"
              width="150px"
              height="48px"
              borderRadius="10px"
              _hover={{ bgColor: "#0070C1" }}
            >
              Save changes
            </Button>
          </VStack>
        </Box>

        {/* 2. School data */}
        {isSchoolAdmin && (
          <>
            <Divider borderColor="#D6D9DE" />

            <Box as="form" onSubmit={onSubmitSchool}>
              <VStack spacing="32px" align="stretch">
                <Text fontSize="24px" fontWeight="semibold">
                  School settings
                </Text>

                {isSchoolError ? (
                  <Text color="red.500">
                    Could not load school details. Please try again later.
                  </Text>
                ) : isSchoolLoading && !school ? (
                  <Text color="gray.600">Loading school…</Text>
                ) : school ? (
                  <>
                    <Box bg="white" width="100%">
                      <HStack align="flex-start" spacing="170px">
                        <Text fontSize="20px" fontWeight="semibold" width="200px">
                          School profile
                        </Text>

                        <VStack spacing="24px" align="flex-start" flex="1">
                          <HStack spacing="30px" align="flex-start" w="100%">
                            <Controller
                              control={control}
                              name="district_id"
                              render={({ field }) => (
                                <VStack alignItems="flex-start" flex="1">
                                  <Text>District</Text>
                                  <Select
                                    bg="#F5F7F9"
                                    borderColor="#B4D6DF"
                                    borderRadius="16px"
                                    h="44px"
                                    w="400px"
                                    placeholder="Select district"
                                    value={field.value ?? ""}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      field.onChange(v ? Number(v) : undefined);
                                    }}
                                  >
                                    <option value="">—</option>
                                    {districts.map((d) => (
                                      <option key={d.id} value={d.id}>
                                        {d.name}
                                      </option>
                                    ))}
                                  </Select>
                                </VStack>
                              )}
                            />

                            <Controller
                              control={control}
                              name="country_code"
                              render={({ field, fieldState: { error } }) => (
                                <VStack alignItems="flex-start" flex="1">
                                  <Text>Country code</Text>
                                  <Input
                                    {...field}
                                    maxLength={2}
                                    bg="#F5F7F9"
                                    borderColor={error ? "#F23B3B" : "#B4D6DF"}
                                    borderRadius="16px"
                                    h="44px"
                                    width="400px"
                                  />
                                  {error?.message && (
                                    <Text fontSize="sm" color="#F23B3B">
                                      {error.message}
                                    </Text>
                                  )}
                                </VStack>
                              )}
                            />
                          </HStack>

                          <HStack spacing="30px" align="flex-start" w="100%">
                            <Controller
                              control={control}
                              name="name"
                              render={({ field, fieldState: { error } }) => (
                                <VStack alignItems="flex-start" flex="1">
                                  <Text>School name</Text>
                                  <Input
                                    {...field}
                                    bg="#F5F7F9"
                                    borderColor={error ? "#F23B3B" : "#B4D6DF"}
                                    borderRadius="16px"
                                    h="44px"
                                    width="400px"
                                  />
                                  {error?.message && (
                                    <Text fontSize="sm" color="#F23B3B">
                                      {error.message}
                                    </Text>
                                  )}
                                </VStack>
                              )}
                            />

                            <Controller
                              control={control}
                              name="title"
                              render={({ field }) => (
                                <VStack alignItems="flex-start" flex="1">
                                  <Text>Title</Text>
                                  <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    bg="#F5F7F9"
                                    borderColor="#B4D6DF"
                                    borderRadius="16px"
                                    h="44px"
                                    width="400px"
                                  />
                                </VStack>
                              )}
                            />
                          </HStack>

                          <HStack spacing="30px" align="flex-start" w="100%">
                            <Controller
                              control={control}
                              name="phone"
                              render={({ field, fieldState: { error } }) => (
                                <VStack alignItems="flex-start" flex="1">
                                  <Text>Phone</Text>
                                  <Input
                                    {...field}
                                    bg="#F5F7F9"
                                    borderColor={error ? "#F23B3B" : "#B4D6DF"}
                                    borderRadius="16px"
                                    h="44px"
                                    width="400px"
                                  />
                                  {error?.message && (
                                    <Text fontSize="sm" color="#F23B3B">
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
                                <VStack alignItems="flex-start" flex="1">
                                  <Text>Email</Text>
                                  <Input
                                    {...field}
                                    bg="#F5F7F9"
                                    borderColor={error ? "#F23B3B" : "#B4D6DF"}
                                    borderRadius="16px"
                                    h="44px"
                                    width="400px"
                                  />
                                  {error?.message && (
                                    <Text fontSize="sm" color="#F23B3B">
                                      {error.message}
                                    </Text>
                                  )}
                                </VStack>
                              )}
                            />
                          </HStack>

                          <HStack spacing="30px" align="flex-start" w="100%">
                            <Controller
                              control={control}
                              name="primary_color"
                              render={({ field, fieldState: { error } }) => (
                                <VStack alignItems="flex-start" flex="1">
                                  <Text>Primary color</Text>
                                  <Input
                                    {...field}
                                    bg="#F5F7F9"
                                    borderColor={error ? "#F23B3B" : "#B4D6DF"}
                                    borderRadius="16px"
                                    h="44px"
                                    width="400px"
                                  />
                                  {error?.message && (
                                    <Text fontSize="sm" color="#F23B3B">
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
                                <VStack alignItems="flex-start" flex="1">
                                  <Text>Secondary color</Text>
                                  <Input
                                    {...field}
                                    bg="#F5F7F9"
                                    borderColor={error ? "#F23B3B" : "#B4D6DF"}
                                    borderRadius="16px"
                                    h="44px"
                                    width="400px"
                                  />
                                  {error?.message && (
                                    <Text fontSize="sm" color="#F23B3B">
                                      {error.message}
                                    </Text>
                                  )}
                                </VStack>
                              )}
                            />
                          </HStack>

                          {school?.subscription_type === SubscriptionType.INVOICE && (
                            <Controller
                              control={control}
                              name="subscription_active"
                              render={({ field }) => (
                                <Checkbox
                                  isChecked={!!field.value}
                                  onChange={(e) => field.onChange(e.target.checked)}
                                >
                                  Subscription active (invoice)
                                </Checkbox>
                              )}
                            />
                          )}

                          <HStack align="flex-start" spacing="30px" w="100%">
                            <Text fontSize="20px" fontWeight="semibold" width="200px" flexShrink={0}>
                              Logo
                            </Text>

                            <HStack spacing="30px" align="flex-start" flex="1">
                              <Box
                                w="100px"
                                h="100px"
                                borderRadius="full"
                                overflow="hidden"
                                bg="#E9ECEF"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexShrink={0}
                              >
                                {logoDisplaySrc ? (
                                  <img
                                    src={logoDisplaySrc}
                                    alt="School logo"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <Text fontWeight="bold" fontSize="28px" color="gray.500">
                                    {school?.name?.charAt(0) ?? "S"}
                                    {school?.name?.charAt(1) ?? "C"}
                                  </Text>
                                )}
                              </Box>

                              <VStack align="flex-start" spacing="12px">
                                <MainButton
                                  type="button"
                                  isLoading={isSchoolSaving}
                                  disabled={isSchoolSaving}
                                  onClick={() => logoFileInputRef.current?.click()}
                                >
                                  {isSchoolSaving ? "Saving…" : "Change logo"}
                                </MainButton>
                                <input
                                  ref={logoFileInputRef}
                                  type="file"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setValue("logo", file, { shouldValidate: true });
                                  }}
                                />
                                {errors.logo && (
                                  <Text fontSize="sm" color="#F23B3B">
                                    {String(errors.logo.message)}
                                  </Text>
                                )}
                                <Text fontSize="sm" color="gray.600">
                                  Logo is saved when you click &quot;Save school settings&quot;.
                                </Text>
                              </VStack>
                            </HStack>
                          </HStack>
                        </VStack>
                      </HStack>
                    </Box>

                    <MainButton type="submit" disabled={isSchoolSaving || isSchoolLoading}>
                      {isSchoolSaving ? "Saving…" : "Save school settings"}
                    </MainButton>
                  </>
                ) : null}
              </VStack>
            </Box>
          </>
        )}
      </VStack>
    </AdminSettingsLayout>
  );
}
