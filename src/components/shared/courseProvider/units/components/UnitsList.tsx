import { ListHeader } from "../../courses/components/ListHeader";
import { UnitsTable } from "./UnitsTable";
import { useUnitsQuery } from "api/courseProvider/units/hooks";
import { useUnitsParams } from "../hooks/useUnitsParams";

export const UnitsList = ({ courseId, moduleId }: { courseId: number; moduleId: number; }) => {
  const { params, setParams } = useUnitsParams();
  const { data, isLoading } = useUnitsQuery(moduleId, params?.search ? params : {});

  return (
    <div className="flex flex-col gap-4">
      <ListHeader
        title={`${data.meta?.total} ${(data.meta?.total || 0) === 1 ? 'Unit' : 'Units'}`}
        seach={params?.search || ''}
        handleSearchChange={(search) => setParams({ ...params, search })}
      />
      <UnitsTable
        units={data.data}
        courseId={courseId}
        moduleId={moduleId}
        isLoading={isLoading}
      />
    </div>
  );
};
