import { TestBed } from '@angular/core/testing';
import { ArrayPipe } from './array.pipe';

describe('ArrayPipe', () => {
  let pipe: ArrayPipe<number>;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ArrayPipe] });
    pipe = TestBed.inject(ArrayPipe);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('`includes` works', () => {
    const array = [0, 1, 2, 3, 4, 5];
    expect(pipe.transform(array, 'includes', 0)).toEqual(true);
    expect(pipe.transform(array, 'includes', 6)).toEqual(false);
  });
});
