import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import classNames from "classnames";
import Modal from "components/ui/modal";
import { Dropzone } from "components/ui/fields/Dropzone";
import { TextField } from "components/ui/fields/TextField";
import { TextAreatField } from "components/ui/fields/TextAreaField";
import { MainButton } from "components/ui/button";
import { SelectMultipleField } from "components/ui/fields/SelectMultipleField";
import { courseSchemaResolver } from "../../validation/course.schema";
import type { CourseSchema } from "../../validation/course.schema";
import { useModal, CourseProviderModalConsts } from "hooks/courseProvider/useModal";
import { useCreateCourse, useEditCourse, useCourseQuery } from "api/courseProvider/courses/hooks";
import { useCourseStore } from "../../hooks/useCourse";
import { CourseStatusIds, CourseTypeIds } from "constants/course";
import { CourseProviderRoutes } from "constants/routes";
import { useGetSchools } from "api/admin/schools/hooks";
import { useGetLanguages } from "api/admin/languages/hooks";
import { useFile } from "hooks/useFile";

/** Status options shown in the create/edit modal. */
const STATUS_OPTIONS: { label: string; value: number; description: string }[] = [
  {
    label: "Draft",
    value: CourseStatusIds.Draft,
    description: "Hidden from learners. Edit freely.",
  },
  {
    label: "Published",
    value: CourseStatusIds.Published,
    description: "Visible to enrolled learners.",
  },
];

export const CreateCourseModal = () => {
  const navigate = useNavigate();
  const { course, setCourse } = useCourseStore();
  const { data: schools } = useGetSchools();
  const { data: languagesData } = useGetLanguages();
  // Real API shape: { value: string; label: string; is_rtl: boolean }
  // Map to the {id, name} shape that SelectMultipleField expects.
  const languageOptions = (languagesData?.data ?? []).map((lang) => ({
    id: lang.value,  // e.g. "en", "ko" — always a string, never undefined
    name: lang.label, // e.g. "English", "Korean"
  }));
  const { data: courseData } = useCourseQuery(course?.id || 0);
  console.log(languagesData);

  const { mutate: createCourse, isPending } = useCreateCourse();
  const { mutate: editCourse, isPending: isEditPending } = useEditCourse();
  const { control, handleSubmit, setError, reset, setValue } = useForm<CourseSchema>({
    values: {
      name: courseData?.name || "",
      description: courseData?.description || "",
      instructor: courseData?.instructor || "",
      about: courseData?.about || "",
      achievements: courseData?.achievements || "",
      position: courseData?.position || null,
      duration: courseData?.duration?.toString() || "",
      status: CourseStatusIds[courseData?.status || "Draft"],
      type: CourseTypeIds[courseData?.type || "Mixed"],
      schools: (courseData?.schools || []).map(({ id }) => id),
      languages: courseData?.languages || [],
      image: null,
    },
    resolver: courseSchemaResolver,
  });
  const fileName = (course?.image || '').split('/').pop() || '';
  const isOpen = useModal((store) => store.modals[CourseProviderModalConsts.CreateCourse].isOpen);

  const closeModal = useModal((store) => store.closeModal);

  useFile({
    fileName,
    fileUrl: course?.image,
    setFile: (file) => setValue('image', file),
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key: unknown) => {
      const formKey = key as keyof CourseSchema;

      if (data[formKey] && formKey === 'image') {
        formData.append(`${formKey}`, data[formKey]);
      } else if (formKey === 'schools') {
        (data[formKey] as number[]).forEach((schoolId, index) => {
          formData.append(`${formKey}[${index}]`, schoolId.toString());
        });
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
          reset();
          closeModal(CourseProviderModalConsts.CreateCourse);
          toast.success("The course was successfully edited");
          navigate(`${CourseProviderRoutes.modules.replace(":id", course.id.toString())}`);
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
          setCourse(null);
          reset();
          closeModal(CourseProviderModalConsts.CreateCourse);
          toast.success("The course was successfully created");
          navigate(`${CourseProviderRoutes.modules.replace(":id", id.toString())}`);
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
        reset();
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
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextAreatField
              id="create-course-description"
              label="Description*"
              placeholder="Enter description"
              fieldContainerClassName="h-24"
              error={error?.message}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="schools"
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <SelectMultipleField
                label="School(s)*"
                placeholder="Select school(s)"
                value={value}
                onChange={(ids) => onChange(ids)}
                data={schools?.data || []}
                error={error?.message}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="languages"
          render={({ field: { value, onChange }, fieldState: { error } }) => {
            return (
              <SelectMultipleField
                label="Languages for translation"
                placeholder="Select translation languages"
                value={value}
                onChange={(ids) => onChange(ids)}
                data={languageOptions}
                error={error?.message}
              />
            );
          }}
        />
        <div className="flex w-full gap-6 items-center">
          <Controller
            name="instructor"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                id="create-course-instructor-name"
                label="Instructor Name*"
                placeholder="Enter instructor name"
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
              label="What you'll achieve"
              placeholder="Enter text"
              fieldContainerClassName="h-24"
              error={error?.message}
              {...field}
            />
          )}
        />
        {/*
         * ── Publication Status ────────────────────────────────────────────────
         * This controls whether the course is visible to enrolled learners.
         * It is a course-level setting — it does NOT affect how section content
         * is saved (sections autosave independently via their own mutations).
         *
         * "Archived" is intentionally excluded here: archiving is a lifecycle
         * action best performed via the dedicated editor header controls, not
         * during course creation or routine editing.
         * ── */}
        <Controller
          name="status"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-dark-grey font-[Lato]">
                Publication Status
              </span>
              <div className="flex gap-3">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    title={option.description}
                    className={classNames(
                      "flex-1 flex flex-col gap-0.5 px-4 py-3 rounded-[10px] border! text-left",
                      "transition-colors duration-150 font-[Lato]",
                      {
                        "border-primary! bg-light-blue text-primary font-semibold":
                          value === option.value,
                        "border-border-light-grey! bg-white text-dark-grey hover:border-primary! hover:bg-grey":
                          value !== option.value,
                      }
                    )}
                  >
                    <span className="text-sm font-semibold">{option.label}</span>
                    <span className="text-xs opacity-60">{option.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        />

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
