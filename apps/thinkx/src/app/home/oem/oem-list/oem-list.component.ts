import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { OemModel } from '../../../model/oem.model';
import { ProductModel } from '../../../model/product.model';
import { SensorModel } from '../../../model/sensor.model';
import { DeleteConfirmDialogComponent } from '../../../shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { HttpService } from '../../../shared/http-service.service';
import { LoadingOption } from '../../../shared/loading-options.enum';
import { CommonService } from '../../../shared/service/common.service';
import { ShowImageDialogComponent } from '../../../shared/show-image-dialog/show-image-dialog.component';
import { OemListDataSource } from './oem-list-datasource';

@Component({
  selector: 'thinkx-oem-list',
  templateUrl: './oem-list.component.html',
  styleUrls: ['./oem-list.component.scss'],
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
export class OemListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<OemModel>;
  dataSource: OemListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'oemId',
    'name',
    'status',
    'logo',
    'category',
    'product',
    'sensor',
    'menu',
  ];

  matMenuItems = [{ name: 'Edit' }, { name: 'Delete' }];

  isLoading = true;
  isLoadingType: LoadingOption = LoadingOption.NEW;
  isDisable = true;

  constructor(
    private _commonService: CommonService,
    private _httpService: HttpService
  ) {
    this._commonService.setTitle('OEM');
    this.dataSource = new OemListDataSource();
    this.isLoadingType = LoadingOption.NEW;
    this.getResponse();
    this.getResponseProduct();
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

  get loadingOption() {
    return LoadingOption;
  }

  getResponseProduct() {
    this._httpService.get<ProductModel[]>('/product').then((data) => {
      const tempProduct = data as ProductModel[];
      this._httpService.get<SensorModel[]>('/sensor').then((data) => {
        const tempSensor = data as SensorModel[];
        if (tempSensor.length > 0 || tempProduct.length > 0) {
          this.isDisable = false;
        } else {
          this.isDisable = true;
        }
      });
    });
  }

  async getResponse(message?: string, close?: string) {
    try {
      const data = (await this._httpService.get<OemModel[]>('/oem')) as OemModel[];
      this.dataSource =
        data?.length !== 0
          ? new OemListDataSource(data)
          : new OemListDataSource();
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

  // log(value: any) {
  //   console.log(value);
  //   return '';
  // }

  refresh() {
    this.isLoading = true;

    this.isLoadingType = LoadingOption.REFRESH;
    this.getResponse();
  }

  imageDialog(image: string) {
    const dialogRef = this._commonService.openDialog(
      ShowImageDialogComponent,
      '50vw',
      { src: image }
    );
  }

  deleteConfirmationDialog(row: OemModel) {
    const openDialog = this._commonService.openDialog(
      DeleteConfirmDialogComponent,
      '20vw'
    );
    openDialog.afterClosed().subscribe((confirm: string) => {
      if (confirm) {
        const activeElement: OemModel = row;
        const url = '/oem/' + activeElement._id;
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
}
