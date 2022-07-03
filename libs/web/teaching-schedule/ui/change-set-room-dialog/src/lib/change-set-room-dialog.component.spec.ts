import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSetRoomDialogComponent } from './change-set-room-dialog.component';

describe('ChangeSetRoomDialogComponent', () => {
  let component: ChangeSetRoomDialogComponent;
  let fixture: ComponentFixture<ChangeSetRoomDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeSetRoomDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSetRoomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
