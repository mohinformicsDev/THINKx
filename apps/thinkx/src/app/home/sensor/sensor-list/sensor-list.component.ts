import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SensorModel } from '../../../model/sensor.model';
import { DeleteConfirmDialogComponent } from '../../../shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { HttpService } from '../../../shared/http-service.service';
import { LoadingOption } from '../../../shared/loading-options.enum';
import { CommonService } from '../../../shared/service/common.service';
import { ShowImageDialogComponent } from '../../../shared/show-image-dialog/show-image-dialog.component';
import { SensorListDataSource } from './sensor-list-datasource';
@Component({
  selector: 'thinkx-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss'],
})
export class SensorListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<SensorModel>;

  dataSource: SensorListDataSource;
  isLoading = true;
  isLoadingType: LoadingOption;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name', 'image', 'menu'];
  matMenuItems = [{ name: 'Edit' }, { name: 'Delete' }];

  constructor(
    private _commonService: CommonService,
    private _httpService: HttpService
  ) {
    this._commonService.setTitle('Sensor');
    this.dataSource = new SensorListDataSource();
    this.isLoadingType = LoadingOption.NEW;
    this.getResponse();
  }

  async getResponse(message?: string, close?: string) {
    try {
      const data = await this._httpService.get<SensorModel[]>('/sensor');
      this.dataSource =
        data?.length !== 0
          ? new SensorListDataSource(data)
          : new SensorListDataSource();
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
  }

  get loadingOption() {
    return LoadingOption;
  }

  getErrorMessage() {
    return 'This Field is required';
  }

  updateTableDataSource(data: SensorModel[]) {
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

  deleteConfirmationDialog(row: SensorModel) {
    const openDialog = this._commonService.openDialog(
      DeleteConfirmDialogComponent,
      '20vw'
    );
    openDialog.afterClosed().subscribe((confirm: string) => {
      if (confirm) {
        const activeElement: SensorModel = row;
        const url = '/sensor/' + activeElement._id;
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
}
