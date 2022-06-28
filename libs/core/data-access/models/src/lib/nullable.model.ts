export type Nullable<T> = T | null;

export type NoUndefinedField<T> = {
  [P in keyof T]-?: Exclude<T[P], null | undefined>;
};
