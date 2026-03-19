import { Box,HStack,Text,Heading,Button,Divider,VStack,Image } from "@chakra-ui/react";
import UserLayout from "components/ui/layouts/user";
import Arrow from "assets/imgs/user/heroicons-outline/chevron.svg?react"
import { useShowCourse } from "api/user/courses/hooks";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useStartCourse } from "api/user/courses/hooks";
import { UserRoutes } from "constants/routes";
import { useNavigate } from "react-router-dom";
import PurchaseCourseModal from "../components/modal";
import { useTranslation } from "react-i18next";
import { Spinner } from "components/ui/spinner";
import { useCurrentUserQuery } from "api/global/hooks";

/**
 * Formats a duration stored in minutes to a human-readable string.
 * 90  → "1 h 30 min"
 * 45  → "45 min"
 * 120 → "2 h"
 */
function formatDurationMinutes(totalMinutes: number): string {
  if (!totalMinutes) return "0 min";
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

function ShowCourse() {
const { t } = useTranslation();
const { id } = useParams<{ id: string }>()
const { data, isLoading } = useShowCourse(Number(id))
const { data: user } = useCurrentUserQuery()
const  {mutate: startCourse, isPending} = useStartCourse();
const navigate = useNavigate()
const [openModule, setOpenModule] = useState<number | null>(null);


  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-full">
          <Spinner isLoading={isLoading} />
        </div>
      </UserLayout>
    );
  }

  if (!data) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-full">
          <Text fontSize="18px" fontFamily="Lato" color="#434645">{t("user.courses.courseNotFound")}</Text>
        </div>
      </UserLayout>
    );
  }

  const totalUnits = data.modules.reduce(
    (sum, m) => sum + m.units.length,
    0
  );
  const achievements = Array.isArray(data.achievements) ? data.achievements : [data.achievements]
  const onSubmit = () => {
      startCourse(data.id, {
        onSuccess: () => {
          navigate(`${UserRoutes.startCourse}/${data.id}`);
        },
    });
  };

  return (
    <UserLayout>
      <PurchaseCourseModal/>
      <Box className="flex md:flex-row flex-col gap-4 md:items-start">
        {isLoading && <Spinner isLoading={isLoading} />}
        <Box p={"24px"} bgColor={"white"} borderColor={"#B4D6DF"} borderWidth={"1px"} borderRadius={"10px"} className="lms-box w-full md:w-2/3 md:min-h-[892px]">

          <Heading fontFamily={"Lato"} fontSize="32px" fontWeight="medium" mb={4} noOfLines={2}>
             {data.name}
          </Heading>

          <Text mb={4} textColor={"#434645"} fontSize={"16px"} fontFamily={"Lato"} noOfLines={6}>
            {data.description}
          </Text>
          <Box mb={4} className="flex gap-3 flex-wrap">
            <Box bgColor={"#CAE0C3"} px={3} py={1} borderRadius="6px">
              <Text fontWeight={"medium"} fontSize="14px">{data.modules.length} {t("user.courses.learn.modules")}</Text>
            </Box>

            <Box bgColor={"#CAE0C3"} px={3} py={1} borderRadius="6px">
              <Text fontSize="14px">{totalUnits} {t("user.courses.learn.units")}</Text>
            </Box>

            <Box bgColor={"#CAE0C3"} px={3} py={1} borderRadius="6px">
              <Text fontSize="14px">{formatDurationMinutes(data.duration)}</Text>
            </Box>

            <Box bgColor={"#CAE0C3"} px={3} py={1} borderRadius="6px">
              <Text fontSize="14px">{t("user.courses.instructor")}: {data.instructor}</Text>
            </Box>
          </Box>
    {user?.is_subscribed === true ? (
          <Button
            bg="#0070C1"
            textColor={"white"}
            borderRadius="10px"
            px={6}
            py={3}
            mb={6}
            _hover={{ bg: "#005A9E" }}
            width={"134px"}
            height={"44px"}
            onClick={onSubmit}
            borderWidth={'1px'}
            borderColor={'#0070C1'}
            isLoading={isPending}
          >
            {t("user.courses.learn.startCourse")}
          </Button>
        ) : null}
            <Divider borderColor={"#B4D6DF"} borderWidth={"0.5px"} mb={5}/>
          <Heading fontSize="20px" fontWeight={"bold"} fontFamily={"Lato"} mb={3}>{t("user.courses.learn.aboutThisCourse")}</Heading>
          <Text fontSize="14px" lineHeight={"150%"} fontFamily={"Lato"} color="#434645" mb={6} noOfLines={6}>
            {data.about}
          </Text>

          <Heading fontSize="20px" fontWeight={"bold"} fontFamily={"Lato"} mb={3}>{t("user.courses.learn.whatYouWillAchieve")}</Heading>
          <VStack align="stretch" spacing={2}>

        {achievements.map((a, i) => (
          <Text fontSize={'14px'} fontFamily={'Lato'} key={i}>• {a}</Text>
        ))}

          </VStack>

        </Box>





        <Box flex="1" bg="white" p={4} borderColor={"#B4D6DF"} borderWidth={"1px"} borderRadius="12px" className="lms-box w-full md:w-1/3 md:min-h-[892px]">
          <Image
            src={data.image ?? undefined}
            borderRadius="10px"
            mb={4}
            h="200px"
            width={"100%"}
            objectFit="cover"
          />

          <Heading fontSize="20px" fontWeight={"bold"} fontFamily={"Lato"} mb={3}>{t("user.courses.learn.courseContent")}</Heading>

         
 {data.modules.map((module, index) => {
  const isOpen = openModule === module.id;

  return (
    <Box key={module.id} mb={4} >
      <VStack align="start">

        <Text fontWeight="bold" fontSize="15px" fontFamily="Lato" noOfLines={2}>
          {t("user.courses.learn.module")} {index + 1}: {module.description}
        </Text>

        <Text fontSize="14px" fontFamily="Lato" color="gray.500" noOfLines={2}>
          {module.description}
        </Text>

        {isOpen && (
          <VStack align="stretch" mt={2} spacing={2} w="100%">
            {module.units.map((unit, uIndex) => (
              <Box
                key={unit.id}
                px={3}
                py="13px"
                borderColor="#CAE0C3"
                borderWidth="1px"
                h="45px"
                borderRadius="8px"
                bg="white"
                className="lms-box w-full md:w-[352px]"
                display="flex"
                alignItems="center"
                overflow="hidden"
              >
                <Heading fontFamily="Lato" fontSize="15px" fontWeight="medium" noOfLines={1} overflow="hidden">
                  {t("user.courses.learn.unit")} {uIndex + 1}: {unit.description}
                </Heading>
              </Box>
            ))}
          </VStack>
        )}

        <HStack
          mt="1px"
          mb="1px"
          cursor="pointer"
          onClick={() =>
            setOpenModule(isOpen ? null : module.id)
          }
        >
          <Text textColor="#479AB1" fontSize="14px">
            {isOpen ? t("user.courses.learn.hideUnitDetails") : t("user.courses.learn.showUnitDetails")}
          </Text>
          <Arrow
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.2s"
            }}
          />
        </HStack>

        <Divider borderRadius="0.5px" borderColor="#B4D6DF" />
      </VStack>
    </Box>
  );
})}

        </Box>

      </Box>
</UserLayout>
  );
}

export default ShowCourse