import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignRightTitleComponent } from './assign-right-title.component';

describe('AssignRightTitleComponent', () => {
  let component: AssignRightTitleComponent;
  let fixture: ComponentFixture<AssignRightTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignRightTitleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignRightTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
