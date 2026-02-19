import { useForm, Controller } from "react-hook-form";
import { Divider } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { MainButton } from "components/ui/button";
import { TextField } from "components/ui/fields/TextField";
import { passwordSchemaResolver } from "../validation/password.schema";
import type { PasswordSchema } from "../validation/password.schema";
import { useChangePassword } from "api/courseProvider/password/hooks";

export const PasswordForm = () => {
  const { mutate: changePassword, isPending } = useChangePassword();
  const { control, handleSubmit } = useForm<PasswordSchema>({
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    resolver: passwordSchemaResolver,
  });
  const onSubmit = handleSubmit((formData: PasswordSchema) => {
    changePassword(formData, {
      onSuccess: () => {
        toast.success('Profile successfully updated');
      },
      onError: (error) => {
        if (error.status === 422) {
          toast.error(error.response?.data.message || error.message);
        } else {
          toast.error(error.message);
        }
      },
    })
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <div className="grid grid-cols-3">
        <h3 className="font-[Lato] font-semibold! text-[20px]!">Change Password</h3>
        <div className="col-span-2 flex flex-col gap-8">
          <div className="flex gap-8">
            <Controller
              control={control}
              name="old_password"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  label="Old password"
                  placeholder="Enter old password"
                  type="password"
                  error={error?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className="flex gap-8">
            <Controller
              control={control}
              name="new_password"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  label="New password"
                  placeholder="Enter new password"
                  error={error?.message}
                  type="password"
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="new_password_confirmation"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  label="Confirm new password"
                  placeholder="Confirm new password"
                  type="password"
                  error={error?.message}
                  {...field}
                />
              )}
            />
          </div>
        </div>
      </div>
      <Divider width="100%" borderColor="#D6D9DE" />
      <div className="flex items-center justify-center">
        <MainButton
          type="submit"
          disabled={isPending}
        >
          Save
        </MainButton>
      </div>
    </form>
  );
};
