import { createColumnHelper } from "@tanstack/react-table";
import { CourseStatus } from "components/ui/course/status";
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
  columnHelper.accessor("status", {
    header: "Status",
    meta: {
      className: "w-[20%]",
    },
    cell: (info) => (
      <CourseStatus
        status={info.getValue()}
      />
    ),
  }),
];