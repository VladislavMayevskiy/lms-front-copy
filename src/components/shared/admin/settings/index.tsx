import React from "react";
import { VStack,HStack, Text, Input, Button, Divider, Box,} from "@chakra-ui/react";
import { AdminSettingsLayout } from "components/ui/layouts/settings";
import { useCurrentUserQuery, useUpdateCurrentUser } from "api/global/hooks";

export default function AdminSettings() {
  const { data: user } = useCurrentUserQuery();
  const { mutate: updateUser, isPending } = useUpdateCurrentUser();

  const firstNameRef = React.useRef<HTMLInputElement>(null);
  const lastNameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const phoneRef = React.useRef<HTMLInputElement>(null);

  const passwordRef = React.useRef<HTMLInputElement>(null);
  const confirmRef = React.useRef<HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload: any = {
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

    updateUser(payload, {
    });
  };

  return (
    <AdminSettingsLayout>
      <VStack as="form" spacing="32px" onSubmit={onSubmit}>
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

        <Divider width="100%" borderColor="#D6D9DE" />

        <Box bg="white" width="100%">
          <HStack align="flex-start" spacing="170px">
            <Text fontSize="20px" fontWeight="semibold" width="200px">
              Change password
            </Text>

            <HStack spacing={"30px"}>
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

        <Divider width="100%" borderColor="#D6D9DE" />

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
    </AdminSettingsLayout>
  );
}
