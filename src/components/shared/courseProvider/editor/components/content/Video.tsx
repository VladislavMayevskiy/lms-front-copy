import { useFormContext, Controller } from "react-hook-form";
import { ContentWrapper } from "./ContentWrapper";
import { Dropzone } from "components/ui/fields/Dropzone";
import type { SectionSchema } from "../../validation/section.schema";
import { VideoTypes } from "../../constants/content";

export const Video = () => {
  const { control } = useFormContext<SectionSchema>();

  return (
    <ContentWrapper>
      <Controller
        control={control}
        name="files"
        render={({ field: { value, onChange } }) => (
          <Dropzone
            multiple
            file={value || null}
            onChange={onChange}
            accept={VideoTypes}
            className="col-span-2"
          />
        )}
      />
    </ContentWrapper>
  );
};