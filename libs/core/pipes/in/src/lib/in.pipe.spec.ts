import { InPipe } from './in.pipe';

describe('InPipe', () => {
  it('create an instance', () => {
    const pipe = new InPipe();
    expect(pipe).toBeTruthy();
  });
});
