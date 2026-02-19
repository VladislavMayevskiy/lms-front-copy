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
  Input,
  InputGroup,
  InputLeftElement,
  AspectRatio
} from "@chakra-ui/react";
import UserLayout from "components/ui/layouts/user";
import { useNavigate } from "react-router-dom";
import { useGetUserCourses } from "api/user/courses/hooks";
import { useState, useMemo } from "react";
import SearchIcon from "assets/imgs/user/heroicons-outline/search.svg?react";
import { useTranslation } from "react-i18next";
import { Spinner } from "components/ui/spinner";

type Category = "all" | "not_started" | "started" | "completed";

export default function MyCourses() {
  const [category, setCategory] = useState<Category>("started");
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const categoryToStatus: Record<Category, number | undefined> = {
    all: undefined,
    not_started: 1,
    started: 2,
    completed: 3,
  };

  const { data: courses = [] , isLoading} = useGetUserCourses({progress_status: categoryToStatus[category],});

  const navigate = useNavigate();

  const filteredCourses = useMemo(() => {
    return courses.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [courses, search]);

    const categoryButtonStyle = (value: Category) => ({
    bg: category === value ? "#CFE7EB" : "white",
    color: "black",
    borderRadius: "99px",
    fontWeight: "medium",
  });
  return (
    <UserLayout>
      <Box mb="10px">
        <VStack align="flex-start" w="100%" fontFamily="Lato">
          <Heading fontSize="32px" fontWeight="medium" fontFamily="Lato">
            {t("user.myCourses.title")}
          </Heading>

          {/* Filter bar */}
          <Box mb={6} w="100%" className="flex md:flex-row flex-col justify-between md:items-center gap-4">
            <HStack className="w-full overflow-x-scroll gap-4">
              <Box>
                <Button {...categoryButtonStyle("all")} onClick={() => setCategory("all")} variant={category === "all" ? "solid" : "outline"}>
                  {t("user.myCourses.all")}
                </Button>
              </Box>
              <Box>
                <Button {...categoryButtonStyle("not_started")} onClick={() => setCategory("not_started")} variant={category === "not_started" ? "solid" : "outline"}>
                  {t("user.myCourses.notStarted")}
                </Button>
              </Box>
              <Box>
                <Button {...categoryButtonStyle("started")} onClick={() => setCategory("started")} variant={category === "started" ? "solid" : "outline"}>
                  {t("user.myCourses.inProgress")}
                </Button>
              </Box>
              <Box>
                <Button {...categoryButtonStyle("completed")} onClick={() => setCategory("completed")} variant={category === "completed" ? "solid" : "outline"}>
                  {t("user.myCourses.completed")}
                </Button>
              </Box>
            </HStack>

            <InputGroup w="320px">
              <InputLeftElement>
                <SearchIcon />
              </InputLeftElement>
              <Input
                placeholder={t("general.placeholders.search")}
                bg="white"
                border="1px solid #C7C7C7"
                h="40px"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
          </Box>
       {isLoading && <Spinner isLoading={isLoading} />}
{isLoading ? (
  <Spinner />
) : filteredCourses.length === 0 ? (
  <Text>{t("user.myCourses.noCourses")}</Text>
) : (
            <SimpleGrid spacing="24px" w="100%" className="grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <Box
                  className="lms-box"
                  key={course.id}
                  p="24px"
                  position="relative"
                  bg="white"
                  border="1px solid #B4D6DF"
                  borderRadius="14px"
                  w="100%"
                  maxW="560px"
                >
                <Box className="flex flex-col md:flex-row gap-5" w={'100%'}>
                  <AspectRatio ratio={{ base: 4 / 2, md: 5 / 3, lg: 16 / 9 }} w="100%" mb={3}>
                    <Image
                      src={course.image}
                      borderRadius="10px"
                      objectFit="cover"
                      className="w-full md:w-[220px] aspect-square max-h-[236px] md:max-h-full"
                    />
                    </AspectRatio>

                    <Box className="flex flex-col gap-4 md:gap-6" w={'100%'}>
                      <Box
                        bg="#FCE0B5"
                        color="#A94710"
                        px="8px"
                        py="2px"
                        borderRadius="6px"
                        className="lms-dark-badge w-fit"
                      >
                        <Text fontWeight="500" fontSize="14px">
                          {t("user.courses.modules", { count: course.modules_count })}
                        </Text>
                      </Box>

                      <Text
                        fontSize="22px"
                        fontWeight="700"
                        noOfLines={2}
                        maxW="230px"
                        lineHeight="28px"
                        minH="56px" 
                      >
                        {course.name}
                      </Text>

                      <VStack align="flex-start" w="100%">
                        <HStack>
                          <Text fontWeight="medium" color="#434645">
                            {t("user.courses.progress")}
                          </Text>
                          <Text fontWeight="semibold">
                            {course.progress} %
                          </Text>
                        </HStack>

                        <Progress
                          value={course.progress}
                          w="100%"
                          bg="#F5F7F9"
                          borderRadius="99px"
                          sx={{ "& > div": { backgroundColor: "#76B16B" } }}
                        />
                      </VStack>

                      <Button
                        h="44px"
                        px="24px"
                        py="10px"
                        border="1px solid #B4D6DF"
                        borderRadius="10px"
                        bg="white"
                        fontFamily="Lato"
                        onClick={() => navigate(`/learn/${course.id}`)}
                        className="md:self-start"
                      >
                       {course.progress_status === 1 ? t("user.courses.learn.start") : course.progress_status === 2 ? t("general.continue") : t("user.courses.learn.view")}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Box>
    </UserLayout>
  );
}
