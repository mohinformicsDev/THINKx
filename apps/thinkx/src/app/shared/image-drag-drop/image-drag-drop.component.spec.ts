import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDragDropComponent } from './image-drag-drop.component';

describe('ImageDragDropComponent', () => {
  let component: ImageDragDropComponent;
  let fixture: ComponentFixture<ImageDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageDragDropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
