import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolPermisoModuloComponent } from './rol-permiso-modulo.component';

describe('RolPermisoModuloComponent', () => {
  let component: RolPermisoModuloComponent;
  let fixture: ComponentFixture<RolPermisoModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolPermisoModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolPermisoModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
