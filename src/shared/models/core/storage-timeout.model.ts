import { LocalStorageKeyConstant } from '@constants/core/local-storage-key.constant';

export class StorageTimeoutModel<T> {
  public data!: T;
  public ttl!: number;
  public created!: Date;

  constructor(
    data: T,
    ttl: number = LocalStorageKeyConstant.SHORT_TIMEOUT,
    created = new Date()
  ) {
    this.data = data;
    this.ttl = ttl;
    this.created = created;
  }

  public isValid(): boolean {
    const now = new Date();
    return now.getTime() < this.created.getTime() + this.ttl;
  }

  public static fromObject<T>(
    obj: StorageTimeoutModel<T>
  ): StorageTimeoutModel<T> {
    return new StorageTimeoutModel(obj.data, obj.ttl, obj.created);
  }
}
