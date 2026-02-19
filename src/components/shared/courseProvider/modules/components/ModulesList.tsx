import { ListHeader } from "../../courses/components/ListHeader";
import { ModulesTable } from "./ModulesTable";
import { useModulesQuery } from "api/courseProvider/modules/hooks";
import { useModulesParams } from "../hooks/useModulesParams";

export const ModulesList = ({ courseId }: { courseId: number }) => {
  const { params, setParams } = useModulesParams();
  const { data, isLoading } = useModulesQuery(courseId, params?.search ? params : {});

  return (
    <div className="flex flex-col gap-4">
      <ListHeader
        title={`${data.meta?.total} ${(data.meta?.total || 0) === 1 ? 'Module' : 'Modules'}`}
        seach={params?.search || ''}
        handleSearchChange={(search) => setParams({ ...params, search })}
      />
      <ModulesTable
        modules={data.data}
        courseId={courseId}
        isLoading={isLoading}
      />
    </div>
  );
};
