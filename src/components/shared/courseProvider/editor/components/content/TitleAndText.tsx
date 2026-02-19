import { Controller, useFormContext } from "react-hook-form";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { ContentWrapper } from "./ContentWrapper";
import type { SectionSchema } from "../../validation/section.schema";

export const TitleAndText = () => {
  const { control } = useFormContext<SectionSchema>();

  return (
    <ContentWrapper>
      <div className="flex flex-col gap-2">
        <Controller
          control={control}
          name="content"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <>
              <label className="font-[Lato] text-base font-normal">Content</label>

             <div style={{ marginBottom: 16 }}>
                <ReactQuill
                  theme="snow"
                  value={value || ""}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Enter text"
                />
              </div>

              {error?.message && (
                <p className="text-error text-sm font-[Lato] mt-1">
                  {error.message}
                </p>
              )}
            </>
          )}
        />
      </div>
    </ContentWrapper>
  );
};
