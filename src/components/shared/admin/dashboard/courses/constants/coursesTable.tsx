import { createColumnHelper } from "@tanstack/react-table";
import { Schools } from "components/ui/course/schools";
import type { CourseListType } from "types/models/Course";

const columnHelper = createColumnHelper<CourseListType>();

export const columns = [
  columnHelper.accessor("name", {
    header: "Course Name",
    meta: {
      className: "w-[60%]",
    },
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("type", {
    header: "Course Type",
    meta: {
      className: "w-[20%]",
    },
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("schoolsCount", {
    header: "Assigned Schools",
    meta: {
      className: "w-[20%]",
    },
    cell: (info) => (
      <Schools
        schoolsCount={info.getValue()}
        course={info.row.original}
        disabled
      />
    ),
  }),
];