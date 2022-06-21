import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DeviceModel } from '../../model/device.model';
import { ProductModel } from '../../model/product.model';
import { DeleteConfirmDialogComponent } from '../../shared/delete-confirm-dialog/delete-confirm-dialog.component';
import { HttpService } from '../../shared/http-service.service';
import { LoadingOption } from '../../shared/loading-options.enum';
import { CommonService } from '../../shared/service/common.service';
import { ShowImageDialogComponent } from '../../shared/show-image-dialog/show-image-dialog.component';
import { AddDeviceFormComponent } from './add-device-form/add-device-form.component';
import { DeviceDataSource } from './device-datasource';
import { ExcelDataDisplayComponent } from './excel-data-display/excel-data-display.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'thinkx-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss'],
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
export class DeviceComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DeviceModel>;

  dataSource: DeviceDataSource;
  isLoading = true;
  isLoadingType: LoadingOption;

  localInstanceOfDevice: DeviceModel[] = [];

  options: ProductModel[] = [];
  products: ProductModel[] = [];
  showPassword = true;
  expandedElement: DeviceModel | null = null;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    'id',
    'deviceId',
    'name',
    'warrantyEndDate',
    'devicePassword',
    'status',
    'active',
    'manufactureDate',
    'soldTo',
    'productType',
    'enrollmentDate',
    'expand',
  ];

  deviceForm = new FormGroup({
    _id: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    deviceId: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    warrantyDays: new FormControl('1', [Validators.required]),
    devicePassword: new FormControl('', [Validators.required]),
    manufactureDate: new FormControl('', [Validators.required]),
    enrollmentDate: new FormControl('', []),
    status: new FormControl(false),
    active: new FormControl(false),
    soldTo: new FormControl('', [Validators.required]),
    productType: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
  });
  submitted = false;

  constructor(
    private _commonService: CommonService,
    private _httpService: HttpService
  ) {
    this._commonService.setTitle('Device');
    this.dataSource = new DeviceDataSource();
    // this.filteredOptions = new Observable<string[]>();
    this.isLoadingType = LoadingOption.NEW;
  }

  downloadFile() {
    // let data = [
    //     'customerId',
    //     'active',
    //     'status',
    //     'deviceId',
    //     'name',
    //     'warrantyDays',
    //     'devicePassword',
    //     'manufactureDate',
    //     'soldTo',
    //     'productType'
    // }
    // ];
    // const replacer = (key: string, value: string | number) =>
    //   value === null ? '' : value; // specify how you want to handle null values here
    // const header = Object.keys(data[0]);
    // console.log(header);
    // let csv = data.map((row: any) => {
    //   return header
    //     .map((fieldName: any) => {
    //       let data = JSON.stringify(row[fieldName], replacer);
    //       return data;
    //     })
    //     .join(',');
    // });
    let header = [
      'deviceId',
      'name',
      'warrantyDays',
      'devicePassword',
      'status',
      'active',
      'manufactureDate(YYYY/MM/DD)',
      'soldTo',
      'productType',
    ];
    let csvArray = header.join(',');

    // let csvArray = csv.join('\r\n');
    console.log(csvArray);
    var blob = new Blob([csvArray], { type: 'text/csv' });
    saveAs(blob, 'device.csv');
  }

  ngOnInit() {
    this._httpService
      .get<ProductModel[]>('/product')
      .then((data) => {
        if (data !== undefined) {
          this.products = Object.assign([], data);
          this.options = Object.assign([], data);
          this.getResponse();
          // this.filteredOptions = this.deviceForm.controls.productType.valueChanges.pipe(
          //   startWith(''),
          //   map((value) => this._filter(value))
          // );
        }
      })
      .catch((err) => console.log(err));
  }

  get f() {
    return this.deviceForm.controls;
  }

  get loadingOption() {
    return LoadingOption;
  }

  // private _filter(value: string): string[] {
  // const filterValue = value.toLowerCase();
  // return this.options.filter((option) =>
  //   option.name.toLowerCase().includes(filterValue)
  // );
  // }

  getErrorMessage() {
    return 'This Field is required';
  }

  getProductName(id: string) {
    return this.products.find((x) => x._id == id)?.name;
  }

  async getResponse(message?: string, close?: string) {
    if (this.products.length >= 0) {
      try {
        const data = await this._httpService.get<DeviceModel[]>('/device');
        this.localInstanceOfDevice = data;

        data.forEach((data) => {
          if (this.products.length !== 0) {
            const t = this.products.filter((value: ProductModel) => {
              return (value._id == data.productType);
            });
            if (t.length > 0) data.productType = t[0]._id;
          }
        });

        this.dataSource =
          data?.length !== 0
            ? new DeviceDataSource(data)
            : new DeviceDataSource();

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
        if (message !== undefined && close !== undefined) {
          this._commonService.openSnackBar(message, close);
        }
      } catch (error) {
        console.log(error);
        this.isLoading = false;
        this._commonService.openSnackBar(error?.message, 'close');
      } finally {
        this.isLoading = false;
      }
    } else {
      this.getResponse(message, close);
    }
  }

  // compare(a: number | string, b: number | string, isAsc: boolean) {
  //   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  // }

  // onSortData(sort: Sort) {
  // let data = this.dataSource.data.slice();
  // console.log(sort.active);
  // if (sort.active && sort.direction !== '') {
  //   data = data.sort((a: DeviceModel, b: DeviceModel) => {
  //     const isAsc = sort.direction === 'asc';
  //     switch (sort.active) {
  //       case 'deviceId':
  //         return a[sort.active].localeCompare(b[sort.active], 'en', {
  //           sensitivity: 'base',
  //         });
  //       // return this.compare(a[sort.active], b[sort.active], isAsc);
  //       case 'beds':
  //       //   return this.compare(a.beds, +b.beds, isAsc);
  //       // case 'baths':
  //       //   return this.compare(+a.baths, +b.baths, isAsc);
  //       // case 'sqft':
  //       //   return this.compare(+a.sqft, +b.sqft, isAsc);
  //       default:
  //         return 0;
  //     }
  //   });
  // }
  // this.dataSource = new DeviceDataSource(data);
  // }

  dateFormat(date: string): string {
    let formatDate;
    formatDate = new Date(date);
    let month: string = (formatDate.getMonth() + 1).toString();
    month =
      month.toString().length === 1
        ? `0${month.toString()}`
        : `${month.toString()}`;
    let localDate: string = formatDate.getDate().toString();
    localDate =
      localDate.toString().length === 1
        ? `0${localDate.toString()}`
        : `${localDate.toString()}`;
    formatDate = `${formatDate.getFullYear()}-${month}-${localDate}`;
    return formatDate;
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

  // click event function for adding device
  addDeviceDialog() {
    const openDialog = this._commonService.openDialog(
      AddDeviceFormComponent,
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
    this.getResponse();
  }

  uploadExcelFile(event: any) {
    const deviceData: DeviceModel[] = [];

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        const read: string = reader.result as string;
        const data: string[] = read.toString().split('\r');
        // data.pop();
        let header = data[0];
        for (let index = 1; index < data.length; index++) {
          const result: string = data[index];
          const array: string[] = result.trim().split(',');

          for (let j = 0; j < array.length; j++) {
            const element = array[j];
            array[j] = element.toString().replace('"', '').trim();
          }
          // re assigning value of data
          // result = JSON.stringify(array);
          // data[index] = result;

          const deviceModel: DeviceModel = {
            _id: index.toString(),
            name: array[1],
            deviceId: array[0],
            warrantyDays: parseInt(array[2]),
            devicePassword: array[3],
            manufactureDate: array[6],
            status:
              array[4] === 'ENABLE' ||
              array[4] === 'enable' ||
              array[4] === 'TRUE' ||
              array[4] === 'true'
                ? true
                : false,
            active:
              array[5] === 'ENABLE' ||
              array[5] === 'enable' ||
              array[5] === 'TRUE' ||
              array[5] === 'true'
                ? true
                : false,
            soldTo: array[7],
            productType: array[8],
            enrollmentDate: array[9]
          };
          deviceData.push(deviceModel);
        }
        // removing column
        // deviceData.shift();

        const openDialog = this._commonService.openDialog(
          ExcelDataDisplayComponent,
          '100%',
          { data: deviceData }
        );
        openDialog.afterClosed().subscribe((data: DeviceModel[]) => {
          if (data) {
            this.isLoading = true;
            this.isLoadingType = LoadingOption.REFRESH;
            const temp: {
              name: string;
              deviceId: string;
              warrantyDays: number;
              devicePassword: string;
              manufactureDate: string;
              status: boolean;
              active: boolean;
              soldTo: string;
              productType: string;
            }[] = [];
            data.forEach((element) => {
              const pushData: {
                name: string;
                deviceId: string;
                warrantyDays: number;
                devicePassword: string;
                manufactureDate: string;
                status: boolean;
                active: boolean;
                soldTo: string;
                productType: string;
              } = {
                name: element.name,
                deviceId: element.deviceId,
                warrantyDays: element.warrantyDays,
                devicePassword: element.devicePassword,
                manufactureDate: element.manufactureDate,
                status: element.status,
                active: element.active,
                soldTo: element.soldTo,
                productType: element.productType,
              };
              temp.push(pushData);
            });

            console.log(temp);

            this._httpService
              .post('/device/import', temp)
              .then(() => {
                this._commonService.openSnackBar('valid data added', 'close');
                this.getResponse();
              })
              .catch((error: HttpErrorResponse) => {
                this.isLoading = false;
                this._commonService.openSnackBar(error?.error.message, 'close');
                console.log(error.error);
              });
          }
        });
      };
      reader.readAsText(event.target.files[0]);
    }
  }

  convertDaysToDate(enrollmentDate: string, days: number){
    var enrollDate = new Date(enrollmentDate);
    enrollDate = new Date(enrollDate.setDate(enrollDate.getDate() + days));
    return this.dateFormat(enrollDate.toDateString())
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
          const activeElement: DeviceModel = this.expandedElement;
          const url = '/device/' + activeElement._id;
          this.isLoading = true;
          this.isLoadingType = LoadingOption.REFRESH;

          this._httpService
            .delete(url)
            .then(() => {
              this.expandedElement = null;
              this.getResponse('Data is deleted', 'close');
            })
            .catch((e: HttpErrorResponse) => {
              this.isLoading = false;
              this._commonService.openSnackBar(e.error.message, 'close');
            });
        }
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
    const value = this.deviceForm.value;
    console.log(value);

    if (this.deviceForm.invalid) {
      return;
    }

    // const selectedProduct = this.products.filter((element: ProductModel) => {
    //   return element.name === value.productType;
    // }) as ProductModel[];

    // value.productType = selectedProduct[0]._id;

    value.manufactureDate = this.dateFormat(value.manufactureDate);

    const url = '/device/' + value._id;
    delete value._id;

    this.isLoading = true;
    this.isLoadingType = LoadingOption.REFRESH;
    console.log(value);
    // return;

    this._httpService
      .patch(url, value)
      .then(() => {
        this.getResponse('Data is Updated', 'close');
      })
      .catch((e: HttpErrorResponse) => {
        this.isLoading = false;
        this._commonService.openSnackBar(e.error.message, 'close');
      });
  }

  rowSelected(element: DeviceModel) {
    this.deviceForm.patchValue({
      _id: element._id,
      name: element.name,
      deviceId: element.deviceId,
      warrantyDays: element.warrantyDays,
      devicePassword: element.devicePassword,
      manufactureDate: new Date(element.manufactureDate),
      status: element.status,
      active: element.active,
      soldTo: element.soldTo,
      productType: element.productType,
    });
  }
}
