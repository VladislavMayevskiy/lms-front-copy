import { useFormContext, Controller } from "react-hook-form";
import { ContentWrapper } from "./ContentWrapper";
import { Dropzone } from "components/ui/fields/Dropzone";
import type { SectionSchema } from "../../validation/section.schema";
import { ImageTypes } from "../../constants/content";

export const Album = () => {
  const { control } = useFormContext<SectionSchema>();

  return (
    <ContentWrapper>
      <Controller
        control={control}
        name="files"
        render={({ field: { onChange, value } }) => (
          <Dropzone
            multiple
            file={value || null}
            onChange={onChange}
            accept={ImageTypes}
          />
        )}
      />
    </ContentWrapper>
  );
};