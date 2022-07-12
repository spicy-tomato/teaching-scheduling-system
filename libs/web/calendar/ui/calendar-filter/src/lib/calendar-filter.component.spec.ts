import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarFilterComponent } from './calendar-filter.component';

describe('CalendarFilterComponent', () => {
  let component: CalendarFilterComponent;
  let fixture: ComponentFixture<CalendarFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
