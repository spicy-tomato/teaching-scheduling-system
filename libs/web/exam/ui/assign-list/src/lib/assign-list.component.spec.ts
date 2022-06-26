import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignListComponent } from './assign-list.component';

describe('AssignListComponent', () => {
  let component: AssignListComponent;
  let fixture: ComponentFixture<AssignListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
