import { TestBed } from '@angular/core/testing';
import { StringHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { ShortenNamePipe } from './shorten-name.pipe';

describe('ShortenNamePipe', () => {
  let pipe: ShortenNamePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ShortenNamePipe] });
    pipe = TestBed.inject(ShortenNamePipe);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('shorten correctly', () => {
    const values = ['Elon Musk', 'Donald Trump', 'Nguyễn Trần Tân An'];
    values.forEach((value) => {
      expect(pipe.transform(value)).toEqual(StringHelper.shortenName(value));
    });
  });
});
