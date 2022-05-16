import { Inject, Pipe, PipeTransform } from '@angular/core';
import {
  TuiFocusableElementAccessor,
  TuiStringMatcher,
  TUI_DEFAULT_MATCHER,
  TUI_DEFAULT_STRINGIFY,
  TUI_FOCUSABLE_ITEM_ACCESSOR,
} from '@taiga-ui/cdk';

@Pipe({
  name: 'filterByInput',
  pure: false,
})
export class FilterByInputPipe implements PipeTransform {
  /** CONSTRUCTOR */
  constructor(
    @Inject(TUI_FOCUSABLE_ITEM_ACCESSOR)
    private readonly accessor: TuiFocusableElementAccessor
  ) {}

  /** GETTERS */
  private get query(): string {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.accessor.nativeFocusableElement
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        (this.accessor.nativeFocusableElement as any).value || ''
      : '';
  }

  public transform<T>(
    items: readonly T[] | null,
    matcher: TuiStringMatcher<T> = TUI_DEFAULT_MATCHER
  ): readonly T[] | null {
    console.log(this.query);
    return this.filter(items, matcher);
  }

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
