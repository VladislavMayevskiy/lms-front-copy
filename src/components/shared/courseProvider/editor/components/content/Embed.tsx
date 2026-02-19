import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { ContentWrapper } from "./ContentWrapper";
import { TextField } from "components/ui/fields/TextField";
import EditIcon from "assets/imgs/admin/edit.svg?react"
import DeleteIcon from "assets/imgs/delete.svg?react"
import type { SectionSchema } from "../../validation/section.schema";

export const Embed = () => {
  const { control, formState: { defaultValues } } = useFormContext<SectionSchema>();
  const [isBlured, setIsBlured] = useState<boolean>(Boolean(defaultValues?.content) || false);

  return (
    <ContentWrapper>
      <Controller
        control={control}
        name="content"
        render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => isBlured ? (
          <div className="flex gap-4 items-center">
            <div
              className="w-full"
              dangerouslySetInnerHTML={{
                __html: value,
              }}
            />
            <div className="flex gap-2 items-center">
              <EditIcon
                onClick={() => setIsBlured(false)}
                className="w-[28px] h-[28px] cursor-pointer"
              />
              <DeleteIcon
                onClick={() => {
                  onChange('');
                  setIsBlured(false);
                }}
                className="cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <TextField
            id="embed"
            label="Embed Code"
            placeholder="Enter embed code"
            type="audio/*"
            error={error?.message}
            onBlur={() => {
              onBlur();

              if (value)
                setIsBlured(true);
            }}
            onChange={onChange}
            value={value}
          />
        )}
      />
    </ContentWrapper>
  );
};