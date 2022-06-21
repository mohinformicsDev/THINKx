import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CategoryModel } from '../../../model/category.model';
import { ProductModel } from '../../../model/product.model';
import { SensorModel } from '../../../model/sensor.model';
import {
  addOemTableModelArray,
  addOemTableModelIndividual,
} from '../../../shared/custome-type/model-type-addoemtable.type';
import { LoadingOption } from '../../../shared/loading-options.enum';
import { UploadOptions } from '../../../shared/upload-option.enum';
import { ShowImageDialogComponent } from '../../../shared/show-image-dialog/show-image-dialog.component';
import { AddOemTableType } from '../add-oem-table-type.enum';
import { CommonService } from '../../../shared/service/common.service';

@Component({
  selector: 'thinkx-add-oem-mat-table',
  templateUrl: './add-oem-mat-table.component.html',
  styleUrls: ['./add-oem-mat-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AddOemMatTableComponent
  implements AfterViewInit, OnInit, OnChanges {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<addOemTableModelIndividual>;

  @Input() @Output() data: addOemTableModelArray = [];

  @Input() columns: string[] = [];

  @Input() type: AddOemTableType = AddOemTableType.EMPTY;
  @Input() isEdit = false;
  @Input() selectedRow: {
    data: addOemTableModelArray;
    type: AddOemTableType;
  } = {
    data: [],
    type: AddOemTableType.EMPTY,
  };

  @Output() selectedRowChange: EventEmitter<{
    data: addOemTableModelArray;
    type: AddOemTableType;
  }>;

  dataSource:
    | MatTableDataSource<ProductModel>
    | MatTableDataSource<SensorModel>
    | MatTableDataSource<CategoryModel> = new MatTableDataSource<ProductModel>(
    []
  );

  isLoading = false;
  isLoadingType: LoadingOption = LoadingOption.NEW;

  expandedElement: addOemTableModelIndividual | null = null;

  isDisable = true;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['select', 'id', 'name', 'image', 'expand'];
  selection = new SelectionModel<addOemTableModelIndividual>(true, []);

  imageDragDropGroup: FormGroup = this._fb.group({
    whichFileOption: this._fb.control(''),
    image: this._fb.control(''),
    imageUrl: this._fb.control(''),
  });

  addOemForm: FormGroup = this._fb.group({});

  constructor(private _commonService: CommonService, private _fb: FormBuilder) {
    this.selectedRowChange = new EventEmitter();
  }

  get tableType() {
    return AddOemTableType;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.type === AddOemTableType.PRODUCT) {
      this.data = changes.data.currentValue as ProductModel[];

      this.updateTableDataSource(this.data);
      if (this.selection.selected.length >= 0) {
        this.selection.clear();
      }
      if (this.selectedRow.data.length >= 0) {
        if (this.selectedRow.type === AddOemTableType.PRODUCT) {
          const datas = this.selectedRow.data as ProductModel[];
          const productData = this.data as ProductModel[];
          datas.forEach((data: ProductModel, dataIndex: number) => {
            productData.forEach((productData: ProductModel) => {
              if (data._id === productData._id) {
                this.selection.select(this.data[dataIndex]);
              }
            });
          });
        }
      }
    }
    if (this.type === AddOemTableType.CATEGORY && changes.data) {
      this.data = changes.data.currentValue as CategoryModel[];
      this.updateTableDataSource(this.data);
    }
    if (this.type === AddOemTableType.SENSOR && changes.data) {
      this.data = changes.data.currentValue as SensorModel[];
      this.updateTableDataSource(this.data);
    }

    if (this.isEdit) {
      if (changes.selectedRow?.currentValue.data.length > 0) {
        if (this.selectedRow.type === AddOemTableType.CATEGORY) {
          const elements = this.selectedRow.data as CategoryModel[];
          const filteredData = (this.data as CategoryModel[]).filter(element => elements.findIndex(category => category._id === element._id) != -1);
          // elements.forEach((element: CategoryModel) => {
          if(filteredData.length > 0) this.selection.select(...filteredData);
          // });
          this.selectedRowChange.emit({
            data: elements,
            type: this.type,
          });
        }
        if (this.selectedRow.type === AddOemTableType.PRODUCT) {
          const elements = this.selectedRow.data as ProductModel[];
          elements.forEach((element: ProductModel) => {
            this.selection.select(element);
          });
          this.selectedRowChange.emit({
            data: elements,
            type: this.type,
          });
        }
        if (this.selectedRow.type === AddOemTableType.SENSOR) {
          const elements = this.selectedRow.data as SensorModel[];
          const filteredData = (this.data as SensorModel[]).filter(element => elements.findIndex(sensor => sensor._id === element._id) != -1);
          if(filteredData.length > 0) this.selection.select(...filteredData);
          // elements.forEach((element: SensorModel) => {
          //   this.selection.select(element);
          // });
          this.selectedRowChange.emit({
            data: filteredData,
            type: this.type,
          });
        }
      }
    }
  
  }

  ngOnInit() {
    this.dataSource.data = this.data;
    this.displayedColumns = this.columns;
    const columns: string[] = this.columns;

    columns.forEach((column) => {
      if (column !== 'expand' && column !== 'image') {
        if (column === 'select') {
          this.addOemForm.addControl(
            column,
            new FormControl({ value: '', disabled: false })
          );
        } else if (column === 'id') {
          this.addOemForm.addControl(
            '_id',
            new FormControl({ value: '', disabled: true })
          );
        } else if(column === 'category'){
          this.addOemForm.addControl(
            column,
            this._fb.group({
              "_id": new FormControl({value: '', disabled: true}),
              "name": new FormControl({value: '', disabled: true}),
              "imageUrl": new FormControl({value: '', disabled: true}),

            })
          );
        } else {
          this.addOemForm.addControl(
            column,
            new FormControl({ value: '', disabled: true })
          );
        }
      }
    });
    this.addOemForm.addControl('images', this.imageDragDropGroup);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
  }

  rowSelected(selectedRow: any) {
    if (this.selection.isSelected(selectedRow)) {
      this.expandedElement =
        this.expandedElement === selectedRow ? null : selectedRow;
    } else {
      this.expandedElement = null;
    }
  }

  updateValueFunction(
    event: MatSlideToggleChange,
    element: ProductModel | CategoryModel | SensorModel
  ) {
    this.isDisable = !event.checked;
    if (this.selection.isSelected(element)) {
      if (this.type === AddOemTableType.CATEGORY) {
        const data = element as CategoryModel;
        this.addOemForm.patchValue({
          _id: data._id,
          name: data.name,
        });
        this.imageDragDropGroup.patchValue({
          imageUrl: data.imageUrl,
        });
      }

      if (this.type === AddOemTableType.PRODUCT) {
        const data = element as ProductModel;
        this.addOemForm.patchValue({
          _id: data._id,
          name: data.name,
        });
        (this.addOemForm.controls['category'] as FormGroup).patchValue({
          _id: data.category._id,
          name: data.category.name,
          imageUrl: data.category.imageUrl
        })

        this.imageDragDropGroup.patchValue({
          imageUrl: data.imageUrls[0],
        });
      }

      if (this.type === AddOemTableType.SENSOR) {
        const data = element as SensorModel;
        this.addOemForm.patchValue({
          _id: data._id,
          name: data.name,
        });
        this.imageDragDropGroup.patchValue({
          imageUrl: data.imageUrl,
        });
      }

      // for disabling
      if (!event.checked) {
        // if (this.type === AddOemTableType.CATEGORY) {
        //   // this.addOemForm.get('_id')?.disable();
        //   // this.addOemForm.get('name')?.disable();
        // }
        if (this.type === AddOemTableType.PRODUCT) {
          // this.addOemForm.get('_id')?.disable();
          // this.addOemForm.get('name')?.disable();
          this.addOemForm.get('category')?.disable();
        }
        // if (this.type === AddOemTableType.SENSOR) {
        // }
        this.addOemForm.get('_id')?.disable();
        this.addOemForm.get('name')?.disable();
      }
      // for Enable
      else {
        // if (this.type === AddOemTableType.CATEGORY) {
        //   this.addOemForm.get('_id')?.enable();
        //   this.addOemForm.get('name')?.enable();
        // }
        if (this.type === AddOemTableType.PRODUCT) {
          // this.addOemForm.get('_id')?.enable();
          // this.addOemForm.get('name')?.enable();
          this.addOemForm.get('category')?.enable();
        }
        // if (this.type === AddOemTableType.SENSOR) {
        // }
        this.addOemForm.get('_id')?.enable();
        this.addOemForm.get('name')?.enable();
      }
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(
          (row: ProductModel | CategoryModel | SensorModel) =>
            this.selection.select(row)
        );
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ProductModel | CategoryModel | SensorModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'select' : 'deselect'} row ${
      row._id
    }`;
  }

  tableSelectChange(event: MatCheckboxChange) {
    if (!event.checked) {
      this.expandedElement = null;
    }

    let value: ProductModel[] | SensorModel[] | CategoryModel[] = [];
    if (this.type == AddOemTableType.PRODUCT)
      value = this.selection.selected as ProductModel[];
    if (this.type == AddOemTableType.CATEGORY)
      value = this.selection.selected as CategoryModel[];
    if (this.type == AddOemTableType.SENSOR)
      value = this.selection.selected as SensorModel[];
    this.selectedRow = {
      data: value,
      type: this.type,
    };
    this.selectedRowChange.emit({
      data: value,
      type: this.type,
    });
  }

  closeButtonExpanded() {
    this.expandedElement = null;
  }

  clickImage(event: Event, src: string) {
    event.stopPropagation();

    const dialogRef = this._commonService.openDialog(
      ShowImageDialogComponent,
      '50vw',
      { src: src }
    );
  }

  onSubmit() {
    const value = this.addOemForm.value;
    const image = this.addOemForm.value.images;

    if (image.whichFileOption === UploadOptions.URL) {
      if (image.imageUrl === null || image.imageUrl.toString().length <= 0) {
        this._commonService.openSnackBar(
          'Please Fill Image Url and Submit',
          'close'
        );
        return;
      }
    }
    if (image.whichFileOption === UploadOptions.UPLOAD && image.image === '') {
      this._commonService.openSnackBar(
        'Please Drop Image First and Submit',
        'close'
      );
      return;
    }

    if (this.addOemForm.invalid) {
      console.log('invalid');
      return;
    }
    const updateElementData = this.addOemForm.value;
    if (this.type === AddOemTableType.CATEGORY) {
      const temps: Array<CategoryModel> = this.dataSource
        .data as CategoryModel[];
      const indexValueForUpdate = temps.findIndex(
        (temp) => temp._id == updateElementData._id
      );
      if (updateElementData.images.whichFileOption === UploadOptions.URL) {
        updateElementData.imageUrl = image.imageUrl;
      }
      if (updateElementData.images.whichFileOption === UploadOptions.UPLOAD) {
        updateElementData.imageUrl = image.image;
      }
      delete updateElementData.images;

      this.imageDragDropGroup.patchValue({
        imageUrl: updateElementData.imageUrl,
      });

      temps[indexValueForUpdate] = updateElementData;

      this.updateTableDataSource(temps);

      this.selectedRow = {
        data: this.dataSource.data,
        type: this.type,
      };
      this.selectedRowChange.emit({
        data: this.dataSource.data,
        type: this.type,
      });

      this.selection.clear();
      this.selection.select(value);
      this.expandedElement = null;
      this.data = temps;
    }
    if (this.type === AddOemTableType.PRODUCT) {
      const temps: Array<ProductModel> = this.dataSource.data as ProductModel[];
      const indexValueForUpdate = temps.findIndex(
        (temp) => temp._id == updateElementData._id
      );
      updateElementData.imageUrls = temps[indexValueForUpdate].imageUrls;

      if (updateElementData.images.whichFileOption === UploadOptions.URL) {
        updateElementData.imageUrls[0] = image.imageUrl;
      }
      if (updateElementData.images.whichFileOption === UploadOptions.UPLOAD) {
        updateElementData.imageUrls[0] = image.image;
      }

      delete updateElementData.images;

      temps[indexValueForUpdate] = updateElementData;

      this.updateTableDataSource(temps);

      this.selectedRow = {
        data: this.dataSource.data,
        type: this.type,
      };
      this.selectedRowChange.emit({
        data: this.dataSource.data,
        type: this.type,
      });

      this.selection.clear();
      this.selection.select(value);
      this.expandedElement = null;
      this.data = temps;
    }
    if (this.type === AddOemTableType.SENSOR) {
      const temps: Array<SensorModel> = this.dataSource.data as SensorModel[];
      const indexValueForUpdate = temps.findIndex(
        (temp) => temp._id == updateElementData._id
      );
      if (updateElementData.images.whichFileOption === UploadOptions.URL) {
        updateElementData.imageUrl = image.imageUrl;
      }
      if (updateElementData.images.whichFileOption === UploadOptions.UPLOAD) {
        updateElementData.imageUrl = image.image;
      }
      delete updateElementData.images;

      temps[indexValueForUpdate] = updateElementData;

      this.updateTableDataSource(temps);

      this.selectedRow = {
        data: this.dataSource.data,
        type: this.type,
      };
      this.selectedRowChange.emit({
        data: this.dataSource.data,
        type: this.type,
      });

      this.expandedElement = null;
      this.selection.clear();
      this.selection.select(value);
      this.data = temps;
    }
  }
  updateTableDataSource(
    data: ProductModel[] | SensorModel[] | CategoryModel[]
  ) {
    if (this.data.length > 0) {
      if (this.type === AddOemTableType.CATEGORY) {
        this.dataSource.data = data as CategoryModel[];
        this.dataSource.sort = this.sort;
        this.table.dataSource = this.dataSource;
        this.data = this.dataSource.data;
      }
      if (this.type === AddOemTableType.SENSOR) {
        this.dataSource.data = data as CategoryModel[];
        this.dataSource.sort = this.sort;
        this.table.dataSource = this.dataSource;
        this.data = this.dataSource.data;
      }
      if (this.type === AddOemTableType.PRODUCT) {
        this.dataSource.data = data as CategoryModel[];
        this.dataSource.sort = this.sort;
        this.table.dataSource = this.dataSource;
        this.data = this.dataSource.data;
      }
    } else {
      if (this.table) {
        if (this.type === AddOemTableType.PRODUCT) {
          this.dataSource.data = [];
          this.dataSource.sort = this.sort;
          this.table.dataSource = this.dataSource;
          this.data = this.dataSource.data;
        }
        if (this.type === AddOemTableType.CATEGORY) {
          this.dataSource.data = [];
          this.dataSource.sort = this.sort;
          this.table.dataSource = this.dataSource;
          this.data = this.dataSource.data;
        }
        if (this.type === AddOemTableType.SENSOR) {
          this.dataSource.data = [];
          this.dataSource.sort = this.sort;
          this.table.dataSource = this.dataSource;
          this.data = this.dataSource.data;
        }
      }
    }
  }
}
