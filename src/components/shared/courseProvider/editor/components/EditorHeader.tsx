import { useMemo, useCallback, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { MainButton } from "components/ui/button";
// import EyeIcon from "assets/imgs/courseProvider/eye.svg?react";
// import UndoIcon from "assets/imgs/courseProvider/undo.svg?react";
// import RedoIcon from "assets/imgs/courseProvider/redo.svg?react";
import ArrowLeftIcon from "assets/imgs/ArrowLeft.svg?react";
import { CourseStatusIds, CourseTypeIds } from "constants/course";
import { useCourseQuery, useEditCourse } from "api/courseProvider/courses/hooks";
import type { CourseSchema } from "../../courses/validation/course.schema";
import { useFile } from "hooks/useFile";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";

export const EditorHeader = () => {
  const { id } = useParams();
  const { data } = useCourseQuery(Number(id));
  const { mutate: editCourse, isPending } = useEditCourse();
  const navigate = useNavigate();

  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [isPublishLoading, setIsPublishLoading] = useState(false);
  const imageFileRef = useRef<File | null>(null);

  const course: CourseSchema = useMemo(
    () => ({
      type: CourseTypeIds[data?.type],
      status: CourseStatusIds[data?.status],
      name: data?.name ?? "",
      description: data?.description ?? "",
      duration: (data?.duration || 0).toString(),
      instructor: data?.instructor ?? "",
      position: data?.position ?? 0,
      about: data?.about || "",
      achievements: data?.achievements || "",
      schools: (data?.schools || []).map(({ id }) => id),
      languages: data?.languages || [],
      image: null,
    }),
    [data]
  );

  const fileName = (data?.image || "").split("/").pop() || "";

  useFile({
    fileName,
    fileUrl: data?.image,
    setFile: (file) => { imageFileRef.current = file; },
  });

  const handlePublish = useCallback(() => {
    if (!data) return;
    setIsPublishLoading(true);

    const formData = new FormData();

    Object.keys(course).forEach((key: unknown) => {
      const formKey = key as keyof typeof course;

      if (formKey === "image") {
        if (imageFileRef.current) formData.append(`${formKey}`, imageFileRef.current);
      } else if (formKey === "schools") {
        (course[formKey] as number[]).forEach((schoolId, index) => {
          formData.append(`${formKey}[${index}]`, schoolId.toString());
        });
      } else if (formKey === "languages") {
        (course[formKey] as string[]).forEach((code, index) => {
          formData.append(`${formKey}[${index}]`, code);
        });
      } else if (formKey === "status") {
        const newStatus =
          data.status === "Published"
            ? CourseStatusIds.Archived
            : CourseStatusIds.Published;

        formData.append(`${formKey}`, newStatus.toString());
      } else if (course[formKey]) {
        formData.append(`${formKey}`, course[formKey].toString());
      }
    });

    editCourse(
      {
        courseId: data.id,
        course: formData,
      },
      {
        onSettled: () => setIsPublishLoading(false),
      }
    );
  }, [course, data, editCourse]);

  const handleSaveDraft = useCallback(() => {
    if (!data) return;
    setIsSaveLoading(true);

    const formData = new FormData();

    Object.keys(course).forEach((key: unknown) => {
      const formKey = key as keyof typeof course;

      if (formKey === "image") {
        if (imageFileRef.current) formData.append(`${formKey}`, imageFileRef.current);
      } else if (formKey === "schools") {
        (course[formKey] as number[]).forEach((schoolId, index) => {
          formData.append(`${formKey}[${index}]`, schoolId.toString());
        });
      } else if (formKey === "languages") {
        (course[formKey] as string[]).forEach((code, index) => {
          formData.append(`${formKey}[${index}]`, code);
        });
      } else if (formKey === "status") {
        const newStatus = CourseStatusIds.Draft;
        formData.append(`${formKey}`, newStatus.toString());
      } else if (course[formKey]) {
        formData.append(`${formKey}`, course[formKey].toString());
      }
    });

    editCourse(
      {
        courseId: data.id,
        course: formData,
      },
      {
        onSettled: () => setIsSaveLoading(false),
      }
    );
  }, [course, data, editCourse]);

  if (!data) return null;

  const isAnyLoading = isSaveLoading || isPublishLoading || isPending;

  return (
    <div className="flex justify-between items-center px-16 py-4 bg-light-green border-b border-border-light-grey! shadow-editor-header">
      <Button
        onClick={() => navigate(-1)}
        leftIcon={<ArrowLeftIcon />}
        variant={"link"}
      >
        Back
      </Button>

      <div className="flex-1 min-w-0 px-4 text-center">
        <h2 className="font-normal text-[20px] font-[Lato] truncate whitespace-nowrap overflow-hidden">{data.name}</h2>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          {/* <EyeIcon /> */}
          <MainButton
            className="cursor-pointer"
            onClick={handleSaveDraft}
            isLoading={isSaveLoading}
            disabled={isAnyLoading}
          >
            Save draft
          </MainButton>
          {/* <UndoIcon />
          <RedoIcon /> */}
        </div>

        <MainButton
          onClick={handlePublish}
          isLoading={isPublishLoading}
          disabled={isAnyLoading}
          colorScheme={data.status === "Published" ? "orange" : "blue"}
        >
          {data.status === "Published" ? "Archive" : "Publish"}
        </MainButton>
      </div>
    </div>
  );
};
