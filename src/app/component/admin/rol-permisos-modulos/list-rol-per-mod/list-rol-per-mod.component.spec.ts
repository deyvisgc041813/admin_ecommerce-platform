import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRolPerModComponent } from './list-rol-per-mod.component';

describe('ListRolPerModComponent', () => {
  let component: ListRolPerModComponent;
  let fixture: ComponentFixture<ListRolPerModComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRolPerModComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRolPerModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
