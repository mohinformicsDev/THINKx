import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleImageDragDropComponent } from './multiple-image-drag-drop.component';

describe('MultipleImageDragDropComponent', () => {
  let component: MultipleImageDragDropComponent;
  let fixture: ComponentFixture<MultipleImageDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipleImageDragDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleImageDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
