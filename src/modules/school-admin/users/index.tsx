import SchoolAdminUsers from "components/shared/school-admin/users";
import { RolesByName } from "constants/roles";

function SchoolAdminUsersPage() {
  return (
    <SchoolAdminUsers
      filter={{
        role: [
          RolesByName.SchoolCourseProvider,
          RolesByName.SchoolAdmin,
          RolesByName.Teacher,
        ].join(","),
      }}
    />
  );
};

export default SchoolAdminUsersPage;