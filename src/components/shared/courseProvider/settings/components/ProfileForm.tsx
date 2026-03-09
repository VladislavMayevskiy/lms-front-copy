import { useForm, Controller } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import { Divider } from "@chakra-ui/react";
import { toast } from "react-toastify";
import { MainButton } from "components/ui/button";
import { TextField } from "components/ui/fields/TextField";
import { SelectField } from "components/ui/fields/SelectField";
import { DateField } from "components/ui/fields/DateField";
import { GenderOptions } from "constants/gender";
import { profileSchemaResolver } from "../validation/profile.schema";
import type { ProfileSchema } from "../validation/profile.schema";
import type { UserType } from "types/models/User";
import { useUpdateProfile } from "api/courseProvider/profile/hooks";
import { useUpdateImageUser } from "api/user/hooks";

type Props = {
  user: UserType;
};

export const ProfileForm = ({ user }: Props) => {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { mutate: uploadImage, isPending: isUploadingImage } = useUpdateImageUser();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    if (import.meta.env.DEV) {
      console.debug('[ProfileForm] Starting image upload for file:', file.name);
    }

    uploadImage(file, {
      onSuccess: () => {
        if (import.meta.env.DEV) {
          console.debug('[ProfileForm] Image upload succeeded – cache invalidated, refetch in flight');
        }
        toast.success('Profile picture updated successfully');

        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: (err) => {
        if (import.meta.env.DEV) {
          console.debug('[ProfileForm] Image upload failed:', err);
        }
        toast.error('Failed to update profile picture. Please try again.');
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
    });
  };

  const { control, handleSubmit } = useForm<ProfileSchema>({
    values: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      phone: user?.phone || "",
      gender: user.gender || 0,
      birthday: user.birthday,
    },
    resolver: profileSchemaResolver,
  });

  const onSubmit = handleSubmit((formData: ProfileSchema) => {
    updateProfile(formData, {
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

  const displaySrc = previewUrl || user.image || null;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>

      <div className="grid grid-cols-3">
        <h3 className="font-[Lato] font-semibold! text-[20px]!">Profile Picture</h3>
        <div className="col-span-2 flex items-center gap-6">
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-[#E9ECEF] flex items-center justify-center flex-shrink-0">
            {displaySrc ? (
              <img
                src={displaySrc}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (import.meta.env.DEV) {
                    console.debug('[ProfileForm] Profile image failed to load:', e.currentTarget.src);
                  }
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span className="font-bold text-2xl text-gray-500 select-none">
                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <MainButton
              type="button"
              isLoading={isUploadingImage}
              disabled={isUploadingImage}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploadingImage ? 'Uploading…' : 'Change Picture'}
            </MainButton>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </div>

      <Divider width="100%" borderColor="#D6D9DE" />

      <div className="grid grid-cols-3">
        <h3 className="font-[Lato] font-semibold! text-[20px]!">Profile Information</h3>
        <div className="col-span-2 flex flex-col gap-8">
          <div className="flex gap-8">
            <Controller
              control={control}
              name="first_name"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  label="First name"
                  error={error?.message}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="last_name"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  label="Last name"
                  error={error?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className="flex gap-8">
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  label="Email"
                  error={error?.message}
                  className="opacity-50!"
                  disabled
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  label="Phone"
                  error={error?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className="flex gap-8">
            <Controller
              control={control}
              name="gender"
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <SelectField
                  label="Gender"
                  error={error?.message}
                  options={GenderOptions}
                  value={value}
                  onChange={(event) => {
                    onChange(Number(event.target.value));
                  }}
                />
              )}
            />
            <Controller
              control={control}
              name="birthday"
              render={({ field, fieldState: { error } }) => (
                <DateField
                  label="Birthday"
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
          Save Changes
        </MainButton>
      </div>
      <Divider width="100%" borderColor="#D6D9DE" />
    </form>
  );
};
