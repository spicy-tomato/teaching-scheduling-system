import { Component, DebugElement, DebugNode } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TouchScreenDirective } from './touch-screen.directive';

@Component({
  template: `
    <div>Without Directive</div>
    <div *tssTouchScreen="null">Default</div>
  `,
})
class TestComponent {}

describe('TouchScreenDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let elementsWithDirective: DebugNode[];
  let bareElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [TouchScreenDirective, TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    elementsWithDirective = fixture.debugElement.queryAllNodes(
      By.directive(TouchScreenDirective)
    );
    bareElement = fixture.debugElement.query(By.css(':not([tssTouchScreen])'));
  });

  it('should have bare element', () => {
    expect(bareElement).toBeTruthy();
  });

  it('should have 1 element(s) with directive', () => {
    expect(elementsWithDirective.length).toBe(1);
  });
});
