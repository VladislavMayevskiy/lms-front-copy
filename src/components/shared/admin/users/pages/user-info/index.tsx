import { HStack, VStack, Text } from "@chakra-ui/react";
import { useGetUserById } from "api/admin/users/hooks";
import { useParams } from "react-router-dom";
import { AdminLayout } from "components/ui/layouts/admin";
import { Spinner } from "components/ui/spinner";
import UserInformation from "./components/ui/information";
import UserCourses from "./components/ui/courses";
import UserActivity from "./components/ui/activity";

export default function AdminUsersInfo() {
  const { userId } = useParams<{ userId: string }>();
  const id = Number(userId);

  if (!userId || !Number.isFinite(id)) {
    return (
      <AdminLayout title="Invalid user">
        <Text>Invalid user id</Text>
      </AdminLayout>
    );
  }

  const { data: user, isLoading } = useGetUserById(id);

  if (isLoading) {
    return (
        <AdminLayout>
            <Spinner isLoading={isLoading} />
        </AdminLayout>
    )
  }

  if (!user) {
    return <Text>User not found</Text>;
  }

  return (
    <AdminLayout title={`${user.data.first_name} ${user.data.last_name}`}>
      <VStack spacing="24px" align="stretch">
        <UserInformation />
        <HStack h={'100%'}>
            <UserCourses />
            <UserActivity />
        </HStack>
      </VStack>
    </AdminLayout>
  );
}
