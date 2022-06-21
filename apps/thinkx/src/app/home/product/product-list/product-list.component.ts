import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CategoryModel } from '../../../model/category.model';
import { ProductModel } from '../../../model/product.model';
import { DeleteConfirmDialogComponent } from '../../../shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { HttpService } from '../../../shared/http-service.service';
import { LoadingOption } from '../../../shared/loading-options.enum';
import { CommonService } from '../../../shared/service/common.service';
import { ShowImageDialogComponent } from '../../../shared/show-image-dialog/show-image-dialog.component';
import { UploadOptions } from '../../../shared/upload-option.enum';
import { ProductListDataSource } from './product-list-datasource';

@Component({
  selector: 'thinkx-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
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
export class ProductListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProductModel>;
  @ViewChild('uploadFileInput') uploadFileInput: ElementRef | undefined;

  submitted = false;
  productForm = new FormGroup({
    _id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.nullValidator]),
    category: new FormControl(''),
  });

  options: string[] = [];
  filteredOptions: Observable<string[]>;
  categories: CategoryModel[] = [];

  dataSource: ProductListDataSource;
  isLoading = true;
  isLoadingType: LoadingOption = LoadingOption.NEW;

  matMenuItems = [{ name: 'Edit' }, { name: 'Delete' }];

  // *Variables for Image Drag and drop
  imageDragDropGroup: FormGroup = this._fb.group({
    whichFileOption: this._fb.control(''),
    image: this._fb.control(''),
    imageUrl: this._fb.control(''),
  });

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'category', 'image', 'menu'];
  constructor(
    private _commonService: CommonService,
    private _fb: FormBuilder,
    private _httpService: HttpService
  ) {
    this._commonService.setTitle('Product');
    this.dataSource = new ProductListDataSource();
    this.filteredOptions = new Observable<string[]>();
  }

  async ngOnInit() {
    this.productForm.addControl('images', this.imageDragDropGroup);
    try {
      const data = await this._httpService.get<CategoryModel[]>('/category');

      if (data !== undefined) {
        this.categories = [...data];
        this.options = data.map(x => x.name);
        // data.forEach((element) => {
        //   this.options.push(element.name);
        // this.categories.push(element);
        // });
      }
      await this.getResponse();
      this.filteredOptions = this.productForm.controls.category.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
    } catch (error) {
      console.log(error);
      this._commonService.openSnackBar(error?.message, 'close');
    } finally {
      this.isLoading = false;
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) => option.toLowerCase().includes(filterValue)
    );
  }

  async getResponse(message?: string, close?: string) {
    if (this.categories.length >= 0) {
      try {
        const data = await this._httpService.get<ProductModel[]>('/product');
        this.dataSource =
          data?.length !== 0
            ? new ProductListDataSource(data)
            : new ProductListDataSource();

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
        if (message !== undefined && close !== undefined) {
          this._commonService.openSnackBar(message, close);
        }
      } catch (error) {
        console.log(error);
        this._commonService.openSnackBar(error?.message, 'close');
      } finally {
        this.isLoading = false;
      }
    } else {
      this.getResponse(message, close);
    }
  }

  getErrorMessage() {
    return 'This filed is required';
  }

  get f() {
    return this.productForm.controls;
  }

  get loadingOption() {
    return LoadingOption;
  }

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

  refresh() {
    this.isLoading = true;
    this.isLoadingType = LoadingOption.REFRESH;
    this.getResponse();
  }

  deleteConfirmationDialog(row: ProductModel) {
    const openDialog = this._commonService.openDialog(
      DeleteConfirmDialogComponent,
      '20vw'
    );

    openDialog.afterClosed().subscribe((confirm: string) => {
      if (confirm) {
        const activeElement: ProductModel = row;
        console.log(activeElement);
        const url = '/product/' + activeElement._id;
        this.isLoading = true;
        this.isLoadingType = LoadingOption.REFRESH;
        this._httpService
          .delete(url)
          .then(() => {
            this.getResponse('Data is deleted', 'close');
          })
          .catch((e: HttpErrorResponse) => {
            this.isLoading = false;
            this._commonService.openSnackBar(e.error.message, 'close');
          });
      }
    });
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
    this.submitted = true;
    const value = this.productForm.value;
    const image = this.productForm.value.images;

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

    if (this.productForm.invalid) {
      return;
    }

    if (value.images.whichFileOption === UploadOptions.URL) {
      value.imageUrl = image.imageUrl;
    }

    if (value.images.whichFileOption === UploadOptions.UPLOAD) {
      value.imageUrl = image.image;
    }

    delete value.images;

    const selectedCategory = this.categories.filter(
      (element: CategoryModel) => {
        return element.name === value.category;
      }
    ) as CategoryModel[];

    value.category = selectedCategory[0]._id;

    const url = '/product/' + value._id;
    this.isLoading = true;
    this.isLoadingType = LoadingOption.REFRESH;
    this._httpService
      .patch(url, value)
      .then(() => {
        this.isLoading = false;
        this.getResponse('Data is Updated', 'close');
      })
      .catch((e: HttpErrorResponse) => {
        this.isLoading = false;
        this._commonService.openSnackBar(e.error.message, 'close');
      });
  }

  rowSelected(element: ProductModel) {
    this.productForm.patchValue({
      _id: element._id,
      name: element.name,
      category: element.category,
    });
    this.imageDragDropGroup.patchValue({
      imageUrl: element.imageUrls[0],
    });
  }
}
