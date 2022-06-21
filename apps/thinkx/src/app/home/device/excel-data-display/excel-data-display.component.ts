import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeviceModel } from '../../../model/device.model';

@Component({
  selector: 'thinkx-excel-data-display',
  templateUrl: './excel-data-display.component.html',
  styleUrls: ['./excel-data-display.component.scss'],
})
export class ExcelDataDisplayComponent implements OnInit {
  validData: DeviceModel[] = [];
  invalidData: DeviceModel[] = [];
  constructor(
    private dialogRef: MatDialogRef<ExcelDataDisplayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.segregateValidAndInvalidData(this.data.data);
  }

  segregateValidAndInvalidData(data: DeviceModel[]) {
    data.forEach((element: DeviceModel) => {
      if (
        this.checkValue(element.name) &&
        this.checkValue(element.deviceId) &&
        this.checkValue(element.warrantyDays) &&
        this.checkValue(element.devicePassword) &&
        this.checkValue(element.manufactureDate) &&
        this.checkValue(element.status) &&
        this.checkValue(element.active) &&
        this.checkValue(element.soldTo) &&
        this.checkValue(element.productType)
      ) {
        this.validData.push(element);
      } else {
        this.invalidData.push(element);
      }
    });
  }

  convertDaysToDate(enrollmentDate: string, days: number){
    var enrollDate = new Date(enrollmentDate);
    enrollDate = new Date(enrollDate.setDate(enrollDate.getDate() + days));
    return this.dateFormat(enrollDate.toDateString())
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

  checkValue(value: string | number | boolean) {
    if (value !== null && value !== '') {
      return true;
    }
    return false;
  }

  upload() {
    this.dialogRef.close(this.validData);
  }
}
