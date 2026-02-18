import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentMenuAssignComponent } from './parent-menu-assign.component';

describe('ParentMenuAssignComponent', () => {
  let component: ParentMenuAssignComponent;
  let fixture: ComponentFixture<ParentMenuAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentMenuAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentMenuAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
