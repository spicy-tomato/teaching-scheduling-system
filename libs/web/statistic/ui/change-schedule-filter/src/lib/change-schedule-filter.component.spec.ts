import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeScheduleFilterComponent } from './change-schedule-filter.component';

describe('ChangeScheduleFilterComponent', () => {
  let component: ChangeScheduleFilterComponent;
  let fixture: ComponentFixture<ChangeScheduleFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeScheduleFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeScheduleFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
