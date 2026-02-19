import { useState } from "react";
import {
  Box,
  Text,
  Input,
  Button,
  Checkbox,
  VStack,
  HStack,
  InputGroup,
  InputRightElement,
  IconButton,
  SelectField,
} from "@chakra-ui/react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { AuthLayout } from "components/ui/layouts/auth";
import { DatePicker } from "components/ui/fields/DatePicker";
import { GenderOptions } from "constants/gender";
import { UserRoutes, AuthRoutes } from "constants/routes";
import { createAccountResolver } from "../validation/createAccount.schema";
import type { CreateAccountSchema } from "../validation/createAccount.schema";
import { useCreateAccount } from "api/auth/hooks";
import { localStore } from "stores/localStore";

export const Form = () => {
  const navigate = useNavigate();
  const { mutate: createAccount, isPending } = useCreateAccount();
  const setToken = localStore((store) => store.setToken);
  const { control, handleSubmit, setError } = useForm<CreateAccountSchema>({
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      gender: 0,
      birthday: '',
      password: '',
      password_confirmation: '',
      role: 4,
      
    },
    resolver: createAccountResolver,
  });

  const [passHide, setPassHide] = useState(false);
  const [verifPassHide, setVerifyPassHide] = useState(false);
  const [checked, setChecked] = useState(false);

