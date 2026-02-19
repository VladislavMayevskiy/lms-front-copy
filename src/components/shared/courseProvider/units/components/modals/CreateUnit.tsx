import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "components/ui/modal";
import { TextField } from "components/ui/fields/TextField";
import { TextAreatField } from "components/ui/fields/TextAreaField";
import { MainButton } from "components/ui/button";
import { unitSchemaResolver } from "../../validation/unit.schema";
import type { UnitSchema } from "../../validation/unit.schema";
import { useModal, CourseProviderModalConsts } from "hooks/courseProvider/useModal";
import { useCreateUnit, useEditUnit } from "api/courseProvider/units/hooks";
import { useUnitStore } from "../../hooks/useUnit";

type Props = {
  moduleId: number;
  baseRoute: string;
};

export const CreateUnitModal = ({ moduleId, baseRoute }: Props) => {
  const { unit, setUnit } = useUnitStore();
  const navigate = useNavigate();
  const { mutate: createUnit, isPending } = useCreateUnit();
  const { mutate: editUnit, isPending: isEditPending } = useEditUnit();
  const { control, handleSubmit, setError } = useForm<UnitSchema>({
    values: {
      name: unit?.name || "",
      description: unit?.description || "",
      position: unit?.position || null,
    },
    resolver: unitSchemaResolver,
  });
  const isOpen = useModal((store) => store.modals[CourseProviderModalConsts.CreateUnit].isOpen);
  const closeModal = useModal((store) => store.closeModal);

  const onSubmit = handleSubmit((data) => {
    if (unit?.id) {
      editUnit({
        unitId: unit.id,
        unit: data,
      }, {
        onSuccess: () => {
          setUnit(null);
          closeModal(CourseProviderModalConsts.CreateUnit);
          toast.success("The unit was successfully edited");
          navigate(`${baseRoute.replace(":unitId", unit.id.toString())}`);
        },
        onError: (error) => {
          if (error.response?.data.message) {
            toast.error(error.response?.data.message);
          } else {
            toast.error(error.message);
          }
          if (error.response?.data.errors) {
            Object.entries(error.response?.data.errors).forEach(([key, value]) => {
              setError(key as keyof UnitSchema, { message: value.join(", ") });
            });
          }
        },
      });
    } else {
      createUnit({ moduleId, unit: data }, {
        onSuccess: ({ data: { id } }) => {
          closeModal(CourseProviderModalConsts.CreateUnit);
          toast.success("The unit was successfully created");
          navigate(`${baseRoute.replace(":unitId", id.toString())}`);
        },
        onError: (error) => {
          if (error.response?.data.message) {
            toast.error(error.response?.data.message);
          } else {
            toast.error(error.message);
          }
          if (error.response?.data.errors) {
            Object.entries(error.response?.data.errors).forEach(([key, value]) => {
              setError(key as keyof UnitSchema, { message: value.join(", ") });
            });
          }
        },
      });
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      title={unit?.id ? "Edit Unit" : "Create Unit"}
      onClose={() => {
        setUnit(null);
        closeModal(CourseProviderModalConsts.CreateUnit)
      }}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-8 p-10">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              id="create-unit-name"
              label="Unit Name*"
              placeholder="Enter unit name"
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
              id="create-unit-description"
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
          {unit?.id ? "Edit Unit" : "Create Unit"}
        </MainButton>
      </form>
    </Modal>
  );
};