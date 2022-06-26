export class CoreConstant {
  public static readonly REASON_CHANGE_SCHEDULE_MAX_LENGTH = 500;
  public static readonly INTEND_TIME_CHANGE_SCHEDULE_MAX_LENGTH = 100;
  public static readonly NOTE_MAX_LENGTH = 1000;
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
  public static readonly SHIFTS: {
    [key: string]: { start: number[]; end: number[] };
  } = {
    '1': {
      start: [7, 0],
      end: [9, 25],
    },
    '2': {
      start: [9, 35],
      end: [12, 0],
    },
    '3': {
      start: [13, 0],
      end: [15, 25],
    },
    '4': {
      start: [15, 35],
      end: [18, 0],
    },
    '5_1': {
      start: [18, 5],
      end: [20, 30],
    },
    '5_2': {
      start: [18, 5],
      end: [21, 20],
    },
  };
}
