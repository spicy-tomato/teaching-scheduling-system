import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestListActionComponent } from './change-request-list-action.component';

describe('ChangeRequestListActionComponent', () => {
  let component: ChangeRequestListActionComponent;
  let fixture: ComponentFixture<ChangeRequestListActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeRequestListActionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestListActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
