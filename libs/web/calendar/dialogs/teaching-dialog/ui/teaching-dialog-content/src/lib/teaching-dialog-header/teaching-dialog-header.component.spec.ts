import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingDialogHeaderComponent } from './teaching-dialog-header.component';

describe('TeachingDialogHeaderComponent', () => {
  let component: TeachingDialogHeaderComponent;
  let fixture: ComponentFixture<TeachingDialogHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeachingDialogHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingDialogHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
