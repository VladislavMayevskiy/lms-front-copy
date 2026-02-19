import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
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
import { useFile } from "hooks/useFile";

export const CreateCourseModal = () => {
  const navigate = useNavigate();
  const { course, setCourse } = useCourseStore();
  const { data: schools } = useGetSchools();
  const { data: courseData } = useCourseQuery(course?.id || 0);

  const { mutate: createCourse, isPending } = useCreateCourse();
  const { mutate: editCourse, isPending: isEditPending } = useEditCourse();
  const { control, handleSubmit, setError, reset, setValue } = useForm<CourseSchema>({
    values: {
      name: courseData?.name || "",
      description: courseData?.description || "",
      instructor: courseData?.instructor || "",
      price: courseData?.price || "",
      about: courseData?.about || "",
      achievements: courseData?.achievements || "",
      position: courseData?.position || null,
      duration: courseData?.duration?.toString() || "",
      status: CourseStatusIds[courseData?.status || "Draft"],
      type: CourseTypeIds[courseData?.type || "Mixed"],
      schools: (courseData?.schools || []).map(({ id }) => id),
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
    setFile: (file) => setValue('image', file!),
  });

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key: unknown) => {
      const formKey = key as keyof CourseSchema;

      if (data[formKey] && formKey === 'image') {
        formData.append(`${formKey}`, data[formKey]);
      } else if (data[formKey] && formKey === 'schools') {
        data[formKey].forEach((schoolId, index) => {
          formData.append(`${formKey}[${index}]`, schoolId.toString());
        })
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
          <Controller
            name="price"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                id="create-course-price"
                label="Price*"
                placeholder="Enter price"
                type="number"
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