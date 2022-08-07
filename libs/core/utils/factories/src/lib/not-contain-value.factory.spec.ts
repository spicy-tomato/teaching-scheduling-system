import { notContainValueFactory } from './not-contain-value.factory';

describe('notContainValueFactory', () => {
  it('returns correctly', () => {
    expect(notContainValueFactory('')).toContain('Giá trị');

    const context = 'The way to get started is to quit talking and begin doing';
    expect(notContainValueFactory(context)).toContain(context);
  });
});
