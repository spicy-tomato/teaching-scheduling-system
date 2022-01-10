import { Nullable } from '@shared/models';
import {
  combineLatest,
  concat,
  Observable,
  OperatorFunction,
  pipe,
  Subscription,
  UnaryFunction,
} from 'rxjs';
import { filter, map, publish, take } from 'rxjs/operators';
import { ObjectHelper } from './object.helper';

export class ObservableHelper {
  public static readonly filterNullish = <T>(): UnaryFunction<
    Observable<Nullable<T> | undefined>,
    Observable<T>
  > => {
    return pipe(
      filter((x) => !ObjectHelper.isNullOrUndefined(x)) as OperatorFunction<
        Nullable<T> | undefined,
        T
      >
    );
  };

  public static readonly waitNullish = <T1, T2>(
    ob$: Observable<Nullable<T2> | undefined>
  ): OperatorFunction<T1, [T1, T2]> => {
    return (source$) => {
      return combineLatest([source$, ob$]).pipe(
        filter(
          ({ 1: ob }) => !ObjectHelper.isNullOrUndefined(ob)
        ) as OperatorFunction<[T1, Nullable<T2> | undefined], [T1, T2]>,
        take(1)
      );
    };
  };

  public static readonly delayUntil = <T>(
    notifier$: Observable<unknown>
  ): OperatorFunction<T, T> => {
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
  };

  public static readonly permission = <T>(
    permissions$: Observable<number[] | undefined>,
    p: number
  ): OperatorFunction<T, T> => {
    return (source$) =>
      combineLatest([source$, permissions$]).pipe(
        filter(
          ({ 1: permissions }) => !!permissions && permissions.includes(p)
        ),
        map(([x]) => x)
      );
  };
}
