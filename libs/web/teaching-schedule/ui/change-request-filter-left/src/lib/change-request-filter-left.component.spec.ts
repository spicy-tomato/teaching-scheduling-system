import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestFilterLeftComponent } from './change-request-filter-left.component';

describe('ChangeRequestFilterLeftComponent', () => {
  let component: ChangeRequestFilterLeftComponent;
  let fixture: ComponentFixture<ChangeRequestFilterLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeRequestFilterLeftComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestFilterLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
