import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategriesComponent } from './subcategries.component';

describe('SubcategriesComponent', () => {
  let component: SubcategriesComponent;
  let fixture: ComponentFixture<SubcategriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubcategriesComponent]
    });
    fixture = TestBed.createComponent(SubcategriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
