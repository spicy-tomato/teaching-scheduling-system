import { beforeTodayFactory } from './before-today.factory';

describe('beforeTodayFactory', () => {
  it('returns correctly', () => {
    expect(beforeTodayFactory()).toEqual('Không thế chọn ngày đã qua!');
  });
});
