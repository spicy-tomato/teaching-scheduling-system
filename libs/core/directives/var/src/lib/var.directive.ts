import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

type VarContext = {
  $implicit: unknown;
  tssVar: unknown;
};

@Directive({
  selector: '[tssVar]',
})
export class VarDirective {
  // INPUT
  @Input() set tssVar(context: unknown) {
    this.context.$implicit = this.context.tssVar = context;

    if (!this.hasView) {
      this.viewContainerRef.createEmbeddedView(this.templateRef, this.context);
      this.hasView = true;
    }
  }

  // PRIVATE PROPERTIES
  private context: VarContext = {
    $implicit: null,
    tssVar: null,
  };

  private hasView = false;

  // CONSTRUCTOR
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainerRef: ViewContainerRef
  ) {}
}
