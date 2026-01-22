import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleAndModulesComponent } from './role-and-modules.component';

describe('RoleAndModulesComponent', () => {
  let component: RoleAndModulesComponent;
  let fixture: ComponentFixture<RoleAndModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleAndModulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleAndModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
