import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { BehaviorSubject, Observable } from 'rxjs';

export abstract class StorageService {
  /** PRIVATE PROPERTIES */
  private subjects = new Map<string, BehaviorSubject<Nullable<string>>>();

  /** CONSTRUCTOR */
  constructor(protected storage: Storage) {}

  /** PUBLIC METHODS */
  watch(key: string): Observable<Nullable<string>> {
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<Nullable<string>>(null));
    }

    const item = this.getItem(key);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const subject = this.subjects.get(key)!;
    subject.next(item);

    return subject;
  }

  getItem(key: string): Nullable<string> {
    return this.storage.getItem(key);
  }

  setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<Nullable<string>>(value));
    }

    this.subjects.get(key)?.next(value);
  }

  removeItem(key: string): void {
    if (this.subjects.has(key)) {
      this.subjects.get(key)?.complete();
      this.subjects.delete(key);
    }

    this.storage.removeItem(key);
  }

  clear(): void {
    this.subjects.forEach((subject) => subject.complete());
    this.subjects.clear();
    this.storage.clear();
  }
}
