import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsubCategoryComponent } from './list.component';

describe('ListSubCategoryComponent', () => {
  let component: ListsubCategoryComponent;
  let fixture: ComponentFixture<ListsubCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListsubCategoryComponent]
    });
    fixture = TestBed.createComponent(ListsubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
