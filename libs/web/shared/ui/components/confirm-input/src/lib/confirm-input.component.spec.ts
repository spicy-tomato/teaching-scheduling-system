import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmInputComponent } from './confirm-input.component';

describe('ConfirmInputComponent', () => {
  let component: ConfirmInputComponent;
  let fixture: ComponentFixture<ConfirmInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
