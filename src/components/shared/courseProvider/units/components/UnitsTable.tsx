import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Box,
  HStack,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { TableLoading } from "components/ui/tableLoading";
import Edit from "assets/imgs/admin/edit.svg?react"
import Delete from "assets/imgs/admin/trash.svg?react"
import TranslateIcon from "assets/imgs/admin/translate.svg?react"
// import DirectionsIcon from "assets/imgs/admin/sorting.svg?react";
import classNames from "classnames";
import { columns } from "../constants/unitsTable";
import { CourseProviderRoutes, SchoolCourseProviderRoutes } from "constants/routes";
import type { UnitType } from "types/models/Unit";
import { useUnitStore } from "../hooks/useUnit";
import { useModal, CourseProviderModalConsts } from "hooks/courseProvider/useModal";
import { authStore } from "stores/authStore";
import { useTranslationsModal } from "components/shared/courseProvider/translations/useTranslationsModal";

type Props = {
  units: UnitType[];
  courseId: number;
  moduleId: number;
  isLoading?: boolean;
};

export const UnitsTable = ({ units, courseId, moduleId, isLoading }: Props) => {
  const user = authStore((store) => store.user);
  const baseRoute = useMemo(() =>
    user?.role === 'SchoolCourseProvider' ? SchoolCourseProviderRoutes : CourseProviderRoutes
  , [user]);

  const openModal = useModal((store) => store.openModal);
  const setUnit = useUnitStore((store) => store.setUnit);
  const openTranslationsModal = useTranslationsModal((store) => store.openModal);
  const { getHeaderGroups, getRowModel } = useReactTable({
    columns,
    data: units,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full table-fixed">
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
                      "flex items-center gap-1.5 font-normal text-base px-5 py-4 bg-light-blue text-left whitespace-nowrap overflow-hidden",
                      {
                        "rounded-l-[8px]": index === 0,
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
            <th
              key="courses-table-actions"
              className="py-1 w-[20%]"
            >
              <div className="font-normal text-left text-base px-5 py-4 bg-light-blue rounded-r-[8px]">
                Actions
              </div>
            </th>
          </tr>
        ))}
      </thead>
      <tbody>
        <TableLoading isLoading={isLoading} />
        {getRowModel().rows.map((row) => (
          <tr
            key={row.original.id}
            className="group cursor-pointer"
          >
            {row.getVisibleCells().map((cell, index) => (
              <td
                key={cell.id}
                className="py-1 overflow-hidden"
              >
                <Link
                  to={
                    `${
                      baseRoute.sections
                      .replace(":id", String(courseId))
                      .replace(":moduleId", String(moduleId))
                      .replace(":unitId", String(row.original.id))
                    }`
                  }
                  className="block min-w-0 overflow-hidden"
                >
                  <div
                    className={
                    classNames(
                      "min-h-[68px] font-normal text-base px-5 py-4 border-light-blue! border-t! border-b!",
                      "group-hover:bg-grey group-hover:border-primary! transition-colors duration-300",
                      "flex items-center min-w-0 overflow-hidden",
                      {
                        "border-l! rounded-l-[8px]!": index === 0,
                      }
                    )}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </div>
                </Link>
              </td>
            ))}
            <td className="py-1">
              <div
                className={
                  classNames(
                    "min-h-[68px] flex px-5 py-2 border-light-blue! border-t! border-b! border-r! rounded-r-[8px]!",
                    "group-hover:bg-grey group-hover:border-primary! transition-colors duration-300",
                  )
                }
              >
                <HStack>
                  <Button
                    w="40px"
                    h="40px"
                    borderRadius="6px"
                    borderWidth="1px"
                    bg="white"
                    _hover={{ bgColor: "white" }}
                    borderColor={"#B4D6DF"}
                    onClick={() => {
                      setUnit(row.original);
                      openModal(CourseProviderModalConsts.CreateUnit);
                    }}
                  >
                    <Box>
                      <Edit width={"20px"} height={"20px"}/>
                    </Box>
                  </Button>

                  <Button
                    w="40px"
                    h="40px"
                    borderRadius="6px"
                    borderWidth="1px"
                    bg="#FFEFEF"
                    borderColor={"#FFB7B7"}
                    _hover={{ bgColor: "#FFEFEF" }}
                    onClick={() => {
                      setUnit(row.original);
                      openModal(CourseProviderModalConsts.Delete);
                    }}
                  >
                    <Box>
                      <Delete width={"20px"} height={"20px"}/>
                    </Box>
                  </Button>

                  <Button
                    w="40px"
                    h="40px"
                    borderRadius="6px"
                    borderWidth="1px"
                    bg="white"
                    _hover={{ bgColor: "white" }}
                    borderColor={"#B4D6DF"}
                    title="Edit translations"
                    onClick={() =>
                      openTranslationsModal("unit", row.original.id, row.original.name)
                    }
                  >
                    <Box>
                      <TranslateIcon width={"20px"} height={"20px"}/>
                    </Box>
                  </Button>
                </HStack>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};