import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelDataDisplayComponent } from './excel-data-display.component';

describe('ExcelDataDisplayComponent', () => {
  let component: ExcelDataDisplayComponent;
  let fixture: ComponentFixture<ExcelDataDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcelDataDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelDataDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
