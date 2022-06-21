import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommonService } from 'apps/thinkx/src/app/shared/service/common.service';
import { SensorFeatureModel } from '../../../../model/sensor-feature.model';
import { DeleteConfirmDialogComponent } from '../../../../shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { HttpService } from '../../../../shared/http-service.service';
import { LoadingOption } from '../../../../shared/loading-options.enum';
import { ShowImageDialogComponent } from '../../../../shared/show-image-dialog/show-image-dialog.component';
import { SensorFeatureListDataSource } from './sensor-feature-list-datasource';

@Component({
  selector: 'thinkx-sensor-feature-list',
  templateUrl: './sensor-feature-list.component.html',
  styleUrls: ['./sensor-feature-list.component.scss'],
})
export class SensorFeatureListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<SensorFeatureModel>;

  dataSource: SensorFeatureListDataSource;
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
    this._commonService.setTitle('Sensor');
    this.dataSource = new SensorFeatureListDataSource();
    this.isLoadingType = LoadingOption.NEW;
    this.getResponse();
  }

  get loadingOption() {
    return LoadingOption;
  }

  async getResponse(message?: string, close?: string) {
    try {
      const data = await this._httpService.get<SensorFeatureModel[]>('/sensor-feature');
      this.dataSource =
        data?.length !== 0
          ? new SensorFeatureListDataSource(data)
          : new SensorFeatureListDataSource();
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

  updateTableDataSource(data: SensorFeatureModel[]) {
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

  deleteConfirmationDialog(row: SensorFeatureModel) {
    const openDialog = this._commonService.openDialog(
      DeleteConfirmDialogComponent,
      '20vw'
    );
    openDialog.afterClosed().subscribe((confirm: string) => {
      if (confirm) {
        const activeElement: SensorFeatureModel = row;
        const url = '/sensor-feature/' + activeElement._id;
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
