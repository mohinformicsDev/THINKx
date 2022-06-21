import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeatureTypeFormComponent } from './add-feature-type-form.component';

describe('AddFeatureTypeFormComponent', () => {
  let component: AddFeatureTypeFormComponent;
  let fixture: ComponentFixture<AddFeatureTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFeatureTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeatureTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
