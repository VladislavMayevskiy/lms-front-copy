import { useFormContext, Controller } from "react-hook-form";
import { ContentWrapper } from "./ContentWrapper";
import { Dropzone } from "components/ui/fields/Dropzone";
import { useSectionPersistedFiles } from "../sections/SectionFilesContext";
import DocIcon from "assets/imgs/courseProvider/document.svg?react";
import DeleteIcon from "assets/imgs/delete.svg?react";
import type { SectionSchema } from "../../validation/section.schema";
import type { SectionFileType } from "types/models/Section";
import { DocumentTypes } from "../../constants/content";

/**
 * Row for a single locally-selected File (not yet persisted).
 */
const LocalFileRow = ({
  file,
  onDelete,
}: {
  file: File;
  onDelete: () => void;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <DocIcon />
      <div className="flex flex-col">
        <p>{file.name}</p>
        <p className="text-xs opacity-50">
          {`${(file.size / 1024 / 1024).toFixed(2)} MB`}
        </p>
      </div>
    </div>
    <DeleteIcon onClick={onDelete} className="cursor-pointer" />
  </div>
);

/**
 * Row for an already-persisted file (from backend, displayed by URL metadata).
 * No delete button — removing persisted files requires an explicit API action
 * that is outside the scope of the inline section editor.
 */
const PersistedFileRow = ({ file }: { file: SectionFileType }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <DocIcon />
      <div className="flex flex-col">
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {file.name || file.url.split("/").pop() || "Document"}
        </a>
        {file.size > 0 && (
          <p className="text-xs opacity-50">
            {`${(file.size / 1024 / 1024).toFixed(2)} MB`}
          </p>
        )}
      </div>
    </div>
  </div>
);

export const Document = () => {
  const { control } = useFormContext<SectionSchema>();

  /**
   * Persisted file metadata provided by Section.tsx via SectionPersistedFilesContext.
   * Empty array for new sections (SectionForm).
   *
   * Display priority:
   *   - Local files (value) shown when user has selected new files this session.
   *   - Persisted files shown as read-only when no local files selected yet.
   *
   * Dropping new files into the Dropzone replaces the displayed list with the
   * newly selected local files.  On Save, only local files are sent to the
   * backend; if no local files were selected the backend keeps existing.
   */
  const persistedFiles = useSectionPersistedFiles();

  return (
    <ContentWrapper>
      <Controller
        control={control}
        name="files"
        render={({ field: { onChange, value } }) => {
          const hasLocalFiles = (value?.length ?? 0) > 0;

          return (
            <div className="flex flex-col gap-2">
              {/* Local files the user selected this session */}
              {hasLocalFiles &&
                value?.map((doc, index) => (
                  <LocalFileRow
                    key={`local-doc-${index}`}
                    file={doc}
                    onDelete={() => {
                      const docs = [...(value || [])];
                      docs.splice(index, 1);
                      onChange(docs);
                    }}
                  />
                ))}

              {/* Persisted files from the backend — shown when no local files */}
              {!hasLocalFiles &&
                persistedFiles.map((file, index) => (
                  <PersistedFileRow key={`persisted-doc-${file.id ?? index}`} file={file} />
                ))}

              <Dropzone
                multiple
                file={null}
                onChange={(files) => {
                  // Accumulate newly selected files; if user picks more files
                  // after already selecting some, merge them
                  const current = hasLocalFiles ? value ?? [] : [];
                  onChange([...current, ...(files || [])]);
                }}
                accept={DocumentTypes}
              />
            </div>
          );
        }}
      />
    </ContentWrapper>
  );
};
