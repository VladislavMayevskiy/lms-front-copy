import { useFormContext, Controller } from "react-hook-form";
import { ContentWrapper } from "./ContentWrapper";
import { Dropzone } from "components/ui/fields/Dropzone";
import type { SectionSchema } from "../../validation/section.schema";
import { AudioTypes } from "../../constants/content";

export const Audio = () => {
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
            accept={AudioTypes}
            className="col-span-2"
          />
        )}
      />
    </ContentWrapper>
  );
};