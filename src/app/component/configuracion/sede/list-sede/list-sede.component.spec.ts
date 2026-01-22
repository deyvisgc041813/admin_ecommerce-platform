import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSedeComponent } from './list-sede.component';

describe('ListSedeComponent', () => {
  let component: ListSedeComponent;
  let fixture: ComponentFixture<ListSedeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSedeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
