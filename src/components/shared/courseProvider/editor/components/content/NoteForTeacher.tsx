import { Controller, useFormContext } from "react-hook-form";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { ContentWrapper } from "./ContentWrapper";
import type { SectionSchema } from "../../validation/section.schema";

/**
 * Renders the NOTE_FOR_TEACHER section type.
 *
 * Visually identical to TitleAndText in terms of the rich-text editor, but
 * carries a clear heading and description so providers immediately understand
 * this block is a private teacher note — not learner-visible content.
 */
export const NoteForTeacher = () => {
  const { control } = useFormContext<SectionSchema>();

  return (
    <ContentWrapper>
      {/* ── Section identity header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-[8px] bg-amber-50 border! border-amber-300!">
        <span className="text-amber-700 text-lg" aria-hidden>📝</span>
        <div>
          <p className="font-semibold text-amber-800 text-sm font-[Lato]">
            Teacher Notes
          </p>
          <p className="text-xs text-amber-700 font-[Lato]">
            This content is visible to teachers only — not to learners.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Controller
          control={control}
          name="content"
          render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
            <>
              <label className="font-[Lato] text-base font-normal">
                Notes
              </label>

              <div style={{ marginBottom: 16 }}>
                <ReactQuill
                  theme="snow"
                  value={value || ""}
                  onChange={onChange}
                  onBlur={onBlur}
                  placeholder="Enter teacher notes…"
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
