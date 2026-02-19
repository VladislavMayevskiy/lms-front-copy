import { Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useGetUserById } from "api/admin/users/hooks";
import { useParams } from "react-router-dom";
import { Spinner } from "components/ui/spinner";
import EmailIcon from "assets/imgs/admin/email.svg?react";
import PhoneIcon from "assets/imgs/admin/phone.svg?react";
import BirthdayIcon from "assets/imgs/admin/birthday.svg?react";
import RoleIcon from "assets/imgs/admin/role.svg?react";
import UserInfoBox from "./box";
import UserBoxComponent from "components/ui/box/admin/users";
import { RolesByNumber } from "constants/roles";

export default function UserInformation() {
const { userId } = useParams<{ userId: string }>();
const id = Number(userId);
const { data: user, isLoading } = useGetUserById(id);


   if (isLoading) {
      return <Spinner isLoading={isLoading} />;
    }

    return (
        <UserBoxComponent>
          {isLoading && <Spinner isLoading={isLoading} />}
          <VStack align={'flex-start'}>
            <Heading fontSize={'20px'} fontFamily={'Lato'} mb={'16px'} fontWeight={'bold'}>User Information</Heading>
            <HStack w={'100%'}>
                <UserInfoBox>
                    <HStack justify={'space-between'} minW={0} w="100%" spacing={'5px'}>
                        <HStack>
                            <EmailIcon />
                            <Text fontWeight={'bold'}>Email</Text>
                            </HStack>
                        <Text noOfLines={1}>{user?.data.email}</Text>
                    </HStack>
                </UserInfoBox>
                <UserInfoBox>
                    <HStack justify={'space-between'} minW={0} w="100%" spacing={'5px'}>
                        <HStack>
                            <RoleIcon />
                            <Text fontWeight={'bold'}>Role</Text>
                            </HStack>
                        <Text noOfLines={1}>{RolesByNumber[user?.data.role as number]}</Text>
                    </HStack>
                </UserInfoBox>
                <UserInfoBox>
                    <HStack justify={'space-between'} minW={0} w="100%" spacing={'5px'}>
                        <HStack>
                            <BirthdayIcon />
                            <Text fontWeight={'bold'}>Birthday</Text>
                            </HStack>
                        <Text noOfLines={1}>{user?.data.birthday}</Text>
                    </HStack>
                </UserInfoBox>
               <UserInfoBox>
                    <HStack justify={'space-between'} minW={0} w="100%" spacing={'5px'}>
                        <HStack>
                            <PhoneIcon/>
                            <Text fontWeight={'bold'}>Phone</Text>
                            </HStack>
                        <Text noOfLines={1}>{user?.data.phone}</Text>
                    </HStack>
                </UserInfoBox>
            </HStack>
          </VStack>
       </UserBoxComponent>
    )
}