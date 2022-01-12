import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[tssVar]',
})
export class VarDirective {
  /** INPUT */
  @Input() public set tssVar(context: unknown) {
    this.context.$implicit = this.context.tssVar = context;

    if (!this.hasView) {
      this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
      this.hasView = true;
    }
  }

  /** PRIVATE PROPERTIES */
  private context: {
    $implicit: unknown;
    tssVar: unknown;
  } = {
    $implicit: null,
    tssVar: null,
  };

  private hasView = false;

  /** CONSTRUCTOR */
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef
  ) {}
}
