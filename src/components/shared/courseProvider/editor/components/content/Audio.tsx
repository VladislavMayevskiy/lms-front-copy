import { useFormContext, Controller } from "react-hook-form";
import { ContentWrapper } from "./ContentWrapper";
import { Dropzone } from "components/ui/fields/Dropzone";
import { useSectionPersistedFiles } from "../sections/SectionFilesContext";
import type { SectionSchema } from "../../validation/section.schema";
import { AudioTypes } from "../../constants/content";

export const Audio = () => {
  const { control } = useFormContext<SectionSchema>();

  /**
   * Persisted audio files from the backend — played directly from their remote
   * URLs when the user hasn't selected new files this session.
   * No blob re-fetch needed; the <audio> element streams from the URL directly.
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
              {/* Persisted audio from backend — shown when no local files selected */}
              {!hasLocalFiles && persistedFiles.length > 0 && (
                <div className="flex flex-col gap-2">
                  {persistedFiles.map((audio, index) => (
                    <div key={`persisted-audio-${audio.id ?? index}`} className="flex items-center gap-2">
                      <audio
                        controls
                        src={audio.url}
                        className="w-full h-[45px]"
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  ))}
                </div>
              )}

              {/* Dropzone for selecting new local files */}
              <Dropzone
                multiple
                file={value || null}
                onChange={onChange}
                accept={AudioTypes}
                className="col-span-2"
              />
            </div>
          );
        }}
      />
    </ContentWrapper>
  );
};
