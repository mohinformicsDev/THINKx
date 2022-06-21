import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSensorFeatureFormComponent } from './add-sensor-feature-form.component';

describe('AddSensorFeatureFormComponent', () => {
  let component: AddSensorFeatureFormComponent;
  let fixture: ComponentFixture<AddSensorFeatureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSensorFeatureFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSensorFeatureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
