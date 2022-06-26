import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestFilterComponent } from './change-request-filter.component';

describe('ChangeRequestFilterComponent', () => {
  let component: ChangeRequestFilterComponent;
  let fixture: ComponentFixture<ChangeRequestFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeRequestFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
