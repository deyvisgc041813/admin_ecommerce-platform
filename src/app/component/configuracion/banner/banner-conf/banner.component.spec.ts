import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerConfComponent } from './banner.component';

describe('BannerConfComponent', () => {
  let component: BannerConfComponent;
  let fixture: ComponentFixture<BannerConfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannerConfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerConfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
