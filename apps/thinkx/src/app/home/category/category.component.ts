import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CategoryModel } from '../../model/category.model';
import { DeleteConfirmDialogComponent } from '../../shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { HttpService } from '../../shared/http-service.service';
import { LoadingOption } from '../../shared/loading-options.enum';
import { CommonService } from '../../shared/service/common.service';
import { ShowImageDialogComponent } from '../../shared/show-image-dialog/show-image-dialog.component';
import { UploadOptions } from '../../shared/upload-option.enum';
import { AddCategoryFormComponent } from './add-category-form/add-category-form.component';
import { CategoryDataSource } from './category-datasource';

@Component({
  selector: 'thinkx-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
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
export class CategoryComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<CategoryModel>;

  submitted = false;
  categoryForm = new FormGroup({
    _id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });

  dataSource: CategoryDataSource;
  isLoading = true;
  isLoadingType: LoadingOption;
  expandedElement: CategoryModel | null = null;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'image', 'expand'];

  // *Variables for Image Drag and drop
  imageDragDropGroup: FormGroup = this._fb.group({
    whichFileOption: this._fb.control(''),
    image: this._fb.control(''),
    imageUrl: this._fb.control(''),
  });

  constructor(
    private _commonService: CommonService,
    private _fb: FormBuilder,
    private _httpService: HttpService
  ) {
    this._commonService.setTitle('Category');
    this.dataSource = new CategoryDataSource();

    this.isLoadingType = LoadingOption.NEW;
  }

  ngOnInit() {
    this.categoryForm.addControl('images', this.imageDragDropGroup);
  }

  ngAfterViewInit(): void {
    this.getResponse();
  }

  // Getters
  async getResponse(message?: string, close?: string) {
    try {
      const data = await this._httpService.get<CategoryModel[]>('/category');
      this.dataSource =
        data?.length !== 0
          ? new CategoryDataSource(data)
          : new CategoryDataSource();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
      if (message !== undefined && close !== undefined) {
        this._commonService.openSnackBar(message, close);
      }
    } catch (e: any) {
      console.log(e);
      this._commonService.openSnackBar(e.error.message ?? e.error, 'close');
    } finally {
      this.isLoading = false;
    }
  }

  get f() {
    return this.categoryForm.controls;
  }

  get loadingOption() {
    return LoadingOption;
  }

  getErrorMessage() {
    return 'This Field is required';
  }

  // updateTableDataSource(data: CategoryModel[]) {
  //   this.dataSource.data = data;
  //   const dataSource = new MatTableDataSource(this.dataSource.data);
  //   this.table.dataSource = dataSource;
  // }

  // Getters

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const dataSource = new MatTableDataSource(this.dataSource.data);
    dataSource.filter = filterValue.trim().toLowerCase();
    this.table.dataSource = dataSource.filteredData;
    this.paginator.length = dataSource.filteredData.length;
    this.dataSource.data = dataSource.filteredData;

    if (filterValue === '') {
      this.isLoading = true;
      this.isLoadingType = LoadingOption.REFRESH;
      this.getResponse();
    }
  }

  addCategoryDialog() {
    const openDialog = this._commonService.openDialog(
      AddCategoryFormComponent,
      '40vw'
    );

    openDialog.afterClosed().subscribe((data: boolean) => {
      if (data) {
        this.isLoading = true;
        this.isLoadingType = LoadingOption.REFRESH;
        this.getResponse('New data is added', 'close');
      }
    });
  }

  refresh() {
    this.isLoading = true;
    this.isLoadingType = LoadingOption.REFRESH;
    this.expandedElement = null;
    this.getResponse();
  }

  closeButtonExpanded() {
    this.expandedElement = null;
  }

  deleteConfirmationDialog() {
    const openDialog = this._commonService.openDialog(
      DeleteConfirmDialogComponent,
      '20vw'
    );

    openDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        if (this.expandedElement !== null) {
          const activeElement: CategoryModel = this.expandedElement;
          const url = '/category/' + activeElement._id;
          this.isLoading = true;
          this.isLoadingType = LoadingOption.REFRESH;

          this._httpService
            .delete(url)
            .then(() => {
              this.expandedElement = null;
              this.getResponse('Data is deleted', 'close');
            })
            .catch((e: HttpErrorResponse) => {
              console.log(e);
              this.isLoading = false;
              this._commonService.openSnackBar(e.error.error.message, 'close');
            });
        }
      }
    });
  }

  clickImage(event: Event, src: string) {
    event.stopPropagation();
    this._commonService.openDialog(ShowImageDialogComponent, '50vw', {
      src: src,
    });
  }

  onSubmit() {
    this.submitted = true;
    const value = this.categoryForm.value;
    const image = this.categoryForm.value.images;

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

    if (this.categoryForm.invalid) {
      console.log('invalid');
      return;
    }

    if (value.images.whichFileOption === UploadOptions.URL) {
      value.imageUrl = image.imageUrl;
    }

    if (value.images.whichFileOption === UploadOptions.UPLOAD) {
      value.imageUrl = image.image;
    }

    // delete value.images;
    delete value.images;

    const url = '/category/' + value._id;

    delete value._id;

    this.isLoading = true;
    this.isLoadingType = LoadingOption.REFRESH;

    this._httpService
      .patch(url, value)
      .then(() => {
        this.getResponse('Data is Updated', 'close');
      })
      .catch((e: HttpErrorResponse) => {
        console.log(e);
        this.isLoading = false;
        this._commonService.openSnackBar(e.error.message, 'close');
      });
  }

  rowSelected(element: any) {
    console.log(element);
    this.categoryForm.patchValue({
      _id: element._id,
      name: element.name,
    });

    this.imageDragDropGroup.patchValue({
      imageUrl: element.imageUrl,
    });
  }
}
