import { RequestChangeScheduleCode } from "@teaching-scheduling-system/core/data-access/models";

export type ChangeScheduleStatistic = {
  status: RequestChangeScheduleCode[];
  date: string;
};
