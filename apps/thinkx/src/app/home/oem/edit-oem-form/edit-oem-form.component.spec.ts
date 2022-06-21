import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOemFormComponent } from './edit-oem-form.component';

describe('EditOemFormComponent', () => {
  let component: EditOemFormComponent;
  let fixture: ComponentFixture<EditOemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOemFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
