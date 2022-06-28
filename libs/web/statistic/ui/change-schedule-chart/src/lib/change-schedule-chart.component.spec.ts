import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeScheduleChartComponent } from './change-schedule-chart.component';

describe('ChangeScheduleChartComponent', () => {
  let component: ChangeScheduleChartComponent;
  let fixture: ComponentFixture<ChangeScheduleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeScheduleChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeScheduleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
