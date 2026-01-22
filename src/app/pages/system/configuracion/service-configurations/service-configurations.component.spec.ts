import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceConfigurationsComponent } from './service-configurations.component';

describe('ServiceConfigurationsComponent', () => {
  let component: ServiceConfigurationsComponent;
  let fixture: ComponentFixture<ServiceConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceConfigurationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
