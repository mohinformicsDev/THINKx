import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'apps/thinkx/src/app/shared/service/common.service';
import { ProductFeatureModel } from '../../../../model/product-feature.model';
import { DeleteConfirmDialogComponent } from '../../../../shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { HttpService } from '../../../../shared/http-service.service';
import { LoadingOption } from '../../../../shared/loading-options.enum';
import { ShowImageDialogComponent } from '../../../../shared/show-image-dialog/show-image-dialog.component';
import { ProductFeatureListDataSource } from './product-feature-list-datasource';

@Component({
  selector: 'thinkx-product-feature-list',
  templateUrl: './product-feature-list.component.html',
  styleUrls: ['./product-feature-list.component.scss'],
})
export class ProductFeatureListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ProductFeatureModel>;

  dataSource: ProductFeatureListDataSource;
  isLoading = true;
  isLoadingType: LoadingOption;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'name',
    'type',
    'isEditable',
    'isEmergency',
    'menu',
  ];
  matMenuItems = [{ name: 'Edit' }, { name: 'Delete' }];

  constructor(
    private _commonService: CommonService,
    private _httpService: HttpService
  ) {
    this._commonService.setTitle('Product');
    this.dataSource = new ProductFeatureListDataSource();
    this.isLoadingType = LoadingOption.NEW;
    this.getResponse();
  }

  get loadingOption() {
    return LoadingOption;
  }

  async getResponse(_message?: string, _close?: string) {
    try {
      const data = await this._httpService.get<ProductFeatureModel[]>('/product-feature');

      this.dataSource =
        data?.length !== 0
          ? new ProductFeatureListDataSource(data)
          : new ProductFeatureListDataSource();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
      if (_message !== undefined && _close !== undefined) {
        this._commonService.openSnackBar(_message, _close);
      }
    } catch (error) {
      console.log(error);
      this._commonService.openSnackBar(error?.message, 'close');
    } finally {
      this.isLoading = false;
    }
  }

  updateTableDataSource(data: ProductFeatureModel[]) {
    this.dataSource.data = data;
    const dataSource = new MatTableDataSource(this.dataSource.data);
    this.table.dataSource = dataSource;
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

  deleteConfirmationDialog(row: ProductFeatureModel) {
    const openDialog = this._commonService.openDialog(
      DeleteConfirmDialogComponent,
      '20vw'
    );
    openDialog.afterClosed().subscribe((confirm: string) => {
      if (confirm) {
        const activeElement: ProductFeatureModel = row;
        const url = '/product-feature/' + activeElement._id;
        this.isLoading = true;
        this.isLoadingType = LoadingOption.REFRESH;
        this._httpService
          .delete(url)
          .then(() => {
            this.getResponse('Data is deleted', 'close');
          })
          .catch((e: HttpErrorResponse) => {
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
}
