import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestListComponent } from './change-request-list.component';

describe('ChangeRequestListComponent', () => {
  let component: ChangeRequestListComponent;
  let fixture: ComponentFixture<ChangeRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeRequestListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
