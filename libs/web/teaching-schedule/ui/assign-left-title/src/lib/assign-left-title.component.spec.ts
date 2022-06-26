import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignLeftTitleComponent } from './assign-left-title.component';

describe('AssignLeftTitleComponent', () => {
  let component: AssignLeftTitleComponent;
  let fixture: ComponentFixture<AssignLeftTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignLeftTitleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignLeftTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
