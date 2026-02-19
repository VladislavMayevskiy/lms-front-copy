import { Spinner } from "components/ui/spinner";

type Props = {
  isLoading?: boolean;
};

export const TableLoading = ({ isLoading }: Props) => {
  return isLoading && (
    <tr className="relative h-[100px] p-4">
      <td className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-end">
        <Spinner isLoading={isLoading} />
      </td>
    </tr>
  );
};