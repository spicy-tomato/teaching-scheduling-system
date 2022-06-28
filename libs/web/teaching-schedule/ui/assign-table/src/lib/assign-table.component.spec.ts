import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTableComponent } from './assign-table.component';

describe('AssignTableComponent', () => {
  let component: AssignTableComponent;
  let fixture: ComponentFixture<AssignTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
