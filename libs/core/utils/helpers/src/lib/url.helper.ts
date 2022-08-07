import { ArrayHelper } from './array.helper';

type Operator = 'equal' | 'in' | 'between' | 'sort';

type QueryFilterQueryFilterPartResult<
  T extends Record<string, unknown>,
  Q extends string
> = {
  [K in keyof Pick<T, Q> as `${K}[${Record<
    keyof Pick<T, Q>,
    Operator
  >[K]}]`]?: string;
};

type QueryFilterConstantPartResult<
  T extends Record<string, unknown>,
  Q extends string
> = Omit<T, keyof Pick<T, Q>>;

type QueryFilterOptionPartResult<P extends string | undefined> = {
  [K in P as `${K}[${Operator}]`]?: string;
};

export type QueryFilterResult<
  T extends Record<string, unknown>,
  Q extends string = string,
  P extends string | undefined = undefined
> = P extends undefined
  ? QueryFilterQueryFilterPartResult<T, Q> & QueryFilterConstantPartResult<T, Q>
  : QueryFilterQueryFilterPartResult<T, Q> &
      QueryFilterConstantPartResult<T, Q> &
      QueryFilterOptionPartResult<P>;

export class UrlHelper {
  static queryFilter<
    T extends Record<string, unknown>,
    Q extends string,
    P extends string
  >(
    obj: T,
    operators: Partial<Record<keyof T, Operator>>,
    options?: {
      include?: Record<string, Partial<Record<Operator, string>>>;
      exclude?: [keyof T];
    }
  ): QueryFilterResult<T, P, Q> {
    const queryFilterPart: QueryFilterQueryFilterPartResult<T, Q> = <
      QueryFilterQueryFilterPartResult<T, Q>
    >{};

    const constantPart: QueryFilterOptionPartResult<P> = <
      QueryFilterOptionPartResult<P>
    >{};

    const optionPart: QueryFilterConstantPartResult<T, Q> = <
      QueryFilterConstantPartResult<T, Q>
    >{};

    Object.entries(obj).forEach(([key, value]) => {
      if (!value || (value as []).length === 0) return;

      const operator = operators[key] as Operator;
      if (operator) {
        const newKey = `${key}[${operator}]`;
        if (ArrayHelper.isArray(value)) {
          (queryFilterPart as any)[newKey] = (value as []).join(',');
        } else {
          (queryFilterPart as any)[newKey] = value;
        }
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (!options || !options.exclude || !options.exclude.includes(key)) {
        (constantPart as any)[key] = value;
      }
    });

    if (options?.include) {
      Object.entries(options.include).forEach(([key, op]) => {
        Object.entries(op).forEach(([operator, value]) => {
          (optionPart as any)[`${key}[${operator}]`] = value;
        });
      });
    }

    const result: QueryFilterResult<T, P, Q> = {
      ...queryFilterPart,
      ...constantPart,
      ...optionPart,
    } as unknown as QueryFilterResult<T, P, Q>;

    return result;
  }
}
