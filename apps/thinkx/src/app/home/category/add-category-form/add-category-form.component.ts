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
import { UploadOptions } from '../../../shared/upload-option.enum';

@Component({
  selector: 'thinkx-add-category-form',
  templateUrl: './add-category-form.component.html',
  styleUrls: ['./add-category-form.component.scss'],
})
export class AddCategoryFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @ViewChild('submit') submit: MatButton | undefined;
  @ViewChild('uploadFileInput') uploadFileInput: ElementRef | undefined;

  submitted = false;

  category = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.nullValidator]),
  });

  // *Variables for Image Drag and drop
  imageDragDropGroup: FormGroup = this._fb.group({
    whichFileOption: this._fb.control(''),
    image: this._fb.control(''),
    imageUrl: this._fb.control(''),
  });

  constructor(
    private dialogRef: MatDialogRef<AddCategoryFormComponent>,
    private _fb: FormBuilder,
    private _commonService: CommonService,
    private _httpService: HttpService
  ) {
    this._commonService.setTitle('Category');
  }
  ngOnInit(): void {
    this.category.addControl('images', this.imageDragDropGroup);
  }

  // getting the value or getter
  get f() {
    return this.category.controls;
  }

  onSubmit() {
    this.submitted = true;
    const value = this.category.value;
    const image = this.category.value.images;

    if (image.whichFileOption === UploadOptions.URL) {
      if (image.imageUrl === null || image.imageUrl.toString().length <= 0) {
        this._commonService.openSnackBar(
          'Please Fill Image Url and Submit',
          'close'
        );
        return;
      }
    }
    if (image.whichFileOption === UploadOptions.UPLOAD && image.image === '') {
      this._commonService.openSnackBar(
        'Please Drop Image First and Submit',
        'close'
      );
      return;
    }

    if (this.category.invalid) {
      console.log('invalid');
      return;
    }

    if (value.images.whichFileOption === UploadOptions.URL) {
      value.imageUrl = image.imageUrl;
    }

    if (value.images.whichFileOption === UploadOptions.UPLOAD) {
      value.imageUrl = image.image;
    }

    delete value.images;

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
