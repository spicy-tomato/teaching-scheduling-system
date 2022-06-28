import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateCheckerComponent } from './duplicate-checker.component';

describe('DuplicateCheckerComponent', () => {
  let component: DuplicateCheckerComponent;
  let fixture: ComponentFixture<DuplicateCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DuplicateCheckerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
