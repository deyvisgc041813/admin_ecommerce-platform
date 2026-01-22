import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductComponent } from './list.component';

describe('ListProductComponent', () => {
  let component: ListProductComponent;
  let fixture: ComponentFixture<ListProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListProductComponent]
    });
    fixture = TestBed.createComponent(ListProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
