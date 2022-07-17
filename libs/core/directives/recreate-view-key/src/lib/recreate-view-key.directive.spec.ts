import { Component, DebugElement, DebugNode } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RecreateViewKeyDirective } from './recreate-view-key.directive';

@Component({
  template: `
    <div>Without Directive</div>
    <div *tssRecreateViewKey="null">Default</div>
  `,
})
class TestComponent {}

describe('RecreateViewKeyDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let elementsWithDirective: DebugNode[];
  let bareElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecreateViewKeyDirective, TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    elementsWithDirective = fixture.debugElement.queryAllNodes(
      By.directive(RecreateViewKeyDirective)
    );
    bareElement = fixture.debugElement.query(
      By.css(':not([tssRecreateViewKey])')
    );
  });

  it('should have bare element', () => {
    expect(bareElement).toBeTruthy();
  });

  it('should have 1 element(s) with directive', () => {
    expect(elementsWithDirective.length).toBe(1);
  });
});
