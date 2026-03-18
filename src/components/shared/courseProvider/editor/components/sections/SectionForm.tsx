import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import { ActionMenu } from "components/ui/actionMenu";
import { MainButton } from "components/ui/button";
import { ContentComponents } from "../content";
import { AddContentModal } from "../modals/AddContent";
import OptionsIcon from "assets/imgs/options.svg?react";
import { sectionSchemaResolver } from "../../validation/section.schema";
import type { SectionSchema } from "../../validation/section.schema";
import { SectionTypesById, SectionTypesByName } from "constants/section";
import { useCreateSection } from "api/courseProvider/sections/hooks";
import { isTextForm } from "./utils";
import type { SectionTypes } from "types/models/Section";

/**
 * Empty values shared across all section types.
 * IMPORTANT: every key must appear here so that methods.reset() fully clears the
 * form — including `files` — when the user switches content type.  Omitting a
 * key from the reset payload leaves that field at its previous value and causes
 * the file-leakage / stale-image bugs.
 */
const EMPTY_FORM_VALUES = {
  title: "",
  content: "",
  files: [] as File[],
};

type Props = {
  /** Stable client-side identity for this pending section (never an array index). */
  clientTempId: string;
  /** Numeric section type id (from SectionTypesByName). Already set when component mounts. */
  initialType: number;
  /** Position hint for the backend; based on persisted sections count + index in pending list. */
  position: number;
  /** Called after the section has been successfully persisted to the backend. */
  onSaved: () => void;
  /** Called when the user explicitly deletes this pending section. */
  onDelete: () => void;
};

export const SectionForm = ({
  clientTempId,
  initialType,
  position,
  onSaved,
  onDelete,
}: Props) => {
  const { unitId } = useParams();
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

  const { mutate: createSection, isPending } = useCreateSection();

  /**
   * Each SectionForm instance owns its own useForm — there is no shared state
   * between different pending sections or between a pending section and any
   * persisted Section.
   */
  const methods = useForm<SectionSchema>({
    defaultValues: {
      ...EMPTY_FORM_VALUES,
      position,
      type: initialType,
    },
    resolver: sectionSchemaResolver,
  });

  const type = methods.watch("type");
  const isTypeTextForm = isTextForm(type);
  const sectionTypeName: SectionTypes | undefined = type
    ? SectionTypesById[type]
    : undefined;
  const ContentComponent = sectionTypeName
    ? ContentComponents[sectionTypeName]
    : null;

  /**
   * Handles the user picking a new content type via "Change Content".
   *
   * Critically: methods.reset() with ALL form fields — including `files` —
   * so that no data from the previous type leaks into the new type's form or
   * payload (fixes file-leakage bug and stale-image bug).
   */
  const handleChangeType = (newType: SectionTypes) => {
    console.debug("[SectionForm] Changing type:", {
      clientTempId,
      from: sectionTypeName,
      to: newType,
    });

    methods.reset(
      {
        ...EMPTY_FORM_VALUES,
        position,
        type: SectionTypesByName[newType],
      },
      {
        keepDirty: false,
        keepValues: false,
        keepTouched: false,
        keepErrors: false,
      }
    );
    setIsChangeModalOpen(false);
  };

  const onSubmit = methods.handleSubmit((formValues: SectionSchema) => {
    const formData = new FormData();

    Object.keys(formValues).forEach((key) => {
      const formKey = key as keyof SectionSchema;

      if (formKey === "files") {
        formValues[formKey]?.forEach((file, index) => {
          formData.append(`files[${index}]`, file);
        });
      } else if (formValues[formKey] || formValues[formKey] === 0) {
        formData.append(formKey, formValues[formKey].toString());
      }
    });

    console.debug("[SectionForm] Submitting new section:", {
      clientTempId,
      type: formValues.type,
      typeName: SectionTypesById[formValues.type],
      filesCount: formValues.files?.length ?? 0,
      position: formValues.position,
    });

    createSection(
      { unitId: Number(unitId), section: formData },
      {
        onSuccess: () => {
          console.debug(
            "[SectionForm] Section persisted, removing pending entry:",
            clientTempId
          );
          onSaved();
        },
        onError: (error) => {
          if (error.status === 422 && error.response?.data.message) {
            toast.error(error.response.data.message);
          }
        },
      }
    );
  });

  if (!sectionTypeName || !ContentComponent) return null;

  return (
    <>
      <FormProvider {...methods}>
        <div className="flex flex-col gap-10 p-10 relative bg-white border! border-dusty-blue! rounded-[10px]">
          <div className="absolute top-5 right-5">
            <ActionMenu
              hideArrowIcon
              trigger={
                <div className="w-[30px] h-[30px] flex items-center justify-center">
                  <OptionsIcon />
                </div>
              }
              items={[
                {
                  label: "Change Content",
                  onClick: () => setIsChangeModalOpen(true),
                },
                {
                  label: "Delete Section",
                  onClick: onDelete,
                },
              ]}
            />
          </div>
          <form
            className="flex flex-col gap-10"
            onSubmit={onSubmit}
            onBlur={isTypeTextForm ? onSubmit : () => {}}
          >
            <ContentComponent />
            {!isTypeTextForm && (
              <MainButton type="submit" isLoading={isPending}>
                Save
              </MainButton>
            )}
          </form>
        </div>
      </FormProvider>

      {/*
       * AddContentModal is rendered outside FormProvider so it does NOT
       * inherit the section's form context — it purely calls handleChangeType.
       */}
      <AddContentModal
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        onSelect={handleChangeType}
      />
    </>
  );
};
