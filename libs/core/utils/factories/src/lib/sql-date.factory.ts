import { DateHelper } from '@teaching-scheduling-system/core/utils/helpers';

export function sqlDateFactory(): string {
  return DateHelper.toSqlDate(new Date());
}
