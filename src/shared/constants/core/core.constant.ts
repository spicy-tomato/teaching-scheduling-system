export class CoreConstant {
  public static readonly TERMS_IN_YEAR = [1, 2];
  public static readonly BATCHES_IN_TERM: { [key: number]: number[] } = {
    1: [1, 2, 3],
    2: [1, 2, 3, 5],
  };
  public static readonly CLASS_TYPE: { [key: number]: string } = {
    1: 'Lý thuyết',
    2: 'Bài tập',
    3: 'Thực hành',
  };
}
