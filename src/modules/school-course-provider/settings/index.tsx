import {
  CourseProviderLayout,
  PageHeader,
  ContentLayout,
} from "components/ui/layouts/courseProvider";
import { ProfileForm, PasswordForm } from "components/shared/courseProvider/settings/components";
import { authStore } from "stores/authStore";

function SchoolCourseProviderSettings() {
  const user = authStore((store) => store.user);

  if (!user) return;

  return (
    <CourseProviderLayout>
      <PageHeader title="Settings" />
      <ContentLayout hideBorder hideShadow>
        <div className="flex flex-col gap-8">
          <ProfileForm user={user} />
          <PasswordForm />
        </div>
      </ContentLayout>
    </CourseProviderLayout>
  );
};

export default SchoolCourseProviderSettings;