import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSensorFeatureFormComponent } from './edit-sensor-feature-form.component';

describe('EditSensorFeatureFormComponent', () => {
  let component: EditSensorFeatureFormComponent;
  let fixture: ComponentFixture<EditSensorFeatureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSensorFeatureFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSensorFeatureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
