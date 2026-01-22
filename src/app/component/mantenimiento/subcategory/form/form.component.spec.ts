import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubCategoryComponent } from './form.component';

describe('FormSubCategoryComponent', () => {
  let component: FormSubCategoryComponent;
  let fixture: ComponentFixture<FormSubCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormSubCategoryComponent]
    });
    fixture = TestBed.createComponent(FormSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
