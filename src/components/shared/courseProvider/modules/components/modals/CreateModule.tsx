import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from "components/ui/modal";
import { TextField } from "components/ui/fields/TextField";
import { TextAreatField } from "components/ui/fields/TextAreaField";
import { MainButton } from "components/ui/button";
import { moduleSchemaResolver } from "../../validation/module.schema";
import type { ModuleSchema } from "../../validation/module.schema";
import { useModal, CourseProviderModalConsts } from "hooks/courseProvider/useModal";
import { useCreateModule, useEditModule } from "api/courseProvider/modules/hooks";
import { useModuleStore } from "../../hooks/useModule";

type Props = {
  courseId: number;
  baseRoute: string;
};

export const CreateModuleModal = ({ courseId, baseRoute }: Props) => {
  const navigate = useNavigate();
  const { module, setModule } = useModuleStore();
  const { mutate: createModule, isPending } = useCreateModule();
  const { mutate: editModule, isPending: isEditPending } = useEditModule();
  const { control, handleSubmit, setError } = useForm<ModuleSchema>({
    values: {
      name: module?.name || "",
      description: module?.description || "",
      position: module?.position || null,
    },
    resolver: moduleSchemaResolver,
  });
  const isOpen = useModal((store) => store.modals[CourseProviderModalConsts.CreateModule].isOpen);
  const closeModal = useModal((store) => store.closeModal);

  const onSubmit = handleSubmit((data) => {
    if (module?.id) {
      editModule({
        moduleId: module.id,
        module: data,
      }, {
        onSuccess: () => {
          setModule(null);
          closeModal(CourseProviderModalConsts.CreateModule);
          toast.success("The module was successfully edited");
          navigate(`${baseRoute.replace(":moduleId", module.id.toString())}`);
        },
        onError: (error) => {
          if (error.response?.data.message) {
            toast.error(error.response?.data.message);
          } else {
            toast.error(error.message);
          }
          if (error.response?.data.errors) {
            Object.entries(error.response?.data.errors).forEach(([key, value]) => {
              setError(key as keyof ModuleSchema, { message: value.join(", ") });
            });
          }
        },
      });
    } else {
      createModule({ courseId, module: data }, {
        onSuccess: ({ data: { id } }) => {
          closeModal(CourseProviderModalConsts.CreateModule);
          toast.success("The module was successfully created");
          navigate(`${baseRoute.replace(":moduleId", id.toString())}`);
        },
        onError: (error) => {
          if (error.response?.data.message) {
            toast.error(error.response?.data.message);
          } else {
            toast.error(error.message);
          }
          if (error.response?.data.errors) {
            Object.entries(error.response?.data.errors).forEach(([key, value]) => {
              setError(key as keyof ModuleSchema, { message: value.join(", ") });
            });
          }
        },
      });
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      title={module?.id ? "Edit Module" : "Create Module"}
      onClose={() => {
        setModule(null);
        closeModal(CourseProviderModalConsts.CreateModule)
      }}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-8 p-10">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id="create-module-name"
              label="Module Name*"
              placeholder="Enter module name"
              error={error?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextAreatField
              id="create-module-description"
              label="Description*"
              placeholder="Enter description"
              fieldContainerClassName="h-24"
              error={error?.message}
              {...field}
            />
          )}
        />
        <MainButton
          disabled={isPending || isEditPending}
          type="submit"
          className="self-center!"
        >
          {module?.id ? "Edit Module" : "Create Module"}
        </MainButton>
      </form>
    </Modal>
  );
};