const onSubmit = (formData: CreateAccountSchema) => {
  const formattedBirthday = new Date(formData.birthday).toISOString().split("T")[0];

  createAccount({
    ...formData,
    birthday: formattedBirthday,
  }, {
    onSuccess: ({ data }) => {
      setToken(data.token);
      navigate(UserRoutes.courses);
    },
    onError: (error) => {
      toast.error(error.response?.data.message || error.message);

      if (error.status === 422 && error.response?.data.errors) {
        const errors = error.response.data.errors;

        Object.keys(errors).forEach((key) => {
          const formKey = key as keyof CreateAccountSchema;

          setError(formKey, {
            type: "manual",
            message: errors[formKey].join(', '),
          });
        });
      }
    }
  });
};


  return (
    <AuthLayout title="CREATE ACCOUNT">
      <Box as="form" onSubmit={handleSubmit(onSubmit)} w={"full"}>
        {/* First Name and Surname Input */}
        <HStack spacing={4} mt={50}>
          <Controller
            control={control}
            name="first_name"
            render={({ field }) => (
              <VStack spacing={3}>
                <Box w={"100%"} display="flex" justifyContent="flex-start">
                  <Text fontFamily={"text"} textAlign="left" fontSize={18}>First Name</Text>
                </Box>
                <Input
                  {...field}
                  borderColor={"#479AB1"}
                  borderWidth={1}
                  bgColor={"#EAFBFF"}
                  _placeholder={{ color: "#479AB1" }}
                  borderRadius={16}
                  width="full"
                  height={58}
                  placeholder="Enter first name"
                  fontFamily={"text"}
                />
              </VStack>
            )}
          />
          <Controller
            control={control}
            name="last_name"
            render={({ field }) => (
              <VStack spacing={3}>
                <Box w={"100%"} display="flex" justifyContent="flex-start">
                  <Text fontFamily={"text"} fontSize={18}>Surname</Text>
                </Box>

                <Input
                  {...field}
                  borderColor={"#479AB1"}
                  borderWidth={1}
                  bgColor={"#EAFBFF"}
                  borderRadius={16}
                  width="full"
                  height={58}
                  fontFamily={"text"}
                  placeholder="Enter surname"
                  _placeholder={{ color: "#479AB1" }}
                />
              </VStack>
            )}
          />
        </HStack>
        {/*End */}

        {/* Gender */}
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <VStack spacing={3}>
              <Box mt={10} w={"100%"} display="flex" justifyContent="flex-start">
                <Text fontFamily={"text"} textAlign="left" fontSize={18}>Gender</Text>
              </Box>
              <Box w={"100%"} display="flex" justifyContent="flex-start">
                <SelectField
                  {...field}
                  borderColor={"#479AB1"}
                  borderWidth={1}
                  bgColor={"#EAFBFF"}
                  _placeholder={{ color: "#479AB1" }}
                  borderRadius={16}
                  width="full"
                  height={58}
                  placeholder="Gender"
                  px={4}
                  fontFamily={"text"}
                >
                  {GenderOptions.map(({ label, value }) => (
                    <option key={`gender-select-${value}`} value={value}>{label}</option>
                  ))}
                </SelectField>
              </Box>
            </VStack>
          )}
        />
        {/* Gender End */}

        {/* Date */}
        <Controller
          control={control}
          name="birthday"
          render={({ field: { value, onChange } }) => (
            <VStack spacing={3}>
              <Box mt={10} w={"100%"} display="flex" justifyContent="flex-start">
                <Text fontFamily={"text"} textAlign="left" fontSize={18}>Birthday</Text>
              </Box>
              <Box w={"100%"} display="flex" justifyContent="flex-start">
                <DatePicker
                  selected={value ? new Date(value) : null}
                  onChange={(date) => onChange( date ? date.toISOString().split("T")[0] : "")}
                  dateFormat="yyyy-MM-dd"
                />
              </Box>
            </VStack>
          )}
        />
        {/* Date End */}

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

        {/*Password Input*/}
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <VStack mt={10} spacing={3}>
              <Box w={"100%"} display="flex" justifyContent="flex-start">
                <Text fontFamily={"text"} fontSize={18}>Password</Text>
              </Box>
      
              <Box w={"100%"} display="flex" justifyContent="flex-start">
                <InputGroup>
                  <Input
                    {...field}
                    type={passHide ? "text" : "password"}
                    borderColor={"#479AB1"}
                    borderWidth={1}
                    bgColor={"#EAFBFF"}
                    borderRadius={16}
                    width="full"
                    height={58}
                    fontFamily={"text"}
                    placeholder="Enter password"
                    _placeholder={{ color: "#479AB1" }}
                  />
                  <InputRightElement>
                    <IconButton
                      mr={14}
                      mt={5}
                      color={"#479AB1"}
                      bg="transparent"
                      _hover={{ bg: "transparent" }}
                      _active={{ bg: "transparent" }}
                      aria-label={passHide? "Hide password" : "Show password"}
                      icon={passHide ? <AiOutlineEye size={25} /> : <AiOutlineEyeInvisible size={25} />}
                      onClick={() => setPassHide(!passHide)}
                    />
                  </InputRightElement>
                </InputGroup>
              </Box>
            </VStack>
          )}
        />
        {/*End*/}

        {/*Password Confirmation Input*/}
        <Controller
          control={control}
          name="password_confirmation"
          render={({ field }) => (
            <VStack mt={10} spacing={3}>
              <Box w={"100%"} display="flex" justifyContent="flex-start">
                <Text fontFamily={"text"} fontSize={18}>Password Confirmation</Text>
              </Box>

              <Box w={"100%"} display="flex" justifyContent="flex-start">
                <InputGroup>
                  <Input
                    {...field}
                    type={verifPassHide ? "text" : "password"}
                    borderColor={"#479AB1"}
                    borderWidth={1}
                    bgColor={"#EAFBFF"}
                    borderRadius={16}
                    width="full"
                    height={58}
                    fontFamily={"text"}
                    placeholder="Enter password again"
                    _placeholder={{ color: "#479AB1" }}
                  />
                  <InputRightElement>
                    <IconButton
                      mr={14}
                      mt={5}
                      color={"#479AB1"}
                      bg="transparent"
                      _hover={{ bg: "transparent" }}
                      _active={{ bg: "transparent" }}
                      aria-label={verifPassHide ? "Hide password" : "Show password"}
                      icon={verifPassHide ? <AiOutlineEye size={25} /> : <AiOutlineEyeInvisible size={25} />}
                      onClick={() => setVerifyPassHide(!verifPassHide)}
                    />
                  </InputRightElement>
                </InputGroup>
              </Box>
            </VStack>
          )}
        />
        {/*End*/}

        <HStack spacing={2} mt={7}>
          <Checkbox isChecked={checked} onChange={(e) => setChecked(e.target.checked)} />
          <Text fontFamily={"text"} textColor={"gray.500"} >I have read and understand the</Text>
          <Text textColor={"blue.500"} fontFamily={"text"}>Privacy Policy</Text>
        </HStack>

        <VStack>
          <Button
            isDisabled={!checked || isPending}
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
            isLoading={isPending}
          >
            CREATE ACCOUNT
          </Button>
          <HStack>
            <Text fontFamily={"text"} textColor={"gray.500"}>Already have an account?</Text>
            <Text
              textColor={"blue.500"}
              fontFamily={"text"}
              onClick={() => navigate(AuthRoutes.login)}
              cursor={"pointer"}
            >
              Log In
            </Text>
          </HStack>
        </VStack>
      </Box>
    </AuthLayout>
  );
};
