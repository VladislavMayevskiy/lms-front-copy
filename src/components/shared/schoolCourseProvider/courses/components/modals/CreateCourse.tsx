import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "components/ui/modal";
import { Dropzone } from "components/ui/fields/Dropzone";
import { TextField } from "components/ui/fields/TextField";
import { TextAreatField } from "components/ui/fields/TextAreaField";
import { SelectMultipleField } from "components/ui/fields/SelectMultipleField";
import { MainButton } from "components/ui/button";
import { courseSchemaResolver } from "../../validation/course.schema";
import type { CourseSchema } from "../../validation/course.schema";
import { useModal, CourseProviderModalConsts } from "hooks/courseProvider/useModal";
import { useCreateCourse, useEditCourse } from "api/schoolCourseProvider/courses/hooks";
import { useCourseStore } from "../../hooks/useCourse";
import { CourseStatusIds, CourseTypeIds } from "constants/course";
import { SchoolCourseProviderRoutes } from "constants/routes";
import { useGetLanguages } from "api/admin/languages/hooks";
import { useSaveSettings } from "api/user/settings/hooks";
import { authStore } from "stores/authStore";

export const CreateCourseModal = () => {
  const navigate = useNavigate();
  const { course, setCourse } = useCourseStore();
  const { data: languagesData } = useGetLanguages();
  // Real API shape: { value: string; label: string; is_rtl: boolean }
  // Map to the {id, name} shape that SelectMultipleField expects.
  const languageOptions = (languagesData?.data ?? [])
    .map((lang) => ({
      id: lang.value,   // e.g. "en", "ko" — always a string, never undefined
      name: lang.label, // e.g. "English", "Korean"
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const { mutate: createCourse, isPending } = useCreateCourse();
  const { mutate: editCourse, isPending: isEditPending } = useEditCourse();
  const { mutate: saveSettings } = useSaveSettings();
  const user = authStore((store) => store.user);

  const { control, handleSubmit, setError } = useForm<CourseSchema>({
    values: {
      name: course?.name || "",
      description: course?.description || "",
      instructor: course?.instructor || "",
      about: course?.about || "",
      achievements: course?.achievements || "",
      position: course?.position || null,
      duration: (course?.duration || 0).toString(),
      status: CourseStatusIds[course?.status || "Draft"],
      type: CourseTypeIds[course?.type || "Mixed"],
      languages: course?.languages || [],
      image: null,
    },
    resolver: courseSchemaResolver,
  });
  const isOpen = useModal((store) => store.modals[CourseProviderModalConsts.CreateCourse].isOpen);
  const closeModal = useModal((store) => store.closeModal);

  /** Save user's preferred course language without blocking the main form submit. */
  const handlePreferredLanguageChange = (value: string) => {
    if (!user) return;
    saveSettings({
      send_notifications: user.send_notifications,
      course_reminders: user.course_reminders,
      new_courses: user.new_courses,
      assignment_feedback: user.assignment_feedback,
      progress_updates: user.progress_updates,
      announcements: user.announcements,
      language: user.language,
      timezone: user.timezone,
      theme: user.theme,
      // Backend requires a non-null, non-empty string.
      // When user picks "No preference" (empty string) fall back to their
      // interface language so the payload is always valid.
      preferred_course_language: value || user?.language || "en",
    });
  };

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key: unknown) => {
      const formKey = key as keyof CourseSchema;

      if (data[formKey] && formKey === 'image') {
        formData.append(`${formKey}`, data[formKey]);
      } else if (formKey === 'languages') {
        (data[formKey] as string[]).forEach((code, index) => {
          formData.append(`${formKey}[${index}]`, code);
        });
      } else if (data[formKey]) {
        formData.append(`${formKey}`, data[formKey].toString());
      }
    });

    if (course?.id) {
      editCourse({
        courseId: course.id,
        course: formData,
      }, {
        onSuccess: () => {
          setCourse(null);
          closeModal(CourseProviderModalConsts.CreateCourse);
          toast.success("The course was successfully edited");
          navigate(`${SchoolCourseProviderRoutes.modules.replace(":id", course.id.toString())}`);
        },
        onError: (error) => {
          if (error.response?.data.message) {
            toast.error(error.response?.data.message);
          } else {
            toast.error(error.message);
          }
          if (error.response?.data.errors) {
            Object.entries(error.response?.data.errors).forEach(([key, value]) => {
              setError(key as keyof CourseSchema, { message: value.join(", ") });
            });
          }
        },
      });
    } else {
      createCourse(formData, {
        onSuccess: ({ data: { id } }) => {
          closeModal(CourseProviderModalConsts.CreateCourse);
          toast.success("The course was successfully created");
          navigate(`${SchoolCourseProviderRoutes.modules.replace(":id", id.toString())}`);
        },
        onError: (error) => {
          if (error.response?.data.message) {
            toast.error(error.response?.data.message);
          } else {
            toast.error(error.message);
          }
          if (error.response?.data.errors) {
            Object.entries(error.response?.data.errors).forEach(([key, value]) => {
              setError(key as keyof CourseSchema, { message: value.join(", ") });
            });
          }
        },
      });
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      title={course?.id ? "Edit Course" : "Create Course"}
      onClose={() => {
        setCourse(null);
        closeModal(CourseProviderModalConsts.CreateCourse)
      }}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-8 p-10">
        <Controller
          control={control}
          name="image"
          render={({ field: { value, onChange } }) => (
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="course-img" className="text-sm font-bold text-dark-grey font-[Lato]">
                Course Image*
              </label>
              <Dropzone
                id="course-img"
                file={value}
                onChange={onChange}
                accept={{ "image/*": [] }}
                className="h-[200px] overflow-hidden"
                previewUrl={course?.image ?? undefined}
              />
            </div>
          )}
        />
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id="create-course-name"
              label="Course Name*"
              placeholder="Enter course name"
              error={error?.message}
              {...field}
            />
          )}
        />
        {/* description is collected server-side; not shown in the creation form */}
        <Controller
          control={control}
          name="languages"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <SelectMultipleField
              label="Languages for translation"
              placeholder="Select translation languages"
              value={value}
              onChange={(ids) => onChange(ids)}
              data={languageOptions}
              error={error?.message}
            />
          )}
        />
        <div className="flex w-full gap-6 items-center">
          <Controller
            name="instructor"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                id="create-course-instructor-name"
                label="Teacher Name*"
                placeholder="Enter teacher name"
                error={error?.message}
                {...field}
              />
            )}
          />
        </div>
        <Controller
          name="duration"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id="create-course-duration"
              label="Course duration in minutes*"
              placeholder="Enter duration"
              type="number"
              error={error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="about"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextAreatField
              id="create-course-about"
              label="About this course"
              placeholder="Enter text"
              fieldContainerClassName="h-24"
              error={error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="achievements"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextAreatField
              id="create-course-achievements"
              label="What you’ll achieve"
              placeholder="Enter text"
              fieldContainerClassName="h-24"
              error={error?.message}
              {...field}
            />
          )}
        />
        {/* ── Preferred Course Language (user preference, auto-saves to user settings) ── */}
        <div className="flex flex-col gap-2">
          <label htmlFor="preferred-course-language-scp" className="text-sm font-bold text-dark-grey font-[Lato]">
            Preferred Course Language
          </label>
          <select
            id="preferred-course-language-scp"
            value={user?.preferred_course_language ?? ""}
            onChange={(e) => handlePreferredLanguageChange(e.target.value)}
            className="w-full rounded-[10px] border border-middle-blue bg-grey px-3 py-2 text-sm font-[Lato] text-dark-grey focus:outline-none focus:border-primary"
          >
            <option value="">— No preference —</option>
            {languageOptions.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 font-[Lato]">
            The primary language you prefer for course content. Saved to your profile.
          </p>
        </div>

        <MainButton
          disabled={isPending || isEditPending}
          type="submit"
          className="self-center!"
        >
          {course?.id ? "Edit Course" : "Create Course"}
        </MainButton>
      </form>
    </Modal>
  );
};