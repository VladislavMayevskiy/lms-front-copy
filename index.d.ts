import "@tanstack/react-table";

declare module "*.png";
declare module "*.jpg";
declare module "*.svg" {
  import * as React from "react";

  const ReactComponent: React.FunctionComponent<
    React.ComponentProps<"svg"> & { title?: string }
  >;

  export default ReactComponent;
};
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
  };
};