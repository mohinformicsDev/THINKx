import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CustomerModel } from '../../model/customer.model';
import { DeviceModel } from '../../model/device.model';
import { ProductModel } from '../../model/product.model';
import { HttpService } from '../../shared/http-service.service';
import { LoadingOption } from '../../shared/loading-options.enum';
import { CommonService } from '../../shared/service/common.service';
import { columnSelectAllInterface } from './column-select-all-interface.enum';
import { CustomerDataSource } from './customer-datasource';

@Component({
  selector: 'thinkx-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
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
export class CustomerComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<CustomerModel>;

  dataSource: CustomerDataSource;
  expandedElement: CustomerModel | null = null;
  expandDetail: DeviceModel[] | null = null;

  isLoading = true;
  isLoadingType: LoadingOption;

  columnsSelectAll: columnSelectAllInterface[] = [];

  allColumn = false;
  data: CustomerModel[] = [];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns: string[] = [
    'id',
    'name',
    'email',
    'mobile',
    'oemId',
    'devices',
    'city',
    'state',
    'country',
    'columnFilter',
  ];

  columnsToDisplay: string[] = this.displayedColumns.slice();

  constructor(
    private _httpService: HttpService,
    private _commonService: CommonService
  ) {
    this._commonService.setTitle('Customer');
    this.dataSource = new CustomerDataSource();
    this.isLoadingType = LoadingOption.NEW;
  }

  ngOnInit() {
    this.columnsToDisplay.forEach((column, index) => {
      if (column !== 'columnFilter' && column !== 'id') {
        const t: columnSelectAllInterface = {
          columnName: column,
          isChecked: true,
          index: index,
        };
        this.columnsSelectAll.push(t);
      }
    });
    this.isAllSelect();
    this.getResponse();
  }

  get loadingOption() {
    return LoadingOption;
  }

  async getResponse() {
    try {
      const data = await this._httpService.get<CustomerModel[]>('/customer');
      const productData = await this._httpService.get<ProductModel[]>(
        '/product'
      );

      for (let i = 0; i < data.length; i++) {
        const devices = data[i].devices;

        for (let j = 0; j < devices.length; j++) {
          const device = devices[j];

          for (let k = 0; k < productData.length; k++) {
            const product = productData[k];
            if (product._id == device.productType) {
              device.productType = product.name;
            }
            devices[j] = device;
          }
          data[i].devices = devices;
        }
      }

      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.table.dataSource = this.dataSource;
      this.data = data;
    } catch (error) {
      console.log(error);
      this._commonService.openSnackBar(error?.message, 'close');
    } finally {
      this.isLoading = false;
    }
  }

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

  convertDaysToDate(enrollmentDate: string, days: number){
    var enrollDate = new Date(enrollmentDate);
    enrollDate = new Date(enrollDate.setDate(enrollDate.getDate() + days));
    return this.dateFormat(enrollDate.toDateString())
  }

  getDevicesData(deviceData: DeviceModel[]) {
    const value = deviceData.map((x: DeviceModel) => {
      const dataString =
        x.active +
        x.deviceId +
        x.devicePassword +
        x.productType +
        x.manufactureDate +
        x.name +
        x.soldTo +
        x.status +
        x.warrantyDays;
      return dataString.toString().toLocaleLowerCase();
    });
    return value;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // console.log(filterValue);
    const dataSource = new MatTableDataSource(this.dataSource.data);
    // console.log(dataSource);
    dataSource.filter = filterValue.trim().toLowerCase();
    dataSource.filterPredicate = (data: CustomerModel, filter: string) => {
      // const accumulator = (currentTerm: string, key: string) => {
      //   return this.nestedFilterCheck(currentTerm, data, key);
      // };
      // const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      // // Transform the filter by converting it to lowercase and removing whitespace.
      // const transformedFilter = filter.trim().toLowerCase();
      // return dataStr.indexOf(transformedFilter) !== -1;
      let dataStr =
        data.city +
        data.country +
        data.email +
        data.mobile +
        data.name +
        data.oemId +
        data.state +
        this.getDevicesData(data.devices);

      dataStr = dataStr.toString().toLowerCase();
      // console.log(dataStr);
      const result = dataStr.includes(filter);
      return result;
    };

    dataSource._filterData(dataSource.data);

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

  // dynamic columns functions
  columnCheckboxChangeEvent(columnedClicked: columnSelectAllInterface) {
    this.columnsSelectAll.map((column) => {
      if (column.columnName === columnedClicked.columnName) {
        column.isChecked = !column.isChecked;
        if (!column.isChecked) {
          this.removeElementFromArray(columnedClicked);
        } else {
          this.addElementInArray(columnedClicked);
        }
      }
    });
    this.isAllSelect();
  }

  checkAllColumnToggle() {
    if (this.allColumn === true) {
      this.falseAllColumn();
    } else {
      this.resetAllColumn();
    }
  }

  isAllSelect() {
    const result = false;
    const length = this.columnsSelectAll.length;
    let tempLength = 0;
    tempLength = this.columnsSelectAll.filter(
      (column) => column.isChecked === true
    ).length;
    if (length === tempLength) {
      this.allColumn = true;
    } else {
      tempLength = this.columnsSelectAll.filter(
        (column) => column.isChecked === false
      ).length;
      if (tempLength < length) {
        return true;
      } else {
        this.allColumn = false;
      }
    }
    return result;
  }

  resetAllColumn() {
    this.columnsSelectAll.forEach((column) => (column.isChecked = true));
    this.isAllSelect();
    this.columnsToDisplay = this.displayedColumns.slice();
  }

  falseAllColumn() {
    this.columnsSelectAll.forEach((column) => (column.isChecked = false));
    this.isAllSelect();
    this.columnsToDisplay = [
      this.displayedColumns[0],
      this.displayedColumns[this.displayedColumns.length - 1],
    ];
  }

  removeElementFromArray(columnSelect: columnSelectAllInterface) {
    this.columnsToDisplay = this.columnsToDisplay.filter(
      (column) => column !== columnSelect.columnName
    );
  }

  addElementInArray(_columnSelect: columnSelectAllInterface) {
    const temp: string[] = [];
    temp.push(this.displayedColumns[0].toString());
    // this.columnsSelectAll.forEach((column) => {
    //   if (column.isChecked) {
    //     temp.push(column.columnName);
    //   }
    // });
    this.columnsSelectAll.forEach((column) => {
      if (column.isChecked) {
        temp.push(column.columnName);
      }
    });
    temp.push(this.displayedColumns[this.displayedColumns.length - 1]);
    this.columnsToDisplay = temp;
  }
  // dynamic columns functions

  valueUpdate(value: { data: CustomerModel[] }) {
    this.dataSource.data = value.data as CustomerModel[];
    this.table.dataSource = new MatTableDataSource(this.dataSource.data);
  }

  rowSelected(element: any) {
    console.log(element.devices);

    // this.isLoading = true;
    // this.isLoadingType = LoadingOption.REFRESH;
    // try {
    //   const deviceData = (await this._httpService.get(
    //     '/device/deviceId/' + JSON.stringify(element.deviceId)
    //   )) as DeviceModel[];
    //   this.expandDetail = deviceData;
    // } catch (error) {
    //   this._commonService.openSnackBar(error?.message, 'close');
    // } finally {
    // }
    // this.isLoading = false;
  }
}
