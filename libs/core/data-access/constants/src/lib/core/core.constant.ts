export class CoreConstant {
  static readonly REASON_CHANGE_SCHEDULE_MAX_LENGTH = 500;
  static readonly INTEND_TIME_CHANGE_SCHEDULE_MAX_LENGTH = 100;
  static readonly NOTE_MAX_LENGTH = 1000;
  static readonly TERMS_IN_YEAR = [1, 2];
  static readonly BATCHES_IN_TERM: { [key: number]: number[] } = {
    1: [1, 2, 3],
    2: [1, 2, 3, 5],
  };
  static readonly CLASS_TYPE: { [key: number]: string } = {
    1: 'Lý thuyết',
    2: 'Bài tập',
    3: 'Thực hành',
  };
  static readonly SHIFTS: {
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
