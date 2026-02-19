import {
  Box,
  Text,
  Input,
  Button,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthLayout } from "components/ui/layouts/auth";
import { AuthRoutes } from "constants/routes";
import { forgotPasswordResolver } from "./validation/forgotPassword.schema";
import type { ForgotPasswordSchema } from "./validation/forgotPassword.schema";
import { useForgotPassword } from "api/auth/hooks";

function ForgotPassword() {
  const navigate = useNavigate();
  const { mutate, isPending } = useForgotPassword();
  const { control, handleSubmit } = useForm<ForgotPasswordSchema>({
    defaultValues: {
      email: '',
    },
    resolver: forgotPasswordResolver,
  });

  const onSubmit = (formData: ForgotPasswordSchema) => {
    mutate(formData, {
      onSuccess: () => {
        navigate(AuthRoutes.login);
      },
      onError: (error) => {
        toast.error(error.response?.data.message || error.message);
      },
    });
  };

  return (
    <AuthLayout title="FORGOT PASSWORD">
      <Box as="form" onSubmit={handleSubmit(onSubmit)} w={"full"}>
        <Text
          mt={5}
          fontFamily={"text"}
          textColor={"gray.500"}
          textAlign={"center"}
        >
          Enter your email. We will send you a link to change your password.
        </Text>

        {/*Email Input*/}
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <VStack mt={10} spacing={3}>

              <Box w={"100%"} display="flex" justifyContent="flex-start">
                <Text fontFamily={"text"} fontSize={18}>Email Address</Text>
              </Box>

              <Box w={"100%"} display="flex" justifyContent="flex-start">
                <Input
                  {...field}
                  borderColor={"#479AB1"}
                  borderWidth={1}
                  bgColor={"#EAFBFF"}
                  borderRadius={16}
                  width="full"
                  height={58}
                  fontFamily={"text"}
                  placeholder="Enter email address"
                  _placeholder={{ color: "#479AB1" }}
                />
              </Box> 

            </VStack>
          )}
        />
        {/*End */}

        <VStack>
          <Button
            isDisabled={isPending}
            isLoading={isPending}
            type="submit"
            _hover={{ bgColor: "#f6630eff" }}
            mt={9}
            mr={4}
            fontFamily={"text"}
            width="full"
            height={14}
            borderRadius={16}
            fontSize={20}
            textColor={"white"}
            bgColor={"#F27D3B"}
          >
            SUBMIT
          </Button>
          <HStack>
          </HStack>
        </VStack>
      </Box>
    </AuthLayout>
  );
};

export default ForgotPassword;