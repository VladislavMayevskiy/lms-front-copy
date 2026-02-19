import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TableLoading } from "components/ui/tableLoading";
// import DirectionsIcon from "assets/imgs/admin/sorting.svg?react";
import classNames from "classnames";
import { columns } from "./constants/coursesTable";
import type { CourseListType } from "types/models/Course";

type Props = {
  courses: CourseListType[];
  isLoading?: boolean;
};

export const CoursesTable = ({ courses, isLoading }: Props) => {
  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data: courses,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header, index) => (
              <th
                key={header.id}
                className={
                  classNames(
                    "py-1",
                    header.column.columnDef.meta?.className,
                  )
                }
              >
                <div
                  className={
                    classNames(
                      "flex items-center gap-1.5 font-normal text-base px-5 py-4 bg-light-blue text-left",
                      {
                        "rounded-l-lg": index === 0,
                        "rounded-r-lg! justify-end": index + 1 === headerGroup.headers.length,
                      }
                    )
                  }
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {/* <DirectionsIcon className="cursor-pointer" /> */}
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        <TableLoading isLoading={isLoading} />
        {getRowModel().rows.map((row) => (
          <tr
            key={row.original.id}
            // className="group cursor-pointer"
          >
            {row.getVisibleCells().map((cell, index) => (
              <td
                key={cell.id}
                className="py-1"
              >
                <div
                  className={
                  classNames(
                    "min-h-[68px] font-normal text-base px-5 py-4 border-light-blue! border-t! border-b!",
                    // "group-hover:bg-grey group-hover:border-primary! transition-colors duration-300",
                    "flex items-center",
                    {
                      "border-l! rounded-l-lg!": index === 0,
                      "border-r! rounded-r-lg! justify-end": index + 1 === row.getVisibleCells().length,
                    }
                  )}
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};