import {
  Box,
  Divider,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import UserBoxComponent from "components/ui/box/admin/users";
import { useParams } from "react-router-dom";
import { useGetUserAssignedCourses } from "api/admin/users/hooks";
import { Spinner } from "components/ui/spinner";
export default function UserCourses() {
const { userId } = useParams<{ userId: string }>();
const id = Number(userId);
const {data, isLoading} = useGetUserAssignedCourses(id);

if (isLoading) {
  return <Spinner isLoading={isLoading} />;
}
  return (
    <UserBoxComponent minH="356px">
      <VStack align="stretch" spacing="14px" w="100%" minW={0}>
        <HStack justify="space-between" w="100%" minW={0} spacing="10px">
          <Heading
            fontSize="20px"
            fontFamily="Lato"
            fontWeight={'bold'}
            letterSpacing="-0.2px"
            minW={0}
            isTruncated
          >
            Assigned courses
          </Heading>

        </HStack>

        <VStack
          align="stretch"
          spacing="10px"
          w="100%"
          minW={0}
          borderColor="#D7E9F1"
          borderRadius="14px"
          bg="white"
          h={'100%'}
        >
          {data && data.length > 0 ? (
            data.map((course) => (
              <Box
                key={course.id}  
                w="100%"
                minW={0}
                gap="10px"
                border="1px solid"
                borderColor="#D7E9F1"
                borderRadius="12px"
                px="20px"
                py="10px"
                bg="white"
                overflow="hidden"
              >
                <HStack w={'100%'} justify="space-between">
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    maxW={"600px"}
                    isTruncated
                  >
                    {course.name}
                  </Text>
                  <Text
                    fontSize="16px"
                    fontWeight="500"
                    minW={0}
                    isTruncated
                  >
                    {course.progress ?? "-"}%
                  </Text>
                </HStack>
              </Box>
            ))
          ) : (
            <Text>No courses assigned</Text>
          )}
        </VStack>
          <Divider borderColor={'#B4D6DF'}/>

        <VStack align="stretch" spacing="10px" w="100%" minW={0}>

        </VStack>
      </VStack>
    </UserBoxComponent>
  );
}
