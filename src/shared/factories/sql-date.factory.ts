import { DateHelper } from '@shared/helpers';

export function sqlDateFactory(): string {
  return DateHelper.toSqlDate(new Date());
}
