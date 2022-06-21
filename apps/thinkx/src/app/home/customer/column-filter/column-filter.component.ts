import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CustomerModel } from '../../../model/customer.model';
import { columnValueSelectAllInterface } from '../column-select-all-interface.enum';

@Component({
  selector: 'thinkx-column-filter',
  templateUrl: './column-filter.component.html',
  styleUrls: ['./column-filter.component.scss'],
})
export class ColumnFilterComponent implements OnChanges {
  @Input() columnName = '';
  @Input() data: CustomerModel[] = [];
  @Output() selectedRowChange: EventEmitter<{
    data: CustomerModel[];
  }>;
  searchValue = '';

  checkboxToDisplay: CustomerModel[] = [];

  valueSelectAll: columnValueSelectAllInterface[] = [];
  valueDisplay: columnValueSelectAllInterface[] = [];
  allValue = true;

  constructor() {
    this.selectedRowChange = new EventEmitter();
  }

  ngOnChanges(change: SimpleChanges) {
    if (change.columnName) {
      this.columnName = change.columnName.currentValue;
    }
    if (change.data) {
      if (change.data.currentValue) {
        this.data = change.data.currentValue;
        this.checkboxToDisplay = change.data.currentValue;
        this.data.forEach((element, index) => {
          const data = this.getValueByColumn(this.columnName, element);
          const t: columnValueSelectAllInterface = {
            value: typeof data === 'string' ? data : data[0]?.deviceId,
            columnName: this.columnName,
            isChecked: true,
            index: index,
          };
          this.valueSelectAll.push(t);
          this.valueDisplay.push(t);
        });
        // this.data.forEach((element, index) => {
        //   const data = this.getValueByColumn(this.columnName, element);
        //   const t: columnValueSelectAllInterface = {
        //     value: data,
        //     columnName: this.columnName,
        //     isChecked: true,
        //     index: index,
        //   };
        //   this.valueSelectAll.push(t);
        //   this.valueDisplay.push(t);
        // });
      }
    }
  }

  getValueByColumn(columnName: string, data: CustomerModel) {
    if (columnName === 'name') return data.name;
    if (columnName === 'email') return data.email;
    if (columnName === 'mobile') return data.mobile;
    if (columnName === 'oemId') return data.oemId;
    if (columnName === 'devices') return data.devices;
    if (columnName === 'country') return data.country;
    if (columnName === 'country') return data.country;
    if (columnName === 'city') return data.city;
    if (columnName === 'state') return data.state;
    return '';
  }

  applyFilter() {
    this.valueDisplay = [...this.valueSelectAll];
    // this.valueSelectAll.forEach((element) => {
    //   this.valueDisplay.push(element);
    // });
    if (this.searchValue !== '') {
      const tempData: columnValueSelectAllInterface[] = [];
      this.valueDisplay.forEach((element) => {
        const t = element.value;
        if (t.includes(this.searchValue)) {
          tempData.push(element);
        }
      });
      this.valueDisplay = tempData.slice();
    }
  }

  changeColumnValue(_data: columnValueSelectAllInterface) {
    this.valueDisplay = this.valueDisplay.map((column) => {
      if (column.value === _data.value) {
        column.isChecked = !column.isChecked;
      }
      return column;
    });
    this.isAllSelect();
    this.filterData();
  }

  selectAll() {
    this.applyFilter();
    if (this.allValue === true) {
      this.falseAllColumn();
    } else {
      this.resetAllColumn();
    }
    this.filterData();
  }

  isAllSelect() {
    const result = false;
    const length = this.valueDisplay.length;
    let tempLength = this.valueDisplay.filter(
      (column) => column.isChecked === true
    ).length;

    if (length === tempLength) {
      this.allValue = true;
    } else {
      tempLength = this.valueDisplay.filter(
        (column) => column.isChecked === false
      ).length;
      if (tempLength < length) {
        return true;
      } else {
        this.allValue = false;
      }
    }
    return result;
  }

  resetAllColumn() {
    this.valueDisplay.forEach((column) => (column.isChecked = true));
    this.isAllSelect();
    this.valueDisplay = this.valueSelectAll.slice();
  }

  falseAllColumn() {
    this.valueDisplay.forEach((column) => (column.isChecked = false));
    this.valueSelectAll.forEach((column) => (column.isChecked = false));
    this.isAllSelect();
  }

  clearSelection() {
    this.valueDisplay.forEach((column) => (column.isChecked = false));
    this.valueSelectAll.forEach((column) => (column.isChecked = false));
    this.isAllSelect();
    this.filterData();
  }

  filterData() {
    // const tempChecked: string[] = [];
    // this.valueSelectAll.forEach((element) => {
    //   if (element.isChecked) {
    //     tempChecked.push(element.value);
    //   }
    // });

    const tempChecked = this.valueSelectAll
      .filter((e) => e.isChecked)
      .map((x) => x.value);

    const t = this.checkboxToDisplay.filter((element) => {
      if (this.columnName === 'name') {
        return tempChecked.includes(element.name);
      }
      if (this.columnName === 'email') {
        return tempChecked.includes(element.email);
      }
      if (this.columnName === 'mobile') {
        return tempChecked.includes(element.mobile);
      }
      if (this.columnName === 'oemId') {
        return tempChecked.includes(element.oemId);
      }
      if (this.columnName === 'city') {
        return tempChecked.includes(element.city);
      }
      if (this.columnName === 'country') {
        return tempChecked.includes(element.country);
      }
      if (this.columnName === 'state') {
        return tempChecked.includes(element.state);
      }
      if (this.columnName === 'deviceId') {
        return tempChecked.includes(element.devices[0].deviceId);
      }

      return false;
    });

    this.emitDataToParent(t);
  }

  emitDataToParent(value: CustomerModel[]) {
    this.selectedRowChange.emit({
      data: value,
    });
  }
}
