import UserLayout from "components/ui/layouts/user";
import { useGetCourses } from "api/user/courses/hooks";
import { NavLink } from "react-router-dom";
import {
  VStack,
  Box,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  Button,
  InputGroup,
  Input,
  InputLeftElement,
  Image,
  AspectRatio
} from "@chakra-ui/react";
import SearchIcon from "assets/imgs/user/heroicons-outline/search.svg?react";
import type { ApiCourseType } from "api/user/courses/types";
import { useMemo, useState } from "react";
import { UserRoutes } from "constants/routes";
import { CourseProgressByNumber } from "constants/course";
import CompleteCourseIcon from "assets/imgs/user/heroicons-outline/agree.svg?react"
import ContinueCourseSection from "./components";
import { useTranslation } from "react-i18next";
import { Spinner } from "components/ui/spinner";

type CourseCardPropse = {
  course: ApiCourseType;
};

type Category = "featured" | "recommended" | "most_popular" | "beginner" | null;

export default function Courses() {
  const [category, setCategory] = useState<Category>(null);
  const [search, setSearch] = useState("");
  const { data: courses = [], isLoading } = useGetCourses( category ? { category } : undefined );
  const { t } = useTranslation();
  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses;

    const q = search.toLowerCase();
    return courses.filter((course) =>
      course.name.toLowerCase().includes(q)
    );
  }, [courses, search]);

  const CourseCard = ({ course }: CourseCardPropse) => {

  const statusName = CourseProgressByNumber[course.progress_status]



  return (
      <VStack
        w="100%"
        maxW="550px"
        bg="white"
        border="1px solid #B4D6DF"
        borderRadius="20px"
        p="20px"
        spacing="6px"
        align="stretch"
        minH="380px"
        className="lms-box"
      >
        <AspectRatio
          ratio={{ base: 16 / 9, md: 6 / 4, lg: 16 / 9 }}
          w="100%"
          maxH="240px"
          mb={3}
        >
          <Image
            src={course.image}
            objectFit="cover"
            objectPosition={{ base: "center", md: "center" }}
            borderRadius="12px"
          />
        </AspectRatio>

        <Box
          bg="#FCE0B5"
          color="#A94710"
          px="8px"
          py="2px"
          borderRadius="6px"
          w="fit-content"
          className="lms-dark-badge"
        >
          <Text fontWeight="500" fontSize="14px">
            {t("user.courses.learn.modules", { count: course.modules_count })}
          </Text>
        </Box>

        <Text fontWeight="700" fontSize="22px" noOfLines={2}>
          {course.name}
        </Text>

        <Text fontSize="16px" color="#434645" noOfLines={2}>
          {course.description}
        </Text>

        <Box mt="auto" pt="8px" className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          {course?.progress_status === 3 ? (
            <HStack>
              <Text fontSize="14px" fontFamily="Lato" fontWeight="medium">
                {t("user.courses.learn.completed")}
              </Text>
              <CompleteCourseIcon />
            </HStack>
          ) : course?.progress_status === 2 ? (
          <HStack>
          <Text fontSize="14px" color="#434645">
              {t("user.courses.progress")}
            </Text>
              <Text fontSize="16px" color="black" fontWeight={'semibold'}>
              {course.progress}%
            </Text>
            </HStack>
          ) :  course.progress_status === 1 ? (
            <Text fontSize="14px" color="#434645">
              {t("user.courses.learn.notStarted")}
            </Text>
          ) : null}
          {statusName === 'Started' || statusName === 'Completed' ? (
            <Button
              // w="100px"
              h="44px"
              bg="white"
              border="1px solid #B4D6DF"
              borderRadius="10px"
              fontSize="14px"
              _hover={{ bgColor: 'white' }}
              as={NavLink}
              to={`${UserRoutes.startCourse}/${course.id}`}
              className="w-full md:w-auto"
            >
              {t("user.courses.learn.view")}
            </Button>
          ) : course.progress_status === 2 ? (
            <Button
              // w="100px"
              h="44px"
              bg="white"
              border="1px solid #B4D6DF"
              borderRadius="10px"
              _hover={{ bgColor: 'white' }}
              as={NavLink}
              to={`${UserRoutes.courseShow}/${course.id}`}
              className="w-full md:w-auto"
            >
              {t("user.courses.learn.start")}
            </Button>
          ) : (
            <Button
              // w="100px"
              h="44px"
              bg="white"
              border="1px solid #B4D6DF"
              borderRadius="10px"
              _hover={{ bgColor: 'white' }}
              as={NavLink}
              to={`${UserRoutes.courses}/${course.id}`}
              className="w-full md:w-auto"
            >
              {t("user.courses.learn.view")}
            </Button>
          )}
        </Box>
      </VStack>
    );
  };

  const categoryButtonStyle = (value: Category) => ({
    bg: category === value ? "#CFE7EB" : "white",
    color: "black",
    borderRadius: "99px",
    fontWeight: "medium",
    borderColor: category === value ? "#CFE7EB" : "white",
    borderWidth: "1px"
  });

  return (
    <UserLayout>
      <Box width="100%" fontFamily="Lato">
        <VStack align="flex-start">
          <ContinueCourseSection/>
          <Heading fontFamily={'Lato'} fontSize={'32px'} fontWeight={'medium'}>
            {t("user.courses.allCourses")}
          </Heading>

          <Box mb={6} className="flex md:flex-row flex-col w-full justify-between md:items-center gap-4">
            <HStack className="w-full overflow-x-scroll gap-4">
              <Box>
                <Button {...categoryButtonStyle("featured")} onClick={() => setCategory("featured")}>
                  {t("user.courses.featured")}
                </Button>
              </Box>

              <Box>
                <Button {...categoryButtonStyle("recommended")} onClick={() => setCategory("recommended")}>
                  {t("user.courses.recommended")}
                </Button>
              </Box>

              <Box>
                <Button {...categoryButtonStyle("most_popular")} onClick={() => setCategory("most_popular")}>
                  {t("user.courses.mostPopular")}
                </Button>
              </Box>

              <Box>
                <Button {...categoryButtonStyle("beginner")} onClick={() => setCategory("beginner")}>
                  {t("user.courses.beginnerLevel")}
                </Button>
              </Box>
            </HStack>

            <HStack gap={3}>
              <InputGroup>
                <InputLeftElement>
                  <SearchIcon />
                </InputLeftElement>
                <Input
                  placeholder={t("general.placeholders.search")}
                  bg="white"
                  border="1px solid #C7C7C7"
                  w="320px"
                  h="40px"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>

            </HStack>
          </Box>
        </VStack>
        {isLoading && <Spinner isLoading={isLoading} />}
{isLoading ? (
  <Spinner />
) : filteredCourses.length === 0 ? (
  <Text mt={10} fontSize="18px" color="#434645">
    {t("user.courses.nothingFound")}
  </Text>
) : (
  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={30} mb={10}>
    {filteredCourses.map((course) => (
      <CourseCard key={course.id} course={course} />
    ))}
  </SimpleGrid>
)}

      </Box>
    </UserLayout>
  );
}
