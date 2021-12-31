import { BehaviorSubject, Observable } from 'rxjs';
import { DateHelper } from '@shared/helpers';
import { Nullable } from 'src/shared/models';

export abstract class StorageService {
  /** PRIVATE PROPERTIES */
  private subjects = new Map<string, BehaviorSubject<Nullable<string>>>();

  /** CONSTRUCTOR */
  constructor(protected storage: Storage) {}

  /** PUBLIC METHODS */
  public watch(key: string): Observable<Nullable<string>> {
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<Nullable<string>>(null));
    }

    const item = this.getItem(key);
    this.subjects.get(key)?.next(item);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.subjects.get(key)!;
  }

  public getItem(key: string): Nullable<string> {
    return this.storage.getItem(key);
  }

  public getItemWithType<T>(key: string): Nullable<T> {
    const item = this.storage.getItem(key);
    if (!item) return null;
    return JSON.parse(item, DateHelper.dateTimeReviver) as T;
  }

  public setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<Nullable<string>>(value));
    }

    this.subjects.get(key)?.next(value);
  }

  public removeItem(key: string): void {
    if (this.subjects.has(key)) {
      this.subjects.get(key)?.complete();
      this.subjects.delete(key);
    }

    this.storage.removeItem(key);
  }

  public clear(): void {
    this.subjects.forEach((subject) => subject.complete());
    this.subjects.clear();
    this.storage.clear();
  }
}
