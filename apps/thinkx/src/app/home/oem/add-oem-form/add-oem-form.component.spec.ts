import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOemFormComponent } from './add-oem-form.component';

describe('AddOemFormComponent', () => {
  let component: AddOemFormComponent;
  let fixture: ComponentFixture<AddOemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOemFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
