import { createColumnHelper } from "@tanstack/react-table";
import type { ModuleType } from "types/models/Module";

const columnHelper = createColumnHelper<ModuleType>();

export const columns = [
  columnHelper.accessor("name", {
    header: "Module Name",
    meta: {
      className: "w-[60%]",
    },
    cell: (info) => (
      <span className="truncate whitespace-nowrap overflow-hidden block">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("updatedAt", {
    header: "Last Changes",
    meta: {
      className: "w-[20%]",
    },
    cell: (info) => info.getValue(),
  }),
];