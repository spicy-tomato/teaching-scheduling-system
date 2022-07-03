import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignFilterComponent } from './assign-filter.component';

describe('AssignFilterComponent', () => {
  let component: AssignFilterComponent;
  let fixture: ComponentFixture<AssignFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
