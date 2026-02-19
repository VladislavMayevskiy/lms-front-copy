import { useFormContext, Controller } from "react-hook-form";
import { ContentWrapper } from "./ContentWrapper";
import { Dropzone } from "components/ui/fields/Dropzone";
import type { SectionSchema } from "../../validation/section.schema";
import { ImageTypes } from "../../constants/content";

export const Image = () => {
  const { control } = useFormContext<SectionSchema>();

  return (
    <ContentWrapper>
      <Controller
        control={control}
        name="files"
        render={({ field: { onChange, value } }) => (
          <Dropzone
            file={value?.[0] || null}
            onChange={(file) => {
              onChange([file]);
            }}
            accept={ImageTypes}
          />
        )}
      />
    </ContentWrapper>
  );
};