import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSensorFormComponent } from './add-sensor-form.component';

describe('AddSensorFormComponent', () => {
  let component: AddSensorFormComponent;
  let fixture: ComponentFixture<AddSensorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSensorFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSensorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
