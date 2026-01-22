import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRolPerModComponent } from './form-rol-per-mod.component';

describe('FormRolPerModComponent', () => {
  let component: FormRolPerModComponent;
  let fixture: ComponentFixture<FormRolPerModComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormRolPerModComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRolPerModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
