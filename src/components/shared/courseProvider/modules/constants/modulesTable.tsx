import { createColumnHelper } from "@tanstack/react-table";
import type { ModuleType } from "types/models/Module";

const columnHelper = createColumnHelper<ModuleType>();

export const columns = [
  columnHelper.accessor("name", {
    header: "Module Name",
    meta: {
      className: "w-[60%]",
    },
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("updatedAt", {
    header: "Last Changes",
    meta: {
      className: "w-[20%]",
    },
    cell: (info) => info.getValue(),
  }),
];