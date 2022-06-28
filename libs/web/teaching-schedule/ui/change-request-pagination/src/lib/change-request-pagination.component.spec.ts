import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestPaginationComponent } from './change-request-pagination.component';

describe('ChangeRequestPaginationComponent', () => {
  let component: ChangeRequestPaginationComponent;
  let fixture: ComponentFixture<ChangeRequestPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeRequestPaginationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
