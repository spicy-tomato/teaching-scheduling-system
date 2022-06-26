import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignResultComponent } from './assign-result.component';

describe('AssignResultComponent', () => {
  let component: AssignResultComponent;
  let fixture: ComponentFixture<AssignResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignResultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
