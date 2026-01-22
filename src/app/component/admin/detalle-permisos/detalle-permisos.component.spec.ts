import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePermisosComponent } from './detalle-permisos.component';

describe('DetallePermisosComponent', () => {
  let component: DetallePermisosComponent;
  let fixture: ComponentFixture<DetallePermisosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePermisosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePermisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
