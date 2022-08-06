import { Component, DebugElement, DebugNode } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { VarDirective } from './var.directive';

@Component({
  template: `
    <div>Without Directive</div>
    <div *tssVar="1 as var">Default</div>
  `,
})
class TestComponent {}

describe('VarDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let elementsWithDirective: DebugNode[];
  let bareElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VarDirective, TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    elementsWithDirective = fixture.debugElement.queryAllNodes(
      By.directive(VarDirective)
    );
    bareElement = fixture.debugElement.query(By.css(':not([tssVar])'));
  });

  it('should have bare element', () => {
    expect(bareElement).toBeTruthy();
  });

  it('should have 1 element(s) with directive', () => {
    expect(elementsWithDirective.length).toBe(1);
  });
});
