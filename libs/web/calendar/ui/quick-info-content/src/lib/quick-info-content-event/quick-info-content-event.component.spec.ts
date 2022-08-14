import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickInfoContentEventComponent } from './quick-info-content-event.component';

describe('QuickInfoContentEventComponent', () => {
  let component: QuickInfoContentEventComponent;
  let fixture: ComponentFixture<QuickInfoContentEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickInfoContentEventComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickInfoContentEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
