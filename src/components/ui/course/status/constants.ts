import type { CourseStatusType } from "types/models/Course";

export const styles: Record<CourseStatusType, string> = {
  "Archived": "border-status-archived! text-status-archived",
  "Draft": "border-orange! text-orange",
  "Published": "border-green! text-green",
}
