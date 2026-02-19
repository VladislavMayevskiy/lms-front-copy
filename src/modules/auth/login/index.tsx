import {
  Box,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { AuthLayout } from "components/ui/layouts/auth";
import { UserRoutes, AuthRoutes } from "constants/routes";
import { loginResolver } from "./validation/login.schema";
import type { LoginSchema } from "./validation/login.schema";
import { useLogin } from "api/auth/hooks";
import { localStore } from "stores/localStore";

function LogIn() {
  const navigate = useNavigate();
  const setToken = localStore((store) => store.setToken);
  const [passHide, setPassHide] = useState(false);
  const { mutate, isPending } = useLogin();
  const { control, handleSubmit } = useForm<LoginSchema>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: loginResolver,
  });

  const onSubmit = (formData: LoginSchema) => {
    mutate(formData, {
      onSuccess: ({ data }) => {
        setToken(data.token);
        navigate(UserRoutes.courses);
      },
      onError: (error) => {
        toast.error(error.response?.data.message || error.message);
      }
    });
  };

  return (
    <AuthLayout title="LOG IN">
      <Box as="form" onSubmit={handleSubmit(onSubmit)} w={"full"}>
        {/*Email Input*/}
        <VStack mt={10} gap={3}>
          <Box w={"100%"} display="flex" justifyContent="flex-start">
            <Text fontFamily={"text"} fontSize={18}>Email Address</Text>
          </Box>

          <Box w={"100%"} display="flex" justifyContent="flex-start">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  borderColor={"#479AB1"}
                  borderWidth={1}
                  bgColor={"#EAFBFF"}
                  borderRadius={16}
                  width="full"
                  height={58}
                  fontFamily={"text"}
                  placeholder="Enter email address"
                  _placeholder={{color:"#479AB1"}}
                  {...field}
                />
              )}
            />
          </Box>
        </VStack>
        {/*End */}

        {/*Password Input*/}
        <VStack mt={10} gap={3}>
          <Box w={"100%"} display="flex" justifyContent="flex-start">
            <Text fontFamily={"text"} fontSize={18}>Password</Text>
          </Box>

          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Box w={"100%"} display="flex" justifyContent="flex-start">
                <InputGroup>
                  <Input
                    type={passHide ? "text" : "password"}
                    borderColor={"#479AB1"}
                    borderWidth={1}
                    bgColor={"#EAFBFF"}
                    borderRadius={16}
                    width="full"
                    height={58}
                    fontFamily={"text"}
                    placeholder="Enter email address"
                    _placeholder={{ color: "#479AB1" }}
                    {...field}
                  />
                  <InputRightElement>
                    <IconButton
                      mr={14}
                      mt={5}
                      color={"#479AB1"}
                      bg="transparent" _hover={{ bg: "transparent" }}
                      _active={{ bg: "transparent" }} aria-label={passHide? "Hide password" : "Show password"}
                      onClick={() => setPassHide(!passHide)}
                    >
                      {passHide ? <AiOutlineEye size={25} /> : <AiOutlineEyeInvisible size={25} />}
                    </IconButton>
                  </InputRightElement>
                </InputGroup>
              </Box>
            )}
          />
        </VStack>
        {/*End*/}

        <HStack gap={3} mt={3}>
          <Text
            color={"blue.500"}
            fontFamily={"text"}
            onClick={() => navigate(AuthRoutes.forgotPassword)}
            cursor={"pointer"}
          >
            Forgot Password?
          </Text>
        </HStack>

        <VStack>
          <Button
            disabled={isPending}
            isLoading={isPending}
            type="submit"
            _hover={{bgColor: "#f6630eff"}}
            mt={9}
            mr={4}
            fontFamily={"text"}
            width="full"
            height={14}
            borderRadius={16}
            fontSize={20}
            color={"white"}
            bgColor={"#F27D3B"}
          >
            LOG IN
          </Button>
          <HStack>
          </HStack>
        </VStack>
      </Box>
    </AuthLayout>
  );
};

export default LogIn;