import { useFormContext, Controller } from "react-hook-form";
import { ContentWrapper } from "./ContentWrapper";
import { Dropzone } from "components/ui/fields/Dropzone";
import { useSectionPersistedFiles } from "../sections/SectionFilesContext";
import type { SectionSchema } from "../../validation/section.schema";
import { ImageTypes } from "../../constants/content";

export const Image = () => {
  const { control } = useFormContext<SectionSchema>();

  /**
   * Persisted file metadata from the backend (provided by Section.tsx via
   * SectionPersistedFilesContext).  Empty array in SectionForm (new sections).
   *
   * We pass persistedFiles[0].url as `previewUrl` to Dropzone so it can display
   * the existing image directly from the remote URL — no fetch, no CORS issue.
   *
   * The Dropzone's `file` prop (a local File object) takes priority: when the
   * user selects a new image, the local preview overrides the persisted URL.
   */
  const persistedFiles = useSectionPersistedFiles();
  const persistedPreviewUrl = persistedFiles[0]?.url || undefined;

  return (
    <ContentWrapper>
      <Controller
        control={control}
        name="files"
        render={({ field: { onChange, value } }) => (
          <Dropzone
            file={value?.[0] || null}
            previewUrl={!value?.[0] ? persistedPreviewUrl : undefined}
            onChange={(file) => {
              // Use empty array (not [null]) when file is cleared so the save
              // payload correctly omits files rather than sending "null"
              onChange(file ? [file] : []);
            }}
            accept={ImageTypes}
          />
        )}
      />
    </ContentWrapper>
  );
};
