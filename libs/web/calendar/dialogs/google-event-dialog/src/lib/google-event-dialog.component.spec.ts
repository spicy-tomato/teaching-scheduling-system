import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleEventDialogComponent } from './google-event-dialog.component';

describe('GoogleEventDialogComponent', () => {
  let component: GoogleEventDialogComponent;
  let fixture: ComponentFixture<GoogleEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoogleEventDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
