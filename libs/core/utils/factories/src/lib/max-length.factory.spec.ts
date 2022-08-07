import { maxLengthFactory } from './max-length.factory';

describe('maxLengthFactory', () => {
  it('returns correctly', () => {
    for (let i = 0; i < 5; i++) {
      const context = {
        requiredLength: Math.floor(Math.random() * 1000).toString(),
      };
      expect(maxLengthFactory(context)).toContain(context.requiredLength);
    }
  });
});
