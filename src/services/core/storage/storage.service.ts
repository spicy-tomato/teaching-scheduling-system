import { BehaviorSubject, Observable } from "rxjs";

export abstract class StorageService {
  /** PRIVATE PROPERTIES */
  private subjects = new Map<string, BehaviorSubject<string | null>>();

  /** CONSTRUCTOR */
  constructor(protected storage: Storage) { }

  /** PUBLIC METHODS */
  public watch(key: string): Observable<string | null> {
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<string | null>(null));
    }

    const item = this.getItem(key);
    this.subjects.get(key)?.next(item);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.subjects.get(key)!;
  }

  public getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  public setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
    if (!this.subjects.has(key)) {
      this.subjects.set(key, new BehaviorSubject<string | null>(value));
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
