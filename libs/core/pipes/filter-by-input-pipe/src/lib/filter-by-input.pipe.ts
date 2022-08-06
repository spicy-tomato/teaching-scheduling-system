import { Inject, Pipe, PipeTransform } from '@angular/core';
import {
  TUI_FOCUSABLE_ITEM_ACCESSOR,
  TuiFocusableElementAccessor,
  TuiStringMatcher,
  TUI_DEFAULT_MATCHER,
  TUI_DEFAULT_STRINGIFY,
} from '@taiga-ui/cdk';

@Pipe({
  name: 'filterByInput',
  pure: false,
})
export class FilterByInputPipe implements PipeTransform {
  // CONSTRUCTOR 
  constructor(
    @Inject(TUI_FOCUSABLE_ITEM_ACCESSOR)
    private readonly accessor: TuiFocusableElementAccessor
  ) {}

  // GETTERS 
  private get query(): string {
    return this.accessor.nativeFocusableElement
      ? (this.accessor.nativeFocusableElement as HTMLInputElement).value || ''
      : '';
  }

  // IMPLEMENTATION 
  transform<T>(
    items: readonly T[] | null,
    matcher: TuiStringMatcher<T> = TUI_DEFAULT_MATCHER
  ): readonly T[] | null {
    return this.filter(items, matcher);
  }

  // PRIVATE METHODS 
  private filter<T>(
    items: readonly T[] | null,
    matcher: TuiStringMatcher<T>
  ): readonly T[] | null {
    if (!items) {
      return null;
    }

    const query = this.query;
    return items.filter((item) => matcher(item, query, TUI_DEFAULT_STRINGIFY));
  }
}
