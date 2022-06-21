import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductModel } from '../../../model/product.model';
import { HttpService } from '../../../shared/http-service.service';
import { CommonService } from '../../../shared/service/common.service';
@Component({
  selector: 'thinkx-add-device-form',
  templateUrl: './add-device-form.component.html',
  styleUrls: ['./add-device-form.component.scss'],
})
export class AddDeviceFormComponent implements OnInit {
  @ViewChild('submit') submit: MatButton | undefined;

  submitted = false;
  isChecked = false;
  isActive = false;
  showPassword = true;
  deviceForm = new FormGroup({
    deviceId: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    warrantyDays: new FormControl('1', [Validators.required]),
    devicePassword: new FormControl('', [Validators.required]),
    status: new FormControl(false),
    active: new FormControl(false),
    manufactureDate: new FormControl('', [Validators.required]),
    soldTo: new FormControl('', [Validators.required]),
    productType: new FormControl('', [Validators.required]),
  });

  options: string[] = [];
  products: ProductModel[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddDeviceFormComponent>,
    private _httpService: HttpService,
    private _commonService: CommonService
  ) {
    this._commonService.setTitle('Device');
  }

  ngOnInit() {
    this.deviceForm.controls.productType.disable();
    this._httpService.get<ProductModel[]>('/product').then((data) => {
      data.forEach((product: ProductModel) => {
        this.deviceForm.controls.productType.enable();
        this.products.push(product);
        this.options.push(product.name);
      });
    });
    this.dialogRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        this.onClose();
      }
    });
    this.dialogRef.backdropClick().subscribe(() => {
      this.onClose();
    });
  }
  onClose(): void {
    this.dialogRef.close(false);
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

  onSubmit() {
    this.submitted = true;
    const value = this.deviceForm.value;
    if (this.deviceForm.invalid) {
      console.log('invalid');
      return;
    }
    value.manufactureDate = this.dateFormat(value.manufactureDate);
    const selectedProduct = this.products.find((element: ProductModel) => {
      return (
        element.name === value.productType || element._id === value.productType
      );
    }) as ProductModel;
    value.productType = selectedProduct._id;

    this._httpService
      .post('/device', value)
      .then(() => {
        this.dialogRef.close('closed');
      })
      .catch((e) => {
        this._commonService.openSnackBar(e.error.message, 'close');
      });
  }

  get f() {
    return this.deviceForm.controls;
  }

  getErrorMessage() {
    return 'This Field is required';
  }

  status() {
    this.isChecked = !this.isChecked;
  }

  active() {
    this.isActive = !this.isActive;
  }

  onSubmitButton() {
    if (this.submit !== undefined) {
      this.submit._elementRef.nativeElement.click();
    }
  }
}
