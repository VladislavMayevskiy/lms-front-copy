import type { Nullable } from "types/general";

type Props = {
  firstName: string;
  lastName: string;
  avatar?: Nullable<string>;
};
export const Avatar = ({ avatar, firstName, lastName }: Props) => {
  return (
    <div className="bg-dark-grey w-11 h-11 rounded-[4px] overflow-hidden">
      {avatar ? (
        <img src={avatar} alt="Avatar" className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-bold text-lg text-white">
            {`${firstName.charAt(0)}${lastName.charAt(0)}`}
          </span>
        </div>
      )}
    </div>
  );
};

type SchoolAvatarProps = {
  avatar: Nullable<string>;
  name: string;
};

export const SchoolAvatar = ({ avatar, name }: SchoolAvatarProps) => {
  return (
    <div className="bg-dark-grey w-11 h-11 rounded-full overflow-hidden">
      {avatar ? (
        <img src={avatar} alt="Avatar" className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-bold text-lg text-white">
            {`${name.charAt(0)}${name.charAt(1)}`}
          </span>
        </div>
      )}
    </div>
  );
};