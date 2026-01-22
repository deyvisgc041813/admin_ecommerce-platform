import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegacionPrincipalComponent } from './navegacion-principal.component';

describe('NavegacionPrincipalComponent', () => {
  let component: NavegacionPrincipalComponent;
  let fixture: ComponentFixture<NavegacionPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavegacionPrincipalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavegacionPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
