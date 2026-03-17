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
      className: "w-[45%]",
    },
    cell: (info) => (
      <Link
        to={`${CourseProviderRoutes.modules.replace(":id", String(info.row.original.id))}`}
        className="w-full min-w-0 block overflow-hidden"
      >
        <span className="truncate whitespace-nowrap overflow-hidden block">
          {info.getValue()}
        </span>
      </Link>
    ),
  }),
  columnHelper.accessor("type", {
    header: "Course Type",
    meta: {
      className: "w-[12%]",
    },
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("schoolsCount", {
    header: "Assigned Schools",
    meta: {
      className: "w-[12%]",
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
      className: "w-[18%]",
    },
    cell: (info) => (
      <CourseStatus
        status={info.getValue()}
      />
    ),
  }),
];