import SchoolAdminUsers from "components/shared/school-admin/users";
import { RolesByName } from "constants/roles";

function SchoolAdminStudents() {
  return (
    <SchoolAdminUsers
      filter={{
        role: [
          RolesByName.Student,
        ].join(","),
      }}
    />
  );
};

export default SchoolAdminStudents;