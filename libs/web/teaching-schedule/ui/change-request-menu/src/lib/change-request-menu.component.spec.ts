import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestMenuComponent } from './change-request-menu.component';

describe('ChangeRequestMenuComponent', () => {
  let component: ChangeRequestMenuComponent;
  let fixture: ComponentFixture<ChangeRequestMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeRequestMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRequestMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
