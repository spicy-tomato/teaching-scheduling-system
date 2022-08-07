import {
  Nullable,
  RequestChangeScheduleType,
} from '@teaching-scheduling-system/core/data-access/models';

export class ChangeStatusHelper {
  static isCancelled(status: number): boolean {
    return this.isBetween(status, 100);
  }

  static isPending(status: number): boolean {
    return this.isBetween(status, 200);
  }

  static isApproved(status: number): boolean {
    return this.isBetween(status, 300);
  }

  static isChanged(status: number): boolean {
    return this.isBetween(status, 400);
  }

  static isDenied(status: number): boolean {
    return this.isBetween(status, 500);
  }

  static getType(status: number): Nullable<RequestChangeScheduleType> {
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

  static canExport(status: number): boolean {
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
