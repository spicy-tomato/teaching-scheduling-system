import { requiredFactory } from './required.factory';

describe('requiredFactory', () => {
  it('returns correctly', () => {
    expect(requiredFactory()).toEqual('Đây là trường bắt buộc!');
  });
});
