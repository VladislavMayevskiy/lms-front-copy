import {
  Box,
  Heading,
  HStack,
  Text,
  VStack,
  Image,
  Progress,
  Button,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useGetUserCourses } from "api/user/courses/hooks";
import { useTranslation } from "react-i18next";

export default function ContinueCourseSection() {
  const { data: activeCourses = [] } = useGetUserCourses({ progress_status: 2 });
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!activeCourses.length) {
    return (
      <VStack align="flex-start" w="100%" fontFamily="Lato" spacing="8px">
        <Heading fontSize="32px" fontWeight="medium" fontFamily={'Lato'}>
          {t("user.courses.continueLearning")}
        </Heading>
        <Text fontSize="18px" fontWeight="medium" fontFamily={'Lato'}>
          {t("user.courses.noActiveCourse")}
        </Text>
      </VStack>
    );
  }

  return (
    <Box>
      <VStack
        align="flex-start"
        w="100%"
        spacing="24px"
        fontFamily="Lato"
      >
        <Heading fontSize="32px" fontWeight="medium" fontFamily={'Lato'}>
          {t("user.courses.continueLearning")}
        </Heading>

        <SimpleGrid
          columns={{ base: 1, md: 1, lg: 1, xl: 2 }}
          spacing="24px"
          w="100%"
        >
          {activeCourses.map(course => (
            <Box
              key={course.id}
              p={{ base: "16px", md: "24px" }}
              position="relative"
              bg="white"
              border="1px solid #B4D6DF"
              borderRadius="14px"
            >
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={{ base: "12px", md: "20px" }}
                align="flex-start"
              >
                <Image
                  src={course.image}
                  w={{ base: "100%", md: "220px", lg: "210px" }}
                  h={{ base: "180px", md: "220px", lg: "210px" }}
                  borderRadius="10px"
                  objectFit="cover"
                />

                <VStack
                  align="flex-start"
                  flex="1"
                  minW={0}
                  w="100%"
                  spacing={{ base: "12px", md: "16px" }}
                >
                  <Box
                    position={{ base: "static", md: "absolute" }}
                    top="24px"
                    left="262px"
                    bg="#FCE0B5"
                    color="#A94710"
                    px="8px"
                    py="2px"
                    borderRadius="6px"
                    w="fit-content"
                  >
                    <Text fontWeight="500" fontSize="14px">
                      {t("user.courses.modules", {
                        count: course.modules_count,
                      })}
                    </Text>
                  </Box>

                  <Text
                    fontSize="22px"
                    fontWeight="700"
                    noOfLines={2}
                    maxW={{ base: "100%", md: "200px" }}
                    position={{ base: "static", md: "absolute" }}
                    top="68px"
                  >
                    {course.name}
                  </Text>

                  <VStack
                    align="flex-start"
                    w="100%"
                    spacing="8px"
                    mt={{ base: "4px", md: "115px" }}
                  >
                    <HStack spacing="6px">
                      <Text fontWeight="medium" color="#434645">
                        {t("user.courses.progress")}
                      </Text>
                      <Text fontWeight="semibold">
                        {course.progress} %
                      </Text>
                    </HStack>

                    <Progress
                      value={course.progress}
                      w={{ base: "100%", md: "100%" }}
                      minW={'200px'}
                      bg="#F5F7F9"
                      borderRadius="99px"
                      sx={{
                        "& > div": { backgroundColor: "#76B16B" },
                      }}
                    />
                  </VStack>

                  <Button
                    h="44px"
                    px="24px"
                    border="1px solid #B4D6DF"
                    borderRadius="10px"
                    bg="white"
                    fontFamily="Lato"
                    position={{ base: "static", md: "absolute" }}
                    top="200px"
                    w={{ base: "100%", md: "20%" , lg: "20%"}}
                    mt={{ base: "12px", md: 0 }}
                    onClick={() => navigate(`/learn/${course.id}`)}
                  >
                    {t("general.continue")}
                  </Button>
                </VStack>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
