import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorUsersComponent } from './error-users.component';

describe('ErrorUsersComponent', () => {
  let component: ErrorUsersComponent;
  let fixture: ComponentFixture<ErrorUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
