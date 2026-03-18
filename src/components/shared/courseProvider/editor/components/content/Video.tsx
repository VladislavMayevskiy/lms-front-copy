import { useFormContext, Controller } from "react-hook-form";
import { ContentWrapper } from "./ContentWrapper";
import { Dropzone } from "components/ui/fields/Dropzone";
import { useSectionPersistedFiles } from "../sections/SectionFilesContext";
import type { SectionSchema } from "../../validation/section.schema";
import { VideoTypes } from "../../constants/content";

export const Video = () => {
  const { control } = useFormContext<SectionSchema>();

  /**
   * Persisted video files from the backend — played directly from their remote
   * URLs when the user hasn't selected new files this session.
   * The <video> element streams from the URL; no blob re-fetch or CORS issue.
   */
  const persistedFiles = useSectionPersistedFiles();

  return (
    <ContentWrapper>
      <Controller
        control={control}
        name="files"
        render={({ field: { value, onChange } }) => {
          const hasLocalFiles = (value?.length ?? 0) > 0;

          return (
            <div className="flex flex-col gap-4">
              {/* Persisted videos from backend — shown when no local files selected */}
              {!hasLocalFiles && persistedFiles.length > 0 && (
                <div className="flex flex-col gap-2">
                  {persistedFiles.map((video, index) => (
                    <video
                      key={`persisted-video-${video.id ?? index}`}
                      controls
                      src={video.url}
                      className="w-full max-h-[200px] object-contain"
                    >
                      Your browser does not support the video element.
                    </video>
                  ))}
                </div>
              )}

              {/* Dropzone for selecting new local files */}
              <Dropzone
                multiple
                file={value || null}
                onChange={onChange}
                accept={VideoTypes}
                className="col-span-2"
              />
            </div>
          );
        }}
      />
    </ContentWrapper>
  );
};
