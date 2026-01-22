import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVentasComponent } from './view-ventas.component';

describe('ViewVentasComponent', () => {
  let component: ViewVentasComponent;
  let fixture: ComponentFixture<ViewVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
