import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ActionMenu } from "components/ui/actionMenu";
import { Avatar } from "components/ui/avatar";
import type { UserType } from "types/models/User";
import {
  AdminRoutes,
  SchoolAdminRoutes,
  CourseProviderRoutes,
  SchoolCourseProviderRoutes,
  UserRoutes,
} from "constants/routes";
import type { UserRoleType } from "types/models/User";
import { roleToText } from "utils/roleToText";
import { useLogoutModal } from "./hooks/useLogoutModal";

const SettingsRoute: Record<UserRoleType, string> = {
  'SuperAdmin': AdminRoutes.settings,
  'CourseProvider': CourseProviderRoutes.settings,
  'Teacher': UserRoutes.settings,
  'Student': UserRoutes.settings,
  'SchoolAdmin': SchoolAdminRoutes.settings,
  'SchoolCourseProvider': SchoolCourseProviderRoutes.settings,
};

type Props = {
  user: UserType;
};

export const Menu = ({ user }: Props) => {
  const navigate = useNavigate();
  const toggleLogoutModal = useLogoutModal((store) => store.toggleModal);

  const items = useMemo(() => [
    {
      label: 'Settings',
      onClick: () => navigate(SettingsRoute[user!.role]),
    },
    {
      label: 'Logout',
      onClick: toggleLogoutModal,
    }
  ], [user]);

  return (
    <ActionMenu
      items={items}
      trigger={
        <div className="flex items-center gap-4">
          <Avatar
            firstName={user?.first_name || ''}
            lastName={user?.last_name || ''}
            avatar={user?.image}
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{`${user?.first_name} ${user?.last_name}`}</span>
            <span className="text-sm font-normal">{roleToText(user?.role)}</span>
          </div>
        </div>
      }
    />
  );
}
