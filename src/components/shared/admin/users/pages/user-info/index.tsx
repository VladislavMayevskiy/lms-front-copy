import { HStack, VStack, Text } from "@chakra-ui/react";
import { useGetUserById } from "api/admin/users/hooks";
import { useParams } from "react-router-dom";
import { AdminLayout } from "components/ui/layouts/admin";
import { Spinner } from "components/ui/spinner";
import UserInformation from "./components/ui/information";
import UserCourses from "./components/ui/courses";
import UserActivity from "./components/ui/activity";
import UserModal from "components/shared/admin/users/components/modals";
import DeleteUsersModal from "components/shared/admin/users/components/modals/delete";

export default function AdminUsersInfo() {
  const { userId } = useParams<{ userId: string }>();
  const id = Number(userId);

  const { data: user, isLoading } = useGetUserById(Number.isFinite(id) && id > 0 ? id : 0);

  if (!userId || !Number.isFinite(id) || id <= 0) {
    return (
      <AdminLayout title="Invalid user">
        <UserModal />
        <DeleteUsersModal />
        <Text>Invalid user id</Text>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <UserModal />
        <DeleteUsersModal />
        <Spinner isLoading={isLoading} />
      </AdminLayout>
    );
  }

  if (!user) {
    return <Text>User not found</Text>;
  }

  return (
    <AdminLayout title={`${user.data.first_name} ${user.data.last_name}`}>
      <UserModal />
      <DeleteUsersModal />
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
