import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePermisoComponent } from './detalle-permiso.component';

describe('DetallePermisoComponent', () => {
  let component: DetallePermisoComponent;
  let fixture: ComponentFixture<DetallePermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePermisoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
