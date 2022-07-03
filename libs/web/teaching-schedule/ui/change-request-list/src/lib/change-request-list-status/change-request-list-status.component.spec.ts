import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestListStatusComponent } from './change-request-list-status.component';

describe('ChangeRequestListStatusComponent', () => {
  let component: ChangeRequestListStatusComponent;
  let fixture: ComponentFixture<ChangeRequestListStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeRequestListStatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestListStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
