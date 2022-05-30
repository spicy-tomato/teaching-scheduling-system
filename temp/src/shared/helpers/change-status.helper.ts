import { Nullable, RequestChangeScheduleType } from '@shared/models';

export class ChangeStatusHelper {
  public static isCancelled(status: number): boolean {
    return this.isBetween(status, 100);
  }

  public static isPending(status: number): boolean {
    return this.isBetween(status, 200);
  }

  public static isApproved(status: number): boolean {
    return this.isBetween(status, 300);
  }

  public static isChanged(status: number): boolean {
    return this.isBetween(status, 400);
  }

  public static isDenied(status: number): boolean {
    return this.isBetween(status, 500);
  }

  public static getType(status: number): Nullable<RequestChangeScheduleType> {
    switch (true) {
      case this.isCancelled(status):
        return 'cancel';
      case this.isPending(status):
        return 'pending';
      case this.isApproved(status):
        return 'approve';
      case this.isChanged(status):
        return 'change';
      case this.isDenied(status):
        return 'deny';
    }
    return null;
  }

  public static canExport(status: number): boolean {
    const statusType = this.getType(status);
    return !(
      statusType === null ||
      statusType === 'cancel' ||
      statusType === 'deny' ||
      status === 200 ||
      status === 201
    );
  }

  private static isBetween(value: number, minValue: number): boolean {
    return minValue <= value && value < minValue + 100;
  }
}
