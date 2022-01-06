import {
  combineLatest,
  Observable,
  OperatorFunction,
  pipe,
  UnaryFunction,
} from 'rxjs';
import { filter, map } from 'rxjs/operators';

export class ObservableHelper {
  public static readonly filterNullish = <T>(): UnaryFunction<
    Observable<T | null | undefined>,
    Observable<T>
  > => {
    return pipe(
      filter((x) => x !== null) as OperatorFunction<T | null | undefined, T>
    );
  };

  public static readonly permission = <T>(
    permissions$: Observable<number[] | undefined>,
    p: number
  ): ((source$: Observable<T>) => Observable<T>) => {
    return (source$) =>
      combineLatest([source$, permissions$]).pipe(
        filter(
          ({ 1: permissions }) => !!permissions && permissions.includes(p)
        ),
        map(([x]) => x)
      );
  };
}
