import moment from "moment";
import type { ModuleType } from "types/models/Module";
import type { ApiModuleType } from "./types";

export const mapFromModule = (module: ApiModuleType): ModuleType => {
  return {
    ...module,
    courseId: module.course_id,
    createdAt: moment(module.created_at).format("YYYY/MM/DD"),
    updatedAt: moment(module.updated_at).format("YYYY/MM/DD"),
  };
};

export const mapFromModules = (modules: ApiModuleType[]): ModuleType[] => {
  return modules.map((module) => mapFromModule(module));
};
