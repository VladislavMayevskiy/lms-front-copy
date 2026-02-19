import { AdminLayout } from "components/ui/layouts/admin";
import {
  TotalCourses,
  ActiveSubscriptions,
  MostPopularCourse,
  NewUsers,
} from "components/shared/admin/dashboard/stats";
import { CoursesList } from "components/shared/admin/dashboard/courses/CoursesList";

function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <TotalCourses />
            <ActiveSubscriptions />
          </div>
          <MostPopularCourse />
        </div>
        <NewUsers />
        <CoursesList />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
