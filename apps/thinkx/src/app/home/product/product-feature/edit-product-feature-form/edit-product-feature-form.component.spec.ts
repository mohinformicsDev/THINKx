import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductFeatureFormComponent } from './edit-product-feature-form.component';

describe('EditProductFeatureFormComponent', () => {
  let component: EditProductFeatureFormComponent;
  let fixture: ComponentFixture<EditProductFeatureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProductFeatureFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductFeatureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
