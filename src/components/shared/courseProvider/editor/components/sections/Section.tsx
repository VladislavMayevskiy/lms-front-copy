import { useMemo } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import { ActionMenu } from "components/ui/actionMenu";
import { MainButton } from "components/ui/button";
import { Content } from "../content";
import DragHandleIcon from "assets/imgs/courseProvider/DragH.svg?react";
import OptionsIcon from "assets/imgs/options.svg?react";
import { sectionSchemaResolver } from "../../validation/section.schema";
import type { SectionSchema } from "../../validation/section.schema";
import type { SectionType } from "types/models/Section";
import { SectionTypesByName } from "constants/section";
import { useEditSection, useDeleteSection } from "api/courseProvider/sections/hooks";
import { useArrayFiles } from "hooks/useFile";
import { isTextForm } from "./utils";

type Props = {
  section: SectionType;
};

export const Section = ({ section }: Props) => {
  const controls = useDragControls();
  const isTypeTextForm = useMemo(() => isTextForm(SectionTypesByName[section.type]), [section]);

  const { mutate: editSection } = useEditSection();
  const { mutate: deleteSection } = useDeleteSection();

  const methods = useForm<SectionSchema>({
    defaultValues: {
      title: section.title || "",
      content: section.content || "",
      position: section.position,
      type: SectionTypesByName[section.type],
      files: [],
    },
    resolver: sectionSchemaResolver,
  });

  const onSubmit = methods.handleSubmit((formValues: SectionSchema) => {
    const formData = new FormData();

    Object.keys(formValues).forEach((key) => {
      const formKey = key as keyof SectionSchema;

      if (formKey === 'files') {
        formValues[formKey]?.forEach((file, index) => {
          formData.append(`files[${index}]`, file);
        });
      } else if (formValues[formKey] || formValues[formKey] === 0) {
        formData.append(formKey, formValues[formKey].toString());
      }
    });

    editSection({ sectionId: section.id, section: formData }, {
      onError: (error) => {
        if (error.status === 422 && error.response?.data.message) {
          toast.error(error.response.data.message);
        }
      },
    });
  });

  useArrayFiles({
    urls: section?.files.map(({ url }) => ({
      url: url || '',
      fileName: (url || '').split('/').pop() || '',
    })) || [],
    setFiles: (files) => methods.setValue('files', files),
  });

  return (
    <Reorder.Item
      key={section.id}
      value={section}
      as="div"
      dragListener={false}
      dragControls={controls}
      className="flex flex-col gap-10 p-10 relative bg-white border! border-dusty-blue! rounded-[10px]"
      whileDrag={{
        scale: 1.05,
        boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.3)",
      }}
    >
      <DragHandleIcon
        className="absolute top-2 left-1/2 -translate-x-1/2 cursor-grab reorder-handle"
        onPointerDown={(e) => controls.start(e)}
      />
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
              label: "Delete Section",
              onClick: () => deleteSection(section.id),
            },
          ]}
        />
      </div>
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-10"
          onSubmit={onSubmit}
          onBlur={isTypeTextForm ? onSubmit : () => {}}
        >
          {Content[section.type]}
          {!isTypeTextForm && (
            <MainButton type="submit">Save</MainButton>
          )}
        </form>
      </FormProvider>
    </Reorder.Item>
  );
};