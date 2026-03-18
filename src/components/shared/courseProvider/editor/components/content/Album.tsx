import { useFormContext, Controller } from "react-hook-form";
import { ContentWrapper } from "./ContentWrapper";
import { Dropzone } from "components/ui/fields/Dropzone";
import { useSectionPersistedFiles } from "../sections/SectionFilesContext";
import type { SectionSchema } from "../../validation/section.schema";
import { ImageTypes } from "../../constants/content";

export const Album = () => {
  const { control } = useFormContext<SectionSchema>();

  /**
   * Persisted images from the backend — displayed directly from their remote
   * URLs when the user hasn't selected any new local files this session.
   * This avoids the CORS-failing blob re-fetch that was previously done via
   * useArrayFiles/getFilesFromUrl.
   */
  const persistedFiles = useSectionPersistedFiles();

  return (
    <ContentWrapper>
      <Controller
        control={control}
        name="files"
        render={({ field: { onChange, value } }) => {
          const hasLocalFiles = (value?.length ?? 0) > 0;

          return (
            <div className="flex flex-col gap-4">
              {/* Persisted images from backend — shown when no local files selected */}
              {!hasLocalFiles && persistedFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {persistedFiles.map((img, index) => (
                    <div
                      key={`persisted-album-${img.id ?? index}`}
                      className="border! border-middle-blue! rounded-[10px] overflow-hidden max-h-[200px]"
                    >
                      <img
                        src={img.url}
                        alt={img.name || `Image ${index + 1}`}
                        className="w-full h-full! object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Dropzone handles local-file preview grid via its own multiple rendering */}
              <Dropzone
                multiple
                file={value || null}
                onChange={onChange}
                accept={ImageTypes}
              />
            </div>
          );
        }}
      />
    </ContentWrapper>
  );
};
