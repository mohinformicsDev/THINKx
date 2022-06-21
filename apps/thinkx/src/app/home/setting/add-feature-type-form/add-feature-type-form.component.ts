import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpService } from '../../../shared/http-service.service';
import { CommonService } from '../../../shared/service/common.service';

@Component({
  selector: 'thinkx-add-feature-type-form',
  templateUrl: './add-feature-type-form.component.html',
  styleUrls: ['./add-feature-type-form.component.scss']
})
export class AddFeatureTypeFormComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('submit') submit: MatButton | undefined;
  @ViewChild('uploadFileInput') uploadFileInput: ElementRef | undefined;

  submitted = false;

  featureType = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.nullValidator]),
    actionToPerform: new FormControl([], [Validators.required, Validators.nullValidator])
  });

  constructor(
    private dialogRef: MatDialogRef<AddFeatureTypeFormComponent>,
    private _commonService: CommonService,
    private _httpService: HttpService
  ) {
    this._commonService.setTitle('Category');
  }
  ngOnInit(): void {
  }

  // getting the value or getter
  get f() {
    return this.featureType.controls;
  }

  onSubmit() {
    this.submitted = true;
    const value = this.featureType.value;

    if (this.featureType.invalid) {
      console.log('invalid');
      return;
    }

    this._httpService.post('/category', value).then(() => {
      this.dialogRef.close('closed');
    });
  }

  getErrorMessage() {
    return 'This Field is required';
  }

  onSubmitButton() {
    if (this.submit !== undefined) {
      this.submit._elementRef.nativeElement.click();
    }
  }

}
