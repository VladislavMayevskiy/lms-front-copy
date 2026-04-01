import { Spinner } from "components/ui/spinner";
import { Card, LabledIcon } from "../ui";
import UsersIcon from "assets/imgs/admin/dashboard/users.svg?react";
import { useTotalStudents } from "api/admin/dashboard/hooks";

export const TotalStudents = () => {
  const { data, isLoading } = useTotalStudents();

  if (isLoading) {
    return (
      <Spinner
        isLoading
      />
    );
  }

  return (
    <Card className="pt-6">
      <div className="flex items-center justify-between">
        <LabledIcon>
          <UsersIcon />
          Total students
        </LabledIcon>
        <span className="font-[Lato] font-bold text-[24px] text-dark-text">{data?.data}</span>
      </div>
    </Card>
  );
};