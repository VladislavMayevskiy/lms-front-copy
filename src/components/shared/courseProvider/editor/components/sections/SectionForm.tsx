import { useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "@chakra-ui/react";
import { ActionMenu } from "components/ui/actionMenu";
import { MainButton } from "components/ui/button";
import { Content } from "../content";
import { AddContentModal } from "../modals/AddContent";
import PlusIcon from "assets/imgs/plus.svg?react";
import OptionsIcon from "assets/imgs/options.svg?react";
import { sectionSchemaResolver } from "../../validation/section.schema";
import type { SectionSchema } from "../../validation/section.schema";
import { useAddContentModal } from "../../hooks/useAddContentModal";
import { useCreateSection } from "api/courseProvider/sections/hooks";
import { SectionTypesById } from "constants/section";
import { isTextForm } from "./utils";

type Props = {
  length: number;
};

const InitialForm = {
  title: "",
  content: "",
  files: [],
};

export const SectionForm = ({ length }: Props) => {
  const { unitId } = useParams();

  const openAddContentModal = useAddContentModal((store) => store.onOpen);
  const { mutate: createSection, isPending } = useCreateSection();

  const methods = useForm<SectionSchema>({
    defaultValues: {
      ...InitialForm,
      position: length,
    },
    resolver: sectionSchemaResolver,
  });
  const type = methods.watch('type');
  const isTypeTextForm = isTextForm(type);

  const onSubmit = methods.handleSubmit((formValues: SectionSchema) => {
    const formData = new FormData();

    Object.keys(formValues).forEach((key) => {
      const formKey = key as keyof SectionSchema;

      if (formKey === 'files') {
        formValues[formKey]?.forEach((file, index) => {
          formData.append(`files[${index}]`, file);
        });
      } else if (formValues[formKey]) {
        formData.append(formKey, formValues[formKey].toString());
      }
    });

    createSection({ unitId: Number(unitId), section: formData }, {
      onSuccess: () => {
        methods.reset({
          ...InitialForm,
          position: length,
          type: undefined,
        }, {
          keepDirty: false,
          keepValues: false,
          keepTouched: false,
        });
      },
      onError: (error) => {
        if (error.status === 422 && error.response?.data.message) {
          toast.error(error.response.data.message);
        }
      },
    });
  });

  return (
    <FormProvider {...methods}>
      {Boolean(type) && (
        <div
          key={length}
          className="flex flex-col gap-10 p-10 relative bg-white border! border-dusty-blue! rounded-[10px]"
        >
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
                  onClick: openAddContentModal,
                },
                {
                  label: "Delete Section",
                  onClick: () => methods.setValue("type", 0),
                },
              ]}
            />
          </div>
          <form
            className="flex flex-col gap-10"
            onSubmit={onSubmit}
            onBlur={isTypeTextForm ? onSubmit : () => {}}
          >
            {Content[SectionTypesById[type]]}
            {!isTypeTextForm && (
              <MainButton type="submit">Save</MainButton>
            )}
          </form>
        </div>
      )}
      <div className="flex items-center justify-center gap-5">
        <Button
          borderRadius={"10px"}
          bgColor={"#F27D3B"}
          _hover={{ bgColor: "#F27D3B", opacity: 0.8 }}
          textColor={"white"}
          height={"44px"}
          leftIcon={<PlusIcon />}
          onClick={openAddContentModal}
          disabled={isPending}
          className="disabled:cursor-not-allowed"
        >
          Add section
        </Button>
      </div>
      <AddContentModal />
    </FormProvider>
  );
};