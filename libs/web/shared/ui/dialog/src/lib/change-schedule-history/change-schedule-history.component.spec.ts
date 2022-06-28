import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeScheduleHistoryComponent } from './change-schedule-history.component';

describe('ChangeScheduleHistoryComponent', () => {
  let component: ChangeScheduleHistoryComponent;
  let fixture: ComponentFixture<ChangeScheduleHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeScheduleHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeScheduleHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
