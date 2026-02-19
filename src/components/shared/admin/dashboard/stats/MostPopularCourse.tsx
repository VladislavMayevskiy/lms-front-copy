import { Spinner } from "components/ui/spinner";
import { Card, LabledIcon } from "../ui";
import PopularIcon from "assets/imgs/admin/dashboard/popular.svg?react";
import { useMostPopularCourse } from "api/admin/dashboard/hooks";
import { minutesToDecimalHours } from "utils/durationDisplay";

export const MostPopularCourse = () => {
  const { data, isLoading } = useMostPopularCourse();
  const durationTime = minutesToDecimalHours(data?.data.duration || 0);

  if (isLoading) {
    return (
      <Spinner
        isLoading
      />
    );
  }

  return (
    <Card className="flex gap-5">
      <div className="w-[149px] h-[149px] rounded-[10px]! border! border-grey! overflow-hidden">
        <img
          src={data?.data.image}
          className="w-full h-full!"
          alt="Course img"
        />
      </div>
      <div className="flex flex-col gap-5 justify-between">
        <LabledIcon>
          <PopularIcon />
          Most popular course
        </LabledIcon>
        <p className="font-[Lato] font-semibold text-base text-dark-text">{data?.data.name}</p>
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded-md! bg-grey text-dark-text font-[Lato] font-medium text-sm">
            {durationTime}
          </div>
          <div className="px-2 py-0.5 rounded-md! bg-grey text-dark-text font-[Lato] font-medium text-sm">
            {`Instructor: ${data?.data.instructor}`}
          </div>
        </div>
      </div>
    </Card>
  );
};