import { useFormContext, Controller } from "react-hook-form";
import { ContentWrapper } from "./ContentWrapper";
import { Dropzone } from "components/ui/fields/Dropzone";
import DocIcon from "assets/imgs/courseProvider/document.svg?react";
import DeleteIcon from "assets/imgs/delete.svg?react"
import type { SectionSchema } from "../../validation/section.schema";
import { DocumentTypes } from "../../constants/content";

export const Document = () => {
  const { control } = useFormContext<SectionSchema>();

  return (
    <ContentWrapper>
      <Controller
        control={control}
        name="files"
        render={({ field: { onChange, value } }) => (
          <div className="flex flex-col gap-2">
            {value?.map((doc, index) => (
              <div key={`section-doc-${index}`} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DocIcon />
                  <div className="flex flex-col">
                    <p>{doc.name}</p>
                    <p className="text-xs opacity-50">{`${(doc.size / 1024 / 1024).toFixed(2)} MB`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DeleteIcon
                    onClick={() => {
                      const docs = [...(value || [])];
                      docs.splice(index, 1);
                      onChange(docs);
                    }}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            ))}
            <Dropzone
              multiple
              file={null}
              onChange={(files) => {
                const docs = [...(value || []), ...(files || [])];
                onChange(docs);
              }}
              accept={DocumentTypes}
            />
          </div>
        )}
      />
    </ContentWrapper>
  );
};