import { TestBed } from '@angular/core/testing';
import { TUI_FOCUSABLE_ITEM_ACCESSOR } from '@taiga-ui/cdk';
import { FilterByInputPipe } from './filter-by-input.pipe';

describe('FilterByInputPipe', () => {
  let pipe: FilterByInputPipe;
  let accessor: {
    nativeFocusableElement: { value: string };
  };

  beforeEach(() => {
    accessor = { nativeFocusableElement: { value: '' } };
    TestBed.configureTestingModule({
      providers: [
        FilterByInputPipe,
        {
          provide: TUI_FOCUSABLE_ITEM_ACCESSOR,
          useValue: accessor,
        },
      ],
    });

    pipe = TestBed.inject(FilterByInputPipe);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return null if `items` is null', () => {
    const arr = null;
    expect(pipe.transform(arr)).toEqual(null);
    accessor.nativeFocusableElement.value = '123';
    expect(pipe.transform(arr)).toEqual(null);
  });

  it('should return empty if `items` is empty', () => {
    const arr: string[] = [];
    expect(pipe.transform(arr)).toEqual([]);
    accessor.nativeFocusableElement.value = '123';
    expect(pipe.transform(arr)).toEqual([]);
  });

  it('should filter correctly', () => {
    const arr: string[] = ['a', 'ab', 'abc', 'bc', 'ac', 'aab'];
    expect(pipe.transform(arr)).toEqual(arr);

    accessor.nativeFocusableElement.value = 'a';
    expect(pipe.transform(arr)).toEqual(['a', 'ab', 'abc', 'ac', 'aab']);

    accessor.nativeFocusableElement.value = 'b';
    expect(pipe.transform(arr)).toEqual(['ab', 'abc', 'bc', 'aab']);

    accessor.nativeFocusableElement.value = 'ab';
    expect(pipe.transform(arr)).toEqual(['ab', 'abc', 'aab']);

    accessor.nativeFocusableElement.value = 'aaa';
    expect(pipe.transform(arr)).toEqual([]);
  });
});
