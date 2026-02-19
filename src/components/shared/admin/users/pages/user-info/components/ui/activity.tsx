import { HStack, Text, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useCurrentUserQuery } from "api/global/hooks";
import { useGetUsersActivity } from "api/admin/users/hooks";
import CoursesFinishIcon from "assets/imgs/user/heroicons-outline/courses.svg?react";
import UnfinishCoursesIcon from "assets/imgs/user/heroicons-outline/unfinished.svg?react";
import HoursIcon from "assets/imgs/user/heroicons-outline/clock.svg?react";
import JoinedIcon from "assets/imgs/user/heroicons-outline/cake.svg?react";
import UserBoxComponent from "components/ui/box/admin/users";
import UserInfoBox from "./box";
import { Spinner } from "components/ui/spinner";

export default function UserActivity() {
    const formatDuration = (minutes?: string) => minutes ? (Number(minutes) / 60).toFixed(1) : "0.0";
    const { userId } = useParams<{ userId: string }>();
    const id = Number(userId);
    const { data: activity, isLoading} = useGetUsersActivity(id);
    const { data } = useCurrentUserQuery();
    const joinedAt = data?.created_at
    ? new Date(data.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

    if (isLoading) {
      return <Spinner isLoading={isLoading} />;
    }


    return (
        <UserBoxComponent width="40%" minH="356px">
          <VStack fontFamily={"Lato"} align={"flex-start"} h={'100%'}>
            <Text fontSize={"20px"} fontWeight={"bold"}>
              Your activity
            </Text>
            <VStack spacing={"5px"} mb={"20px"} w={'100%'}>
            <UserInfoBox>          
            <HStack justify={"space-between"}>
                  <HStack className="lms-svg-outline">
                    <CoursesFinishIcon />
                    <Text fontSize={"15px"} fontWeight={"bold"}>
                      Courses finished
                    </Text>
                  </HStack>
                  <Text fontSize={"15px"} fontWeight={"bold"}>
                    {activity?.completed_count ?? 0}
                  </Text>
                </HStack>
              </UserInfoBox>

            <UserInfoBox>    
                <HStack justify={"space-between"}>
                  <HStack className="lms-svg-outline">
                    <UnfinishCoursesIcon />
                    <Text fontSize={"15px"} fontWeight={"bold"}>
                      Unfinished courses
                    </Text>
                  </HStack>
                  <Text fontSize={"15px"} fontWeight={"bold"}>
                    {activity?.uncompleted_count ?? 0}
                  </Text>
                </HStack>
              </UserInfoBox>

            <UserInfoBox>
                <HStack justify={"space-between"}>
                  <HStack className="lms-svg-outline">
                    <HoursIcon />
                    <Text fontSize={"15px"} fontWeight={"bold"}>
                      Hours spent
                    </Text>
                  </HStack>
                  <Text fontSize={"15px"} fontWeight={"bold"}>
                    {formatDuration(activity?.total_duration)} h
                  </Text>
                </HStack>
              </UserInfoBox>
            </VStack>
            {/* End Your activity */}

            {/* Start Joined at */}
            <HStack width={"100%"} justify={"center"}>
              <JoinedIcon />
              <Text fontWeight={"semibold"} fontSize={"14px"} textColor={"#479AB1"}>
                Joined {joinedAt}
              </Text>
            </HStack>
            {/* End Joined at */}
          </VStack>
        </UserBoxComponent>
    )}