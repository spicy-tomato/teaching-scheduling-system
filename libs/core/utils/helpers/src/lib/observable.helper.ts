import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  combineLatest,
  concat,
  connect,
  filter,
  map,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  pipe,
  Subscription,
  UnaryFunction,
  withLatestFrom,
} from 'rxjs';
import { ArrayHelper } from './array.helper';
import { ObjectHelper } from './object.helper';

export class ObservableHelper {
  static filterNullish<T>(): UnaryFunction<
    Observable<Nullable<T> | undefined>,
    Observable<T>
  > {
    return pipe(
      filter((x) => !ObjectHelper.isNullOrUndefined(x)) as OperatorFunction<
        Nullable<T> | undefined,
        T
      >
    );
  }

  static filterUndefined<T>(): UnaryFunction<
    Observable<T | undefined>,
    Observable<T>
  > {
    return pipe(
      filter((x) => x !== undefined) as OperatorFunction<T | undefined, T>
    );
  }

  static filterWith<T, U>(
    other$: Observable<U[]>,
    accept: U[] | U
  ): MonoTypeOperatorFunction<T> {
    return (source$) => {
      return source$.pipe(
        withLatestFrom(other$),
        filter(({ 1: other }) => {
          if (!ArrayHelper.isArray(accept)) {
            return other.includes(accept as U);
          }
          return ArrayHelper.isSubset(accept as U[], other);
        }),
        map(([source]) => source)
      );
    };
  }

  static waitNullish<T1, T2>(
    ob$: Observable<Nullable<T2> | undefined>
  ): OperatorFunction<T1, [T1, T2]> {
    return (source$) => {
      return combineLatest([source$, ob$]).pipe(
        filter(
          ({ 1: ob }) => !ObjectHelper.isNullOrUndefined(ob)
        ) as OperatorFunction<[T1, Nullable<T2> | undefined], [T1, T2]>
      );
    };
  }

  static delayUntil<T>(notifier$: Observable<unknown>): OperatorFunction<T, T> {
    return (source$) =>
      source$.pipe(
        connect((published) => {
          const delayed = new Observable<T>((subscriber) => {
            let buffering = true;
            const buffer: T[] = [];
            const subscription = new Subscription();
            subscription.add(
              notifier$.subscribe({
                next: () => {
                  buffer.forEach((value) => subscriber.next(value));
                  subscriber.complete();
                },
                error: (e) => subscriber.error(e),
                complete: () => {
                  buffering = false;
                  buffer.length = 0;
                },
              })
            );
            subscription.add(
              published.subscribe({
                next: (value) => buffering && buffer.push(value),
                error: (e) => subscriber.error(e),
              })
            );
            subscription.add(() => (buffer.length = 0));
            return subscription;
          });

          return concat(delayed, published);
        })
      );
  }
}
