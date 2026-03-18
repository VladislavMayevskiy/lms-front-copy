import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useIsMutating } from "@tanstack/react-query";
import { Button, Spinner, Tooltip } from "@chakra-ui/react";
import ArrowLeftIcon from "assets/imgs/ArrowLeft.svg?react";
import { useCourseQuery, useEditCourse } from "api/courseProvider/courses/hooks";
import { CourseStatus } from "components/ui/course/status";
import { MainButton } from "components/ui/button";
import { CourseStatusIds, CourseTypeIds } from "constants/course";

export const EditorHeader = () => {
  const { id } = useParams();
  const { data } = useCourseQuery(Number(id));
  const navigate = useNavigate();
  const { mutate: editCourse, isPending } = useEditCourse();

  const [isPublishLoading, setIsPublishLoading] = useState(false);

  // ── Autosave indicator ─────────────────────────────────────────────────────
  const savingCreateCount = useIsMutating({ mutationKey: ["create-section"] });
  const savingEditCount   = useIsMutating({ mutationKey: ["edit-section"]   });
  const isSavingSection   = savingCreateCount + savingEditCount > 0;

  // ── Status-change helpers ──────────────────────────────────────────────────

  /**
   * Builds a complete FormData payload for the course-edit endpoint, with
   * `status` overridden to `targetStatus`.
   *
   * All other fields are read from the currently loaded CourseType so no data
   * is accidentally lost when only the publication status is being changed.
   */
  const buildFormData = useCallback(
    (targetStatus: number) => {
      const formData = new FormData();
      if (data?.id) {
        formData.append("name",        data.name        ?? "");
        formData.append("description", data.description ?? "");
        // CourseTypeIds[data.type] can be undefined if the API returns an
        // unexpected type value (e.g. 0 or a future type).  Fall back to
        // Mixed (3) so the request still goes through instead of crashing.
        const typeId = CourseTypeIds[data.type] ?? CourseTypeIds.Mixed;
        formData.append("type",     typeId.toString());
        formData.append("status",   targetStatus.toString());
        formData.append("duration", (data.duration ?? 0).toString());
        formData.append("instructor", data.instructor ?? "");
        if (data.position != null) {
          formData.append("position", data.position.toString());
        }
        if (data.about) {
          formData.append("about", data.about);
        }
        if (data.achievements) {
          formData.append("achievements", data.achievements);
        }
        (data.schools || []).forEach((school, index) => {
          formData.append(`schools[${index}]`, school.id.toString());
        });
        (data.languages || []).forEach((lang, index) => {
          formData.append(`languages[${index}]`, lang);
        });
        // image is intentionally omitted — the backend preserves the existing
        // course thumbnail when no image field is present in the payload, and
        // we must not attempt to re-fetch the blob URL here (CORS).
      }
      return formData;
    },
    // imageFileRef is a stable ref object — no need to list it
    [data]
  );

  const handleStatusChange = useCallback(
    (action: "publish" | "unpublish" | "archive" | "restore") => {
      if (!data?.id) return;

      let targetStatus: number;
      switch (action) {
        case "publish":   targetStatus = CourseStatusIds.Published; break;
        case "unpublish": targetStatus = CourseStatusIds.Draft;     break;
        case "archive":   targetStatus = CourseStatusIds.Archived;  break;
        case "restore":   targetStatus = CourseStatusIds.Draft;     break;
        default: return;
      }

      setIsPublishLoading(true);
      editCourse(
        { courseId: data.id, course: buildFormData(targetStatus) },
        { onSettled: () => setIsPublishLoading(false) }
      );
    },
    [data, editCourse, buildFormData]
  );

  if (!data?.id) return null;

  const isAnyLoading = isPublishLoading || isPending;

  return (
    <div className="flex justify-between items-center px-16 py-4 bg-light-green border-b border-border-light-grey! shadow-editor-header">

      {/* ── Back ── */}
      <Button
        onClick={() => navigate(-1)}
        leftIcon={<ArrowLeftIcon />}
        variant={"link"}
      >
        Back
      </Button>

      {/* ── Course name ── */}
      <div className="flex-1 min-w-0 px-4 text-center">
        <h2 className="font-normal text-[20px] font-[Lato] truncate whitespace-nowrap overflow-hidden">
          {data.name}
        </h2>
      </div>

      <div className="flex items-center gap-8">

        {/* ── Section autosave indicator ─────────────────────────────────────
            Sections save automatically — providers do not need to click any
            button to persist their content work.
        ── */}
        <Tooltip
          label="Section content is saved automatically when you edit it. No button needs to be clicked."
          hasArrow
          placement="bottom"
        >
          <div className="flex items-center gap-2 text-sm font-[Lato]">
            {isSavingSection ? (
              <>
                <Spinner size="xs" color="blue.500" />
                <span className="text-blue-600">Saving sections…</span>
              </>
            ) : (
              <span className="text-green-600 flex items-center gap-1.5 cursor-default">
                <span
                  className="inline-block w-2 h-2 rounded-full bg-green-500 flex-shrink-0"
                  aria-hidden
                />
                Sections autosaved
              </span>
            )}
          </div>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-8 bg-border-light-grey" />

        {/* ── Publication controls ───────────────────────────────────────────
            These control whether enrolled learners can see the course.
            They are separate from section content autosave.
        ── */}
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-dark-grey">Publication:</span>
          <CourseStatus status={data.status} />

          {data.status === "Draft" && (
            <Tooltip label="Make this course visible to learners." hasArrow placement="bottom">
              <MainButton
                onClick={() => handleStatusChange("publish")}
                isLoading={isPublishLoading}
                disabled={isAnyLoading}
              >
                Publish
              </MainButton>
            </Tooltip>
          )}

          {data.status === "Published" && (
            <>
              <Tooltip label="Hide this course from learners." hasArrow placement="bottom">
                <MainButton
                  colorScheme="orange"
                  onClick={() => handleStatusChange("unpublish")}
                  isLoading={isPublishLoading}
                  disabled={isAnyLoading}
                >
                  Unpublish
                </MainButton>
              </Tooltip>
              <Tooltip label="Remove this course from active use and hide it from learners." hasArrow placement="bottom">
                <MainButton
                  colorScheme="red"
                  onClick={() => handleStatusChange("archive")}
                  isLoading={isPublishLoading}
                  disabled={isAnyLoading}
                >
                  Archive
                </MainButton>
              </Tooltip>
            </>
          )}

          {data.status === "Archived" && (
            <>
              <Tooltip label="Move this course back to Draft (hidden from learners)." hasArrow placement="bottom">
                <MainButton
                  colorScheme="orange"
                  onClick={() => handleStatusChange("restore")}
                  isLoading={isPublishLoading}
                  disabled={isAnyLoading}
                >
                  Restore to Draft
                </MainButton>
              </Tooltip>
              <Tooltip label="Make this course visible to learners." hasArrow placement="bottom">
                <MainButton
                  onClick={() => handleStatusChange("publish")}
                  isLoading={isPublishLoading}
                  disabled={isAnyLoading}
                >
                  Publish
                </MainButton>
              </Tooltip>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
