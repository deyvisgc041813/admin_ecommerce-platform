import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySedesComponent } from './company-sedes.component';

describe('CompanySedesComponent', () => {
  let component: CompanySedesComponent;
  let fixture: ComponentFixture<CompanySedesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanySedesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySedesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
