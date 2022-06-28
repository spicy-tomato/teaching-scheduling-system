import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEditDialogComponent } from './assign-edit-dialog.component';

describe('AssignEditDialogComponent', () => {
  let component: AssignEditDialogComponent;
  let fixture: ComponentFixture<AssignEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignEditDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
