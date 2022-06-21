import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductFeatureFormComponent } from './add-product-feature-form.component';

describe('AddProductFeatureFormComponent', () => {
  let component: AddProductFeatureFormComponent;
  let fixture: ComponentFixture<AddProductFeatureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductFeatureFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductFeatureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
