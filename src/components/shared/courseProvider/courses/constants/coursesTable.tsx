import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { CourseStatus } from "components/ui/course/status";
import { Schools } from "components/ui/course/schools";
import { CourseProviderRoutes } from "constants/routes";
import type { CourseListType } from "types/models/Course";

const columnHelper = createColumnHelper<CourseListType>();

export const columns = [
  columnHelper.accessor("name", {
    header: "Course Name",
    meta: {
      className: "w-[60%]",
    },
    cell: (info) => (
      <Link
        to={`${CourseProviderRoutes.modules.replace(":id", String(info.row.original.id))}`}
        className="w-full"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor("type", {
    header: "Course Type",
    meta: {
      className: "w-[11%]",
    },
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("schoolsCount", {
    header: "Assigned Schools",
    meta: {
      className: "w-[10%]",
    },
    cell: (info) => (
      <Schools
        schoolsCount={info.getValue()}
        course={info.row.original}
      />
    ),
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