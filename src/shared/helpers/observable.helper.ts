import { Nullable } from '@shared/models';
import {
  combineLatest,
  concat,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  pipe,
  Subscription,
  UnaryFunction,
} from 'rxjs';
import { filter, map, publish, withLatestFrom } from 'rxjs/operators';
import { ArrayHelper } from './array.helper';
import { ObjectHelper } from './object.helper';

export class ObservableHelper {
  public static filterNullish<T>(): UnaryFunction<
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

  public static filterUndefined<T>(): UnaryFunction<
    Observable<T | undefined>,
    Observable<T>
  > {
    return pipe(
      filter((x) => x !== undefined) as OperatorFunction<T | undefined, T>
    );
  }

  public static filterWith<T, U>(
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
          return ArrayHelper.includesArray(other, accept as U[]);
        }),
        map(([source]) => source)
      );
    };
  }

  public static waitNullish<T1, T2>(
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

  public static delayUntil<T>(
    notifier$: Observable<unknown>
  ): OperatorFunction<T, T> {
    return (source$) =>
      source$.pipe(
        publish((published) => {
          const delayed = new Observable<T>((subscriber) => {
            let buffering = true;
            const buffer: T[] = [];
            const subscription = new Subscription();
            subscription.add(
              notifier$.subscribe(
                () => {
                  buffer.forEach((value) => subscriber.next(value));
                  subscriber.complete();
                },
                (e) => subscriber.error(e),
                () => {
                  buffering = false;
                  buffer.length = 0;
                }
              )
            );
            subscription.add(
              published.subscribe(
                (value) => buffering && buffer.push(value),
                (e) => subscriber.error(e)
              )
            );
            subscription.add(() => (buffer.length = 0));
            return subscription;
          });

          return concat(delayed, published);
        })
      );
  }

  public static mapObjectArrayWithDateProperties<T>(
    props: string[]
  ): MonoTypeOperatorFunction<T> {
    return pipe(
      map((x) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
        return (x as any).map((x: unknown) =>
          ObjectHelper.parseDateProperties(x, props)
        );
      })
    );
  }
}
