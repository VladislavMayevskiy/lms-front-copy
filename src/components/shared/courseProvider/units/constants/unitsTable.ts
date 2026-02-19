import { createColumnHelper } from "@tanstack/react-table";
import type { UnitType } from "types/models/Unit";

const columnHelper = createColumnHelper<UnitType>();

export const columns = [
  columnHelper.accessor("name", {
    header: "Unit Name",
